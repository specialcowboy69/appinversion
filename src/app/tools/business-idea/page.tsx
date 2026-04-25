'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function BusinessIdeaPage() {
  return (
    <ToolView 
      title="Business Idea Generator"
      description="Genera ideas de negocio innovadoras basadas en tus habilidades e intereses."
      toolSlug="business-idea"
      initialValues={{
        interests: '',
        skills: '',
        experience: '',
        targetAudience: '',
        problemsToSolve: '',
        businessType: 'digital_product',
      }}
      fields={[
        { name: 'interests', label: 'Intereses', type: 'text', placeholder: 'Ej: Tecnología, Cocina, Viajes' },
        { name: 'skills', label: 'Habilidades', type: 'text', placeholder: 'Ej: Programación, Diseño, Ventas' },
        { name: 'experience', label: 'Experiencia', type: 'textarea', placeholder: 'Cuéntanos un poco sobre tu trayectoria' },
        { name: 'targetAudience', label: 'Audiencia Objetivo', type: 'text', placeholder: '¿A quién quieres ayudar?' },
        { name: 'problemsToSolve', label: 'Problemas a resolver', type: 'textarea', placeholder: '¿Qué necesidades has detectado?' },
        { 
          name: 'businessType', 
          label: 'Tipo de Negocio', 
          type: 'select', 
          options: [
            { label: 'Producto Digital', value: 'digital_product' },
            { label: 'Servicio', value: 'service' },
            { label: 'SaaS', value: 'saas' },
            { label: 'E-commerce', value: 'ecommerce' },
            { label: 'Negocio de Contenido', value: 'content_business' },
          ]
        },
      ]}
    />
  );
}
