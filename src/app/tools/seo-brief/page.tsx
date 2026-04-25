'use client';

import { ToolView } from '@/components/tools/ToolView';

export default function SeoBriefPage() {
  return (
    <ToolView 
      title="SEO Brief"
      description="Estructura tus artículos para posicionar en buscadores."
      toolSlug="seo-brief"
      initialValues={{
        primaryKeyword: '',
        secondaryKeywords: '',
        searchIntent: 'informational',
        pageType: 'blog_post',
      }}
      fields={[
        { name: 'primaryKeyword', label: 'Palabra Clave Principal', type: 'text' },
        { name: 'secondaryKeywords', label: 'Keywords Secundarias', type: 'text' },
        { 
          name: 'searchIntent', 
          label: 'Intención de Búsqueda', 
          type: 'select',
          options: [
            { label: 'Informativa', value: 'informational' },
            { label: 'Transaccional', value: 'transactional' },
            { label: 'Navegacional', value: 'navigational' },
            { label: 'Comercial', value: 'commercial' },
          ]
        },
        { name: 'pageType', label: 'Tipo de Página', type: 'text' },
      ]}
    />
  );
}
