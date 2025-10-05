import { Bot } from "lucide-react";
import SearchSection from "@/components/SearchSection";
import ChatBot from "@/components/ChatBot";
// import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700">
      <div className="relative z-10">
      {/* Header */}
      <header className="w-full bg-card shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  TemporALL
                </h1>
                <p className="text-sm text-muted-foreground">Encontre seu local ideal</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Assistente IA disponível</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}

      <section className="w-full max-w-7xl mx-auto px-4 py-16 text-center flex flex-col items-center">
        <div className="inline-block rounded-3xl px-12 py-16 bg-white shadow-2xl max-w-5xl w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-blue-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Planeje sua próxima aventura
          </h2>
          <p className="text-xl text-blue-800 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Selecione a data e o local perfeito para sua experiência inesquecível
          </p>
        </div>
      </section>

      {/* Search Section com layout horizontal */}
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 items-start justify-center min-h-[500px]">
        <SearchSection />
      </div>


      {/* Footer */}
      <footer className="w-full mt-16 py-8 border-t bg-card bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 TemporALL. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  </div>
  );
};

export default Index;
