'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function PainPointsPage() {
  return (
    <ToolView 
      title="Pain Points"
      description="Identifica los problemas y frustraciones de tu audiencia."
      toolSlug="pain-points"
      initialValues={{
        niche: '',
        productOrService: '',
        targetCustomer: '',
      }}
      fields={[
        { name: 'niche', label: 'Nicho', type: 'text', placeholder: 'Ej: Marketing Digital' },
        { name: 'productOrService', label: 'Producto/Servicio', type: 'text', placeholder: '¿Qué ofreces?' },
        { name: 'targetCustomer', label: 'Cliente Objetivo', type: 'text', placeholder: '¿A quién investigamos?' },
      ]}
    />
  );
}
