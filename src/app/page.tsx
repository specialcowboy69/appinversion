import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wand2, Zap, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Wand2 size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">AI SaaS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/signup">
            Sign up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Potencia tu negocio con IA Generativa
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Crea ideas de negocio, avatares de clientes, descripciones de productos y contenido SEO en segundos.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="px-8">
                  <Link href="/signup">Empezar ahora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link href="/login">Saber más</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-background shadow-sm">
                <Zap className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Generación Rápida</h3>
                <p className="text-muted-foreground text-center">
                  Resultados profesionales en menos de 10 segundos para cualquier herramienta.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-background shadow-sm">
                <Shield className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Proyectos Organizados</h3>
                <p className="text-muted-foreground text-center">
                  Mantén todo el contexto de tu negocio en proyectos separados y seguros.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-xl bg-background shadow-sm">
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">Editor Inteligente</h3>
                <p className="text-muted-foreground text-center">
                  Refina tus textos directamente con acciones IA integradas en el editor.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 AI SaaS MVP. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
