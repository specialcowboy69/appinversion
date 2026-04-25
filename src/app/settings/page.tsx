'use client';

import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/firebase/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <Shell>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">Gestiona tu perfil y preferencias.</p>
        </div>

        <Card className="max-w-xl border-none shadow-sm bg-card/50">
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nombre</p>
              <p className="text-sm">{user?.displayName || 'No configurado'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</p>
              <p className="text-sm">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Plan</p>
              <div className="inline-flex items-center px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold">MVP FREE</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
