'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function BlogToolkitPage() {
  return (
    <ToolView 
      title="Blog Toolkit"
      description="Genera borradores completos y títulos para tu blog."
      toolSlug="blog-toolkit"
      initialValues={{
        topic: '',
        primaryKeyword: '',
        audience: '',
        articleGoal: '',
        desiredLength: 'medium',
      }}
      fields={[
        { name: 'topic', label: 'Tema del artículo', type: 'text' },
        { name: 'primaryKeyword', label: 'Palabra Clave', type: 'text' },
        { name: 'audience', label: 'Audiencia', type: 'text' },
        { name: 'articleGoal', label: 'Objetivo del artículo', type: 'textarea' },
        { 
          name: 'desiredLength', 
          label: 'Longitud', 
          type: 'select',
          options: [
            { label: 'Corto (500 palabras)', value: 'short' },
            { label: 'Medio (1000 palabras)', value: 'medium' },
            { label: 'Largo (+1500 palabras)', value: 'long' },
          ]
        },
      ]}
    />
  );
}
