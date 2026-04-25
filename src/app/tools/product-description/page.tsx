'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function ProductDescriptionPage() {
  return (
    <ToolView 
      title="Product Description"
      description="Crea copys persuasivos y listados de beneficios para tus productos."
      toolSlug="product-description"
      initialValues={{
        productName: '',
        category: '',
        features: '',
        benefits: '',
        targetAudience: '',
        tone: 'professional',
      }}
      fields={[
        { name: 'productName', label: 'Nombre del Producto', type: 'text' },
        { name: 'category', label: 'Categoría', type: 'text' },
        { name: 'features', label: 'Características (una por línea)', type: 'textarea' },
        { name: 'benefits', label: 'Beneficios clave', type: 'textarea' },
        { name: 'targetAudience', label: 'Audiencia', type: 'text' },
        { 
          name: 'tone', 
          label: 'Tono', 
          type: 'select', 
          options: [
            { label: 'Profesional', value: 'professional' },
            { label: 'Persuasivo', value: 'persuasive' },
            { label: 'Cercano/Amistoso', value: 'friendly' },
            { label: 'Exclusivo/Premium', value: 'premium' },
          ]
        },
      ]}
    />
  );
}
