{/* Legenda profundidade da neve */}
            <div className="mt-2 flex flex-col items-start">
              <span className="text-sm font-semibold text-blue-900 mb-1">Legenda de profundidade da neve:</span>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block"></span> Rasa (&lt; 5 cm)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span> Moderada (5-20 cm)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-700 inline-block"></span> Profunda (&gt; 20 cm)</span>
              </div>
            </div>
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CloudRain, Thermometer, Wind, Droplets, Sun, CloudDrizzle, Lightbulb } from "lucide-react";
import { Snowflake as SnowIcon } from "lucide-react";
import { toast } from "sonner";
import ChatBot from "@/components/ChatBot"; // Importando o componente ChatBot

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  condition: string;
  snowChance?: number;
}

export default function Results() {
  // Função para estimar profundidade da neve baseada na probabilidade
  function getSnowDepth(snowChance?: number) {
    if (!snowChance) return 0;
    if (snowChance > 70) return Math.floor(Math.random() * 30) + 20; // 20-50cm
    if (snowChance > 55) return Math.floor(Math.random() * 15) + 5; // 5-20cm
    if (snowChance > 40) return Math.floor(Math.random() * 5) + 1; // 1-5cm
    return 0;
  }
  // Função para determinar a cor da temperatura
  function getTemperatureColor(temp: number) {
    if (temp > 30) return 'text-red-600'; // muito quente
    if (temp >= 20 && temp <= 30) return 'text-yellow-500'; // quente
    if (temp >= 10 && temp < 20) return 'text-blue-300'; // frio
    if (temp < 10) return 'text-blue-600'; // muito frio
    return 'text-primary'; // normal
  }
  const location = useLocation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Função para determinar a cor da umidade
  function getHumidityColor(humidity: number) {
  if (humidity < 30) return 'text-red-600'; // baixa
  if ((humidity >= 30 && humidity < 40) || (humidity > 60 && humidity <= 70)) return 'text-yellow-500'; // média
  if (humidity >= 40 && humidity <= 60) return 'text-green-600'; // boa
  if (humidity > 70) return 'text-yellow-500'; // média/alta
  return 'text-primary'; // padrão
  }
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { date, locationData } = location.state || {};

  useEffect(() => {
    if (!date || !locationData) {
      toast.error("Dados incompletos. Por favor, selecione data e localização.");
      navigate("/");
      return;
    }

    // Simulação de dados meteorológicos
    const mockWeather: WeatherData = {
      temperature: Math.floor(Math.random() * 15) + 20,
      feelsLike: Math.floor(Math.random() * 15) + 18,
      humidity: Math.floor(Math.random() * 50) + 30,
      rainChance: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 20) + 5,
  condition: Math.random() > 0.5 ? "Ensolarado" : "Parcialmente nublado",
  snowChance: Math.floor(Math.random() * 30)
    };

    setWeather(mockWeather);

    // Gerar sugestões baseadas nos dados
    const newSuggestions: string[] = [];

    if (mockWeather.humidity < 40) {
      newSuggestions.push("💧 A umidade do ar está baixa. Lembre-se de levar uma garrafa d'água!");
    }

    if (mockWeather.rainChance > 60) {
      newSuggestions.push("☂️ Alta probabilidade de chuva. Não esqueça seu guarda-chuva!");
    }

    // Sugestões personalizadas para temperatura
    if (mockWeather.temperature > 30) {
      newSuggestions.push("🔥 Risco de exaustão por calor. Priorizar atividades internas e hidratação. Roupas levíssimas.");
    } else if (mockWeather.temperature >= 20 && mockWeather.temperature <= 30) {
      newSuggestions.push("🌤️ Clima agradável de verão ou primavera. Roupas leves, casaco leve à noite. Ideal para a maioria dos passeios ao ar livre.");
    } else if (mockWeather.temperature >= 10 && mockWeather.temperature < 20) {
      newSuggestions.push("🧥 Clima de outono ou inverno ameno. Necessidade de camadas (casacos, blusas). Confortável com a proteção certa.");
    } else if (mockWeather.temperature < 10) {
      newSuggestions.push("❄️ Exige roupas térmicas, casacos pesados e acessórios (luvas, gorros). Risco de geada ou neve (se abaixo de 0°C).");
    }

    // Sugestão personalizada de esqui baseada na probabilidade de neve
    if (mockWeather.snowChance && mockWeather.snowChance > 40) {
      // Simular profundidade da neve baseada na chance
      let profundidade = "rasa";
      if (mockWeather.snowChance > 70) profundidade = "profunda";
      else if (mockWeather.snowChance > 55) profundidade = "moderada";

      if (profundidade === "profunda") {
        newSuggestions.push("⛷️ Ótimas condições para esquiar! Alta probabilidade de neve e neve profunda esperada.");
      } else if (profundidade === "moderada") {
        newSuggestions.push("🎿 Boas chances para esquiar! Probabilidade de neve moderada, fique atento à previsão.");
      } else {
        newSuggestions.push("🚫 Pouca neve prevista para esquiar. Verifique as condições locais antes de planejar.");
      }
    }

    if (mockWeather.windSpeed > 15) {
      newSuggestions.push("💨 Ventos fortes previstos. Tenha cuidado com objetos soltos.");
    }

    if (newSuggestions.length === 0) {
      newSuggestions.push("✨ Condições climáticas favoráveis! Aproveite seu dia!");
    }

    setSuggestions(newSuggestions);
  }, [date, locationData, navigate]);

  if (!weather) return null;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('https://www.rodamundo.tur.br/blog/wp-content/uploads/2019/03/Ba%C3%ADa-dos-Porcos-em-Fernando-de-Noronha-rodamundo-1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <Card className="p-6 border-2">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Previsão do Tempo
            </h1>
            <p className="text-muted-foreground">
              Data: {new Date(date).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              Localização: {locationData.lat.toFixed(4)}, {locationData.lng.toFixed(4)}
            </p>
          </Card>

          {/* Suggestions - agora acima das funções, com destaque */}
          <Card className="p-6 border-4 border-yellow-400 shadow-lg bg-yellow-50">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-yellow-700">Sugestões Personalizadas</h2>
            </div>
            {/* Condição climática */}
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 font-semibold text-base">
                Condição climática: {weather?.condition}
              </span>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-400"
                >
                  <p className="text-sm text-yellow-900">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Weather Data Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Temperatura */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <Thermometer className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold">Temperatura</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Atual</span>
                  <span className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}>{weather.temperature}°C</span>
                </div>
                {/* Legenda de cores para temperatura */}
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span> Muito Quente</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Quente</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-300 inline-block"></span> Frio</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span> Muito Frio</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sensação térmica</span>
                  <span className="text-xl font-semibold">{weather.feelsLike}°C</span>
                </div>
              </div>
            </Card>

            {/* Precipitação */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <CloudRain className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold">Precipitação</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Chance de chuva</span>
                  <span className="text-3xl font-bold text-primary">{weather.rainChance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all"
                    style={{ width: `${weather.rainChance}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Umidade */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <Droplets className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold">Umidade</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Umidade relativa</span>
                  <span className={`text-3xl font-bold ${getHumidityColor(weather.humidity)}`}>{weather.humidity}%</span>
                </div>
                {/* Legenda de cores para umidade */}
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span> Baixa</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Média</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span> Boa</span>
                </div>
                <p className="mt-3 text-base font-medium text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-400">
                  Para o conforto e bem-estar humano, recomenda-se que a umidade relativa do ar permaneça <span className="font-bold text-green-600">boa (40% a 60%)</span>. Valores <span className="font-bold text-yellow-500">médios</span> (30-40% ou 60-70%) e <span className="font-bold text-red-600">baixos</span> (&lt;30%) podem causar desconforto.
                </p>
              </div>
            </Card>


            {/* Vento */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <Wind className="w-8 h-8 text-primary" />
                <h2 className="text-lg font-semibold">Vento</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Velocidade</span>
                  <span className="text-2xl font-bold text-primary">{weather.windSpeed} km/h</span>
                </div>
                {/* Explicação leiga sobre velocidade do vento */}
                <div className="mt-2 text-xs text-blue-900 bg-blue-50 rounded px-3 py-2 border-l-4 border-blue-300">
                  <span className="font-semibold">O que significa a velocidade do vento?</span><br />
                  Até 10 km/h: vento fraco, quase não sentimos.<br />
                  11-20 km/h: vento leve, balança folhas e cabelos.<br />
                  21-40 km/h: vento moderado, pode incomodar e levantar poeira.<br />
                  Acima de 40 km/h: vento forte, difícil caminhar e pode causar transtornos.
                </div>
              </div>
            </Card>
            {/* Neve */}
            <Card className="p-6 border-2">
              <div className="flex items-center gap-3 mb-4">
                <SnowIcon className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold">Neve</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Probabilidade</span>
                  <span className="text-3xl font-bold text-primary">{weather.snowChance ?? 0}%</span>
                </div>
                {/* Profundidade estimada da neve */}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">Profundidade estimada</span>
                  <span className="text-2xl font-bold text-blue-700">{getSnowDepth(weather.snowChance)} cm</span>
                </div>
                {/* Legenda profundidade da neve */}
                <div className="mt-4 flex flex-col items-start">
                  <span className="text-sm font-semibold text-blue-900 mb-1">Profundidade da neve</span>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block"></span> Rasa (&lt; 5 cm)</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span> Moderada (5-20 cm)</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-700 inline-block"></span> Profunda (&gt; 20 cm)</span>
                  </div>
                </div>
                {/* Aviso sobre quantidade ideal para esquiar */}
                <div className="mt-2 text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 border-l-4 border-blue-400">
                  Para esquiar com segurança e diversão, recomenda-se pelo menos <span className="font-bold">20 cm</span> de neve.
                </div>
              </div>
            </Card>
          </div>


        </div>
      </div>
      </div>
      {/* ChatBot Assistente */}
      <ChatBot />
    </div>
  );
}
