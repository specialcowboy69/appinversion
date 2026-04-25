'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function CtaGeneratorPage() {
  return (
    <ToolView 
      title="CTA Generator"
      description="Llamadas a la acción persuasivas para convertir."
      toolSlug="cta-generator"
      initialValues={{
        goal: '',
        channel: 'website',
        urgencyLevel: 'medium',
      }}
      fields={[
        { name: 'goal', label: '¿Qué quieres que hagan?', type: 'textarea', placeholder: 'Ej: Registrarse a la newsletter' },
        { 
          name: 'channel', 
          label: 'Canal', 
          type: 'select',
          options: [
            { label: 'Sitio Web', value: 'website' },
            { label: 'Email', value: 'email' },
            { label: 'Anuncio', value: 'ad' },
            { label: 'Redes Sociales', value: 'social' },
          ]
        },
        { 
          name: 'urgencyLevel', 
          label: 'Nivel de Urgencia', 
          type: 'select',
          options: [
            { label: 'Bajo', value: 'low' },
            { label: 'Medio', value: 'medium' },
            { label: 'Alto', value: 'high' },
          ]
        },
      ]}
    />
  );
}
