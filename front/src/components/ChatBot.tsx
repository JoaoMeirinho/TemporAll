import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import cloudBot from "@/assets/cloud-bot.png";

type Message = { role: "user" | "assistant"; content: string };

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Mensagem inicial personalizada
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Olá! Sou seu assistente meteorológico. Posso te ajudar a interpretar os dados, sugerir roupas, atividades e cuidados para o clima de hoje. Pergunte sobre qualquer funcionalidade ou peça dicas!"
        }
      ]);
    }
  }, [messages]);

  // Sugestões personalizadas e respostas guiadas
  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Respostas simuladas e guiadas
    let assistantContent = "";
    if (userMessage.toLowerCase().includes("roupa")) {
      assistantContent = "Para o clima de hoje, recomendo roupas leves se estiver calor, ou casacos e acessórios térmicos se estiver frio. Confira as sugestões acima!";
    } else if (userMessage.toLowerCase().includes("atividade")) {
      assistantContent = "Atividades ao ar livre são ideais em clima seco e ensolarado. Se houver previsão de chuva ou vento forte, prefira locais cobertos.";
    } else if (userMessage.toLowerCase().includes("neve")) {
      assistantContent = "A profundidade da neve está indicada acima. Para esquiar, o ideal é pelo menos 20cm de neve. Verifique as condições antes de planejar.";
    } else if (userMessage.toLowerCase().includes("chuva")) {
      assistantContent = "A chance de chuva está destacada nos dados. Leve guarda-chuva e proteja eletrônicos se a probabilidade for alta.";
    } else {
      assistantContent = "Posso te ajudar a interpretar os dados, sugerir roupas, atividades e cuidados para o clima de hoje. Pergunte sobre qualquer funcionalidade ou peça dicas!";
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: assistantContent }]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    
    streamChat(input);
    setInput("");
  };

  return (
    <>
      {/* Botão flutuante para abrir o chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg p-4 flex items-center gap-2 hover:scale-105 transition-transform"
          title="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden md:inline font-semibold">Chat</span>
        </button>
      )}
      {/* Chatbox */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col border-2">
      {/* Header */}
  <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-t-xl relative">
        <img src={cloudBot} alt="Bot" className="w-10 h-10" />
        <div>
          <h3 className="font-semibold">Assistente Meteorológico</h3>
          <p className="text-xs opacity-90">Online agora</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-2 p-1 rounded hover:bg-white/20 transition-colors"
          title="Fechar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mensagens */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua dúvida ou peça uma sugestão..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
