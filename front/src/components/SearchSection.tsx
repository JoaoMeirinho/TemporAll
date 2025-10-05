import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DateSelector from "./DateSelector";
import LocationMap from "./LocationMap";
import { toast } from "sonner";

export default function SearchSection() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  // Busca coordenadas pelo endereço usando Nominatim
  async function handleAddressSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsSearchingAddress(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setSelectedLocation({ lat, lng });
      } else {
        toast.error("Endereço não encontrado. Tente ser mais específico.");
      }
    } catch (err) {
      toast.error("Erro ao buscar endereço.");
    } finally {
      setIsSearchingAddress(false);
    }
  }

  const handleSearch = () => {
    if (!selectedDate || !selectedLocation) {
      toast.error("Por favor, selecione uma data e localização");
      return;
    }
    
    navigate("/results", { 
      state: { 
        date: selectedDate, 
        locationData: selectedLocation 
      } 
    });
  };

return (
  <div className="w-full max-w-2xl mx-auto px-4 py-8">
    <Card className="p-6 shadow-lg border-2 flex flex-col items-center gap-8">
      <div className="w-full flex flex-col items-center gap-4">
        <label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Selecione a Data
        </label>
        <DateSelector onDateSelect={setSelectedDate} />
        <label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          {selectedLocation 
            ? `Localização: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
            : "Clique no mapa para selecionar"}
        </label>
      </div>
      {/* Input de endereço acima do mapa */}
      <form onSubmit={handleAddressSearch} className="flex gap-2 w-full max-w-xl mx-auto">
        <Input 
          type="text"
          placeholder="Digite seu endereço (ex: Av. Paulista, 1000)"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          disabled={isSearchingAddress}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isSearchingAddress || !addressInput.trim()}
          className="bg-gradient-to-r from-blue-500 to-purple-600"
        >
          {isSearchingAddress ? 'Buscando...' : <Search className="w-4 h-4" />}
        </Button>
      </form>
      <div className="w-full h-[400px] rounded-xl overflow-hidden flex justify-center mt-2">
        <LocationMap 
          onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })}
          selectedLocation={selectedLocation}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-md hover:shadow-lg mt-4"
      >
        <Search className="mr-2 h-5 w-5" />
        Pesquisar
      </Button>
    </Card>
  </div>
);
}
