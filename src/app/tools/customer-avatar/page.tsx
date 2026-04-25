'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function CustomerAvatarPage() {
  return (
    <ToolView 
      title="Customer Avatar"
      description="Define a tu cliente ideal con detalle psicológico y demográfico."
      toolSlug="customer-avatar"
      initialValues={{
        productOrService: '',
        niche: '',
        customerType: '',
        mainProblem: '',
        awarenessLevel: 'unaware',
      }}
      fields={[
        { name: 'productOrService', label: 'Producto o Servicio', type: 'text', placeholder: '¿Qué vendes?' },
        { name: 'niche', label: 'Nicho', type: 'text', placeholder: 'Ej: Fitness para madres' },
        { name: 'customerType', label: 'Tipo de Cliente', type: 'text', placeholder: 'Ej: Profesionales ocupados' },
        { name: 'mainProblem', label: 'Problema Principal', type: 'textarea', placeholder: '¿Cuál es su mayor frustración?' },
        { 
          name: 'awarenessLevel', 
          label: 'Nivel de Consciencia', 
          type: 'select', 
          options: [
            { label: 'Inconsciente (Unaware)', value: 'unaware' },
            { label: 'Consciente del problema', value: 'problem_aware' },
            { label: 'Consciente de la solución', value: 'solution_aware' },
            { label: 'Consciente del producto', value: 'product_aware' },
            { label: 'Muy consciente', value: 'most_aware' },
          ]
        },
      ]}
    />
  );
}
