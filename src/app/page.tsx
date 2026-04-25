'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [demoInput, setDemoInput] = useState('');

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-primary/30 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Nav */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span>Inversión<span className="text-primary">IA</span></span>
        </div>
        <div>
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" className="hover:bg-slate-800">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-slate-800">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content: The Dialogue Box */}
      <main className="w-full max-w-3xl z-10 space-y-12 text-center mt-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Tu Analista de Inversiones <br /> con Inteligencia Artificial
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Análisis de acciones en tiempo real, noticias del mercado y sabiduría financiera en un solo lugar.
          </p>
        </div>

        {/* The Dialogue Box UI */}
        <div className="relative group animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-slate-900/80 border border-slate-800 p-2 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center gap-2">
            <div className="pl-4 text-slate-500">
              <Sparkles size={20} />
            </div>
            <Input 
              className="bg-transparent border-none text-lg h-14 focus-visible:ring-0 placeholder:text-slate-600"
              placeholder="¿Qué opinas de invertir en NVIDIA hoy?"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
            />
            <Link href={user ? "/chat" : "/login"}>
              <Button size="lg" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20 group">
                Empezar
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimal Badges */}
        <div className="flex flex-wrap justify-center gap-6 pt-8 text-slate-500 text-sm font-medium animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span>Datos en Tiempo Real</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500" />
            <span>Basado en Estrategias Probadas</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <span>Análisis de Sentimiento</span>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 text-slate-600 text-xs tracking-widest uppercase">
        Powered by Google Gemini 1.5 & RAG Technology
      </footer>
    </div>
  );
}
