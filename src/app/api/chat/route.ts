import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    // En Docker Compose, el servicio se llama 'rag'
    const agentUrl = process.env.AGENT_API_URL || 'http://rag:8000';
    
    logger_log(`Sending message to agent at ${agentUrl}/chat`);

    const response = await fetch(`${agentUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Agent responded with error:', errorText);
      throw new Error(`El Agente de IA respondió con un error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response });
    
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error al conectar con el Agente de Inversión' },
      { status: 500 }
    );
  }
}

// Helper for internal logging (optional)
function logger_log(msg: string) {
  console.log(`[Chat Bridge] ${msg}`);
}
