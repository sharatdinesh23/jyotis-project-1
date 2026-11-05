import { NextResponse } from 'next/server';

export async function GET() {
  const aiProvider = process.env.AI_PROVIDER || 'gemini';
  const aiModel = process.env.AI_MODEL || (
    aiProvider === 'groq' ? 'openai/gpt-oss-120b' :
    aiProvider === 'gemini' ? 'gemini-3.5-flash' :
    aiProvider === 'openrouter' ? 'meta-llama/llama-3.3-70b-instruct:free' : 'gpt-4o'
  );
  const transcriptionProvider = process.env.TRANSCRIPTION_PROVIDER || 'mock';

  return NextResponse.json({
    aiProvider,
    aiModel,
    transcriptionProvider,
    hasGroqKey: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 5),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 5),
    hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 5),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 5),
    hasDeepgramKey: Boolean(process.env.DEEPGRAM_API_KEY && process.env.DEEPGRAM_API_KEY.trim().length > 5),
    clinicalExtractionPrompt: process.env.CLINICAL_EXTRACTION_SYSTEM_PROMPT || '',
    transcriptionPrompt: process.env.TRANSCRIPTION_SYSTEM_PROMPT || '',
    patientIntakePrompt: process.env.PATIENT_INTAKE_PROMPT || '',
    extractionTemperature: parseFloat(process.env.AI_EXTRACTION_TEMPERATURE || '0.1'),
    clinicName: process.env.CLINIC_NAME || 'Parasnath Speciality Clinic',
    location: process.env.CLINIC_LOCATION || 'Badlapur',
  });
}

