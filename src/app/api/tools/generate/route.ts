import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { TOOL_PROMPTS } from '@/lib/prompts';
import { generateJSON } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await req.json();
    const { projectId, toolSlug, input } = body;

    if (!projectId || !toolSlug || !input) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Validate project ownership
    const projectDoc = await adminDb.collection('projects').doc(projectId).get();
    if (!projectDoc.exists || projectDoc.data()?.userId !== userId) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 });
    }

    const projectContext = projectDoc.data();
    const promptFunc = (TOOL_PROMPTS as any)[toolSlug];
    if (!promptFunc) {
      return NextResponse.json({ error: 'Invalid tool slug' }, { status: 400 });
    }

    const prompt = promptFunc(input, projectContext);
    const output = await generateJSON(prompt);

    // Save generation to Firestore subcollection
    const genRef = await adminDb
      .collection('projects')
      .doc(projectId)
      .collection('generations')
      .add({
        userId,
        projectId,
        toolSlug,
        inputPayload: input,
        outputPayload: output,
        isFavorite: false,
        createdAt: new Date(),
      });

    return NextResponse.json({
      success: true,
      generationId: genRef.id,
      output,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
