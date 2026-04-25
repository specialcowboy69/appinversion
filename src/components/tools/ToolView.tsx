'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';
import { getUserProjects, getProject } from '@/lib/firebase/firestore';
import { Project } from '@/lib/types';
import { Shell } from '@/components/layout/Shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase/client';
import { Loader2, Sparkles, Copy, Star, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolViewProps {
  title: string;
  description: string;
  toolSlug: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder?: string;
    options?: { label: string; value: string }[];
  }[];
  initialValues: Record<string, string>;
}

export function ToolView({ title, description, toolSlug, fields, initialValues }: ToolViewProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(searchParams.get('projectId') || '');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [result, setResult] = useState<any>(null);
  const [lastGenerationId, setLastGenerationId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserProjects(user.uid).then((data) => {
        setProjects(data);
        if (!selectedProjectId && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
        setLoading(false);
      });
    }
  }, [user]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error('Por favor selecciona un proyecto');
      return;
    }

    setGenerating(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/tools/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
          toolSlug,
          input: formData,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data.output);
      setLastGenerationId(data.id);
      setIsFavorited(false);
      toast.success('Contenido generado con éxito');
    } catch (error: any) {
      toast.error('Error al generar: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const toggleFavorite = async () => {
    if (!lastGenerationId) return;
    try {
      const response = await fetch(`/api/generations/${lastGenerationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ isFavorite: !isFavorited }),
      });
      if (response.ok) {
        setIsFavorited(!isFavorited);
        toast.success(!isFavorited ? 'Añadido a favoritos' : 'Quitado de favoritos');
      }
    } catch (error) {
      toast.error('Error al actualizar favorito');
    }
  };

  const saveAsDocument = async (title: string, content: string) => {
    if (!selectedProjectId) return;
    try {
      const response = await fetch(`/api/projects/${selectedProjectId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        toast.success('Guardado en el proyecto');
      }
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  return (
    <Shell>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Selecciona un proyecto y completa los campos.</CardDescription>
            </CardHeader>
            <form onSubmit={handleGenerate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Proyecto</label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required
                      />
                    ) : field.type === 'select' ? (
                      <Select 
                        value={formData[field.name]} 
                        onValueChange={(val) => setFormData({ ...formData, [field.name]: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        required
                      />
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={generating || !selectedProjectId}>
                  {generating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generar con IA</>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Resultados</h3>
          {!result && !generating ? (
            <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-xl bg-muted/20 text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <p>Completa el formulario para generar contenido.</p>
            </div>
          ) : generating ? (
            <div className="space-y-4">
              <Card>
                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display Result Logic based on toolSlug */}
              {toolSlug === 'business-idea' && result.ideas?.map((idea: any, i: number) => (
                <ResultCard 
                  key={i} 
                  title={idea.title} 
                  content={idea.summary} 
                  metadata={[
                    { label: 'Monetización', value: idea.monetizationModel },
                    { label: 'Primer Paso', value: idea.firstStep }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(idea, null, 2))}
                  onFavorite={toggleFavorite}
                  onSave={() => saveAsDocument(idea.title, idea.summary)}
                />
              ))}
              
              {toolSlug === 'customer-avatar' && result && (
                <ResultCard 
                  title={result.avatarName} 
                  content={result.goals} 
                  metadata={[
                    { label: 'Demografía', value: result.demographics },
                    { label: 'Frustraciones', value: result.frustrations },
                    { label: 'Deseos', value: result.desires }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(result, null, 2))}
                  onFavorite={toggleFavorite}
                  onSave={() => saveAsDocument(result.avatarName, result.goals)}
                />
              )}

              {toolSlug === 'product-description' && result && (
                <div className="space-y-4">
                  <ResultCard 
                    title="Descripción Corta" 
                    content={result.shortDescription} 
                    onCopy={() => copyToClipboard(result.shortDescription)} 
                    onFavorite={toggleFavorite}
                    onSave={() => saveAsDocument(`${result.productName} - Short`, result.shortDescription)}
                  />
                  <ResultCard 
                    title="Descripción Larga" 
                    content={result.longDescription} 
                    onCopy={() => copyToClipboard(result.longDescription)} 
                    onFavorite={toggleFavorite}
                    onSave={() => saveAsDocument(`${result.productName} - Long`, result.longDescription)}
                  />
                  <ResultCard 
                    title="Beneficios" 
                    content={result.primaryBenefits?.join(', ')} 
                    onCopy={() => copyToClipboard(result.primaryBenefits?.join('\n'))} 
                    onFavorite={toggleFavorite}
                    onSave={() => saveAsDocument(`${result.productName} - Benefits`, result.primaryBenefits?.join('\n'))}
                  />
                </div>
              )}

              {toolSlug === 'pain-points' && result.painPoints?.map((pp: any, i: number) => (
                <ResultCard 
                  key={i} 
                  title={pp.painPoint} 
                  content={pp.emotionalImpact} 
                  metadata={[
                    { label: 'Impacto Práctico', value: pp.practicalImpact },
                    { label: 'Ángulo de Venta', value: pp.messagingAngle }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(pp, null, 2))}
                  onFavorite={toggleFavorite}
                  onSave={() => saveAsDocument(pp.painPoint, pp.emotionalImpact)}
                />
              ))}

              {toolSlug === 'naming-slogan' && result.options?.map((opt: any, i: number) => (
                <ResultCard 
                  key={i} 
                  title={opt.brandName} 
                  content={opt.slogan} 
                  metadata={[
                    { label: 'Razón', value: opt.rationale }
                  ]} 
                  onCopy={() => copyToClipboard(`${opt.brandName}: ${opt.slogan}`)}
                  onFavorite={toggleFavorite}
                  onSave={() => saveAsDocument(opt.brandName, opt.slogan)}
                />
              ))}

              {toolSlug === 'ads-generator' && (
                <div className="space-y-4">
                  {result.headlines?.map((h: string, i: number) => (
                    <ResultCard 
                      key={i} 
                      title={`Titular ${i+1}`} 
                      content={h} 
                      onCopy={() => copyToClipboard(h)} 
                      onFavorite={toggleFavorite}
                      onSave={() => saveAsDocument(`Ad Headline ${i+1}`, h)}
                    />
                  ))}
                  {result.bodyVariants?.map((b: string, i: number) => (
                    <ResultCard 
                      key={i} 
                      title={`Cuerpo ${i+1}`} 
                      content={b} 
                      onCopy={() => copyToClipboard(b)} 
                      onFavorite={toggleFavorite}
                      onSave={() => saveAsDocument(`Ad Body ${i+1}`, b)}
                    />
                  ))}
                </div>
              )}

              {toolSlug === 'seo-brief' && (
                <ResultCard 
                  title="SEO Brief" 
                  content={result.intentSummary} 
                  metadata={[
                    { label: 'Títulos sugeridos', value: result.seoTitles?.join(' | ') },
                    { label: 'Keywords Secundarias', value: result.secondaryKeywords || 'N/A' }
                  ]} 
                  onCopy={() => copyToClipboard(JSON.stringify(result, null, 2))}
                  onFavorite={toggleFavorite}
                  onSave={() => saveAsDocument('SEO Brief', result.intentSummary)}
                />
              )}

              {toolSlug === 'blog-toolkit' && (
                <div className="space-y-4">
                  <ResultCard 
                    title={result.titles?.[0]} 
                    content={result.intro} 
                    onCopy={() => copyToClipboard(result.intro)} 
                    onFavorite={toggleFavorite}
                    onSave={() => saveAsDocument(result.titles?.[0], result.intro)}
                  />
                  <ResultCard 
                    title="Borrador Completo" 
                    content={result.fullDraft} 
                    onCopy={() => copyToClipboard(result.fullDraft)} 
                    onFavorite={toggleFavorite}
                    onSave={() => saveAsDocument(`${result.titles?.[0]} (Draft)`, result.fullDraft)}
                  />
                </div>
              )}

              {toolSlug === 'cta-generator' && (
                <div className="space-y-4">
                  {result.directCtas?.map((c: string, i: number) => (
                    <ResultCard 
                      key={i} 
                      title="CTA Directo" 
                      content={c} 
                      onCopy={() => copyToClipboard(c)} 
                      onFavorite={toggleFavorite}
                      onSave={() => saveAsDocument('CTA', c)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

function ResultCard({ 
  title, 
  content, 
  metadata, 
  onCopy, 
  onFavorite, 
  onSave 
}: { 
  title: string, 
  content: string, 
  metadata?: any[], 
  onCopy: () => void,
  onFavorite?: () => void,
  onSave?: () => void
}) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onCopy} title="Copiar"><Copy className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onFavorite} title="Favorito"><Star className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onSave} title="Guardar en proyecto"><Plus className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">{content}</p>
        {metadata && (
          <div className="grid gap-2 border-t pt-4">
            {metadata.map((m, j) => (
              <div key={j} className="text-xs">
                <span className="font-bold text-muted-foreground uppercase mr-2">{m.label}:</span>
                <span className="text-foreground">{m.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
