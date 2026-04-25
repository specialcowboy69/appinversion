'use client';

import { useState, useRef, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  Loader2,
  Sparkles,
  RefreshCcw
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola. Soy tu Analista de Inversiones Senior. Puedo analizar acciones en tiempo real, buscar noticias del mercado y aplicar estrategias de inversión basadas en tus documentos. ¿En qué empresa estás interesado hoy?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Lo siento, ha ocurrido un error al conectar con el analista: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto w-full gap-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary h-6 w-6" />
              Analista de Inversiones IA
            </h1>
            <p className="text-sm text-muted-foreground">Datos en tiempo real + Sabiduría financiera</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setMessages([messages[0]])}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        <Card className="flex-1 overflow-hidden border-none shadow-xl bg-card/50 backdrop-blur-sm flex flex-col">
          {/* Area de Mensajes */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted/50 border border-border/50 rounded-tl-none text-card-foreground'
                  }`}>
                    {msg.content.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center text-muted-foreground text-sm animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>El analista está analizando el mercado...</span>
                    <Sparkles className="h-3 w-3" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-muted/20 border-t border-border/50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: ¿Qué opinas de invertir en NVIDIA hoy?"
                className="bg-background/50 border-border/50 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
