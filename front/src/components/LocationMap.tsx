import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_KEY = "AIzaSyDz7EaS7DBifoUovlVZ-px98yln32ZXZdE";

interface LocationMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

const LIBRARIES: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];

export default function LocationMap({ onLocationSelect, selectedLocation }: LocationMapProps) {
  const [internalLocation, setInternalLocation] = useState<{ lat: number; lng: number } | null>(null);
  // Use prop if provided, otherwise use internal state
  const location = selectedLocation ?? internalLocation;

  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_KEY || "AIzaSyDz7EaS7DBifoUovlVZ-px98yln32ZXZdEI",
    libraries: LIBRARIES,
  });

  // A posição inicial é importante, use a última localização selecionada ou um default
  const center = location || { lat: -23.5505, lng: -46.6333 };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setInternalLocation({ lat, lng });
          onLocationSelect(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative">
      {isLoaded ? (
        <div className="w-full h-[400px] relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onClick={(e) => {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              setInternalLocation({ lat: newLat, lng: newLng });
              onLocationSelect(newLat, newLng);
            }}
          >
            {location && <Marker position={location} />}
          </GoogleMap>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 pointer-events-auto z-10">
            <Button
              onClick={handleCurrentLocation}
              variant="secondary"
              size="sm"
              className="shadow-lg"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Usar minha localização
            </Button>
            {location && (
              <div className="flex-1 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-center shadow-lg">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">Carregando Mapa...</div>
      )}
    </Card>
  );
}
