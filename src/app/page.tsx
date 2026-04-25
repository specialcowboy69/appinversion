'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  Loader2
} from 'lucide-react';

export default function LandingPage() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Redirigimos al chat pasando la pregunta inicial por la URL o simplemente abriendo el chat
    router.push(`/chat?q=${encodeURIComponent(input)}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      
      <div className="w-full max-w-2xl z-10 animate-in fade-in zoom-in duration-1000">
        <form onSubmit={handleStart} className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
          
          <div className="relative bg-slate-900/40 border border-white/10 p-2 rounded-2xl backdrop-blur-2xl shadow-2xl flex items-center gap-2">
            <div className="pl-4 text-primary">
              <TrendingUp size={24} />
            </div>
            <Input 
              className="bg-transparent border-none text-xl h-16 focus-visible:ring-0 placeholder:text-slate-600 font-light"
              placeholder="¿En qué acción quieres invertir hoy?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <Button type="submit" size="lg" className="h-12 px-6 rounded-xl group bg-primary hover:bg-primary/90 transition-all">
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </form>
        
        <p className="text-center mt-6 text-slate-500 text-xs tracking-[0.2em] uppercase font-medium">
          Powered by Gemini 1.5 Analyst
        </p>
      </div>
    </div>
  );
}
