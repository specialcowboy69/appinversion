'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function AdsGeneratorPage() {
  return (
    <ToolView 
      title="Ads Generator"
      description="Genera copys de anuncios efectivos para Facebook y Google."
      toolSlug="ads-generator"
      initialValues={{
        platform: 'facebook',
        productOrService: '',
        targetAudience: '',
        offer: '',
        mainProblem: '',
        cta: '',
      }}
      fields={[
        { 
          name: 'platform', 
          label: 'Plataforma', 
          type: 'select',
          options: [
            { label: 'Facebook/Instagram', value: 'facebook' },
            { label: 'Google Ads', value: 'google' },
            { label: 'LinkedIn Ads', value: 'linkedin' },
          ]
        },
        { name: 'productOrService', label: 'Producto/Servicio', type: 'text' },
        { name: 'targetAudience', label: 'Audiencia', type: 'text' },
        { name: 'offer', label: 'Oferta Especial', type: 'text' },
        { name: 'mainProblem', label: 'Problema a atacar', type: 'textarea' },
        { name: 'cta', label: 'Llamada a la acción', type: 'text' },
      ]}
    />
  );
}
