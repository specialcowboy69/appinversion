'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function NamingSloganPage() {
  return (
    <ToolView 
      title="Naming + Slogan"
      description="Encuentra el nombre y eslogan perfectos para tu marca."
      toolSlug="naming-slogan"
      initialValues={{
        businessType: '',
        brandTone: 'modern',
        keywords: '',
        style: 'descriptive',
      }}
      fields={[
        { name: 'businessType', label: 'Tipo de Negocio', type: 'text' },
        { 
          name: 'brandTone', 
          label: 'Tono', 
          type: 'select',
          options: [
            { label: 'Moderno', value: 'modern' },
            { label: 'Clásico', value: 'classic' },
            { label: 'Divertido', value: 'playful' },
            { label: 'Elegante', value: 'elegant' },
          ]
        },
        { name: 'keywords', label: 'Palabras Clave', type: 'text' },
        { 
          name: 'style', 
          label: 'Estilo de Nombre', 
          type: 'select',
          options: [
            { label: 'Descriptivo', value: 'descriptive' },
            { label: 'Abstracto', value: 'abstract' },
            { label: 'Evocativo', value: 'evocative' },
            { label: 'Compuesto', value: 'compound' },
          ]
        },
      ]}
    />
  );
}
