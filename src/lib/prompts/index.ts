export const TOOL_PROMPTS = {
  'business-idea': (input: any, context: any) => `
    Eres un experto en emprendimiento y estrategia de negocios.
    Basándote en el siguiente contexto de usuario:
    - Intereses: ${input.interests}
    - Habilidades: ${input.skills}
    - Experiencia: ${input.experience}
    - Audiencia objetivo: ${input.targetAudience}
    - Problemas a resolver: ${input.problemsToSolve}
    - Tipo de negocio preferido: ${input.businessType}
    
    Contexto general del proyecto: ${context.description || 'N/A'}
    Idioma: ${context.language || 'es'}

    Genera 5 ideas de negocio innovadoras y viables.
    Responde estrictamente en formato JSON con la siguiente estructura:
    {
      "ideas": [
        {
          "title": "string",
          "summary": "string",
          "targetAudience": "string",
          "monetizationModel": "string",
          "firstStep": "string"
        }
      ]
    }
  `,

  'customer-avatar': (input: any, context: any) => `
    Eres un experto en marketing y psicología del consumidor.
    Crea un avatar de cliente ideal para:
    - Producto/Servicio: ${input.productOrService}
    - Nicho: ${input.niche}
    - Tipo de cliente: ${input.customerType}
    - Problema principal: ${input.mainProblem}
    - Nivel de consciencia: ${input.awarenessLevel}

    Contexto general del proyecto: ${context.description || 'N/A'}
    Idioma: ${context.language || 'es'}

    Responde estrictamente en formato JSON con la siguiente estructura:
    {
      "avatarName": "string",
      "demographics": "string",
      "goals": "string",
      "frustrations": "string",
      "objections": "string",
      "desires": "string",
      "likelyLanguage": "string"
    }
  `,

  'product-description': (input: any, context: any) => `
    Eres un experto copywriter orientado a la conversión.
    Escribe descripciones persuasivas para:
    - Producto: ${input.productName}
    - Categoría: ${input.category}
    - Características: ${input.features}
    - Beneficios: ${input.benefits}
    - Audiencia: ${input.targetAudience}
    - Tono: ${input.tone || context.brandTone}

    Idioma: ${context.language || 'es'}

    Responde estrictamente en formato JSON con la siguiente estructura:
    {
      "shortDescription": "string",
      "longDescription": "string",
      "bulletPoints": ["string"],
      "primaryBenefits": ["string"],
      "salesVersion": "string"
    }
  `,

  'pain-points': (input: any, context: any) => `
    Eres un experto en investigación de mercado. Identifica los 8 puntos de dolor (pain points) más críticos para:
    - Nicho: ${input.niche}
    - Producto/Servicio: ${input.productOrService}
    - Cliente Objetivo: ${input.targetCustomer}

    Idioma: ${context.language || 'es'}

    Responde estrictamente en formato JSON:
    {
      "painPoints": [
        {
          "painPoint": "string",
          "emotionalImpact": "string",
          "practicalImpact": "string",
          "failedAttempts": "string",
          "messagingAngle": "string"
        }
      ]
    }
  `,

  'naming-slogan': (input: any, context: any) => `
    Eres un experto en branding y naming. Genera 10 opciones de nombre de marca y eslogan para:
    - Tipo de negocio: ${input.businessType}
    - Tono de marca: ${input.brandTone}
    - Palabras clave: ${input.keywords}
    - Estilo: ${input.style}

    Idioma: ${input.language || context.language || 'es'}

    Responde estrictamente en formato JSON:
    {
      "options": [
        {
          "brandName": "string",
          "slogan": "string",
          "rationale": "string"
        }
      ]
    }
  `,

  'ads-generator': (input: any, context: any) => `
    Eres un experto en Paid Media (Facebook Ads y Google Ads). Crea variantes de anuncios para:
    - Plataforma: ${input.platform}
    - Producto: ${input.productOrService}
    - Audiencia: ${input.targetAudience}
    - Oferta: ${input.offer}
    - Problema Principal: ${input.mainProblem}
    - CTA deseado: ${input.cta}
    - Tono: ${input.tone || context.brandTone}

    Idioma: ${context.language || 'es'}

    Responde estrictamente en formato JSON:
    {
      "headlines": ["string"],
      "bodyVariants": ["string"],
      "ctas": ["string"],
      "hooksByAngle": {
        "pain": ["string"],
        "desire": ["string"],
        "urgency": ["string"],
        "socialProof": ["string"]
      }
    }
  `,

  'seo-brief': (input: any, context: any) => `
    Eres un estratega de contenido SEO. Crea un brief para:
    - Palabra clave principal: ${input.primaryKeyword}
    - Palabras clave secundarias: ${input.secondaryKeywords}
    - Intención de búsqueda: ${input.searchIntent}
    - Tipo de página: ${input.pageType}

    Idioma: ${input.language || context.language || 'es'}

    Responde estrictamente en formato JSON:
    {
      "intentSummary": "string",
      "seoTitles": ["string"],
      "metaDescriptions": ["string"],
      "outline": ["string"],
      "relatedQuestions": ["string"],
      "internalLinkIdeas": ["string"]
    }
  `,

  'blog-toolkit': (input: any, context: any) => `
    Eres un experto redactor de blogs. Genera contenido para:
    - Tema: ${input.topic}
    - Keyword: ${input.primaryKeyword}
    - Audiencia: ${input.audience}
    - Tono: ${input.tone || context.brandTone}
    - Objetivo: ${input.articleGoal}
    - Longitud: ${input.desiredLength}

    Idioma: ${context.language || 'es'}

    Responde estrictamente en formato JSON:
    {
      "titles": ["string"],
      "outline": ["string"],
      "intro": "string",
      "fullDraft": "string",
      "faqs": [
        { "q": "string", "a": "string" }
      ]
    }
  `,

  'cta-generator': (input: any, context: any) => `
    Eres un experto en optimización de la conversión (CRO). Genera CTAs para:
    - Objetivo: ${input.goal}
    - Tono: ${input.tone || context.brandTone}
    - Canal: ${input.channel}
    - Nivel de urgencia: ${input.urgencyLevel}

    Idioma: ${context.language || 'es'}

    Responde estrictamente en formato JSON:
    {
      "directCtas": ["string"],
      "softCtas": ["string"],
      "emotionalCtas": ["string"],
      "conversionFocusedCtas": ["string"]
    }
  `
};

export const TRANSFORM_PROMPTS = {
  rewrite: (text: string, context: any) => `Reescribe el siguiente texto de forma más profesional y clara, manteniendo el tono ${context.brandTone || 'neutral'}. Texto: ${text}`,
  expand: (text: string, context: any) => `Expande el siguiente texto añadiendo más detalles y profundidad, manteniendo el contexto del proyecto ${context.name}. Texto: ${text}`,
  summarize: (text: string, context: any) => `Resume el siguiente texto manteniendo los puntos clave. Texto: ${text}`,
  professional: (text: string, context: any) => `Cambia el tono del siguiente texto a uno más profesional y corporativo. Texto: ${text}`,
  persuasive: (text: string, context: any) => `Cambia el tono del siguiente texto a uno más persuasivo y orientado a la venta. Texto: ${text}`,
  clearer: (text: string, context: any) => `Haz el siguiente texto más claro y fácil de entender. Texto: ${text}`,
};
