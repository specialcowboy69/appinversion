import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { getModel } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    await adminAuth.verifyIdToken(idToken);

    const { text, action, context } = await req.json();

    const model = getModel();
    
    let prompt = '';
    switch (action) {
      case 'expand':
        prompt = `Expande el siguiente texto manteniendo el mismo tono y estilo. Añade detalles relevantes y ejemplos si es necesario: \n\n${text}`;
        break;
      case 'shorten':
        prompt = `Resume el siguiente texto manteniendo los puntos clave y un tono profesional: \n\n${text}`;
        break;
      case 'rewrite':
        prompt = `Reescribe el siguiente texto para que sea más ${context.tone || 'profesional'} y atractivo: \n\n${text}`;
        break;
      case 'bullets':
        prompt = `Convierte el siguiente texto en una lista de puntos clave (bullet points) persuasivos: \n\n${text}`;
        break;
      default:
        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const transformedText = response.text();

    return NextResponse.json({ transformedText });
  } catch (error: any) {
    console.error('Error transforming text:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
