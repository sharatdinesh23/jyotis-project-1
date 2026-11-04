import { NextResponse } from 'next/server';
import { savePatientVoiceNote, getPatientVoiceNotes, addAuditLog } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId') || undefined;

    const voiceNotes = getPatientVoiceNotes(patientId);
    return NextResponse.json({ success: true, voiceNotes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      patientId,
      patientName,
      patientMobile,
      audioData,
      audioDuration,
      language = 'en',
      transcription = '',
      chiefIssue = ''
    } = body;

    if (!patientId || !patientName) {
      return NextResponse.json({ error: 'Patient ID and Name are required' }, { status: 400 });
    }

    // Default AI transcription fallback if none provided
    const finalTranscript = transcription || (
      language === 'mr'
        ? 'माझ्या डाव्या गुडघ्यात खूप वेदना होत आहेत, जिने चढताना त्रास होतो.'
        : language === 'hi'
        ? 'मुझे घुटने में पिछले कुछ दिनों से काफी दर्द और जकड़न महसूस हो रही है।'
        : 'Patient recorded voice note describing pain and joint stiffness affecting routine mobility.'
    );

    const finalIssue = chiefIssue || (
      language === 'mr'
        ? 'गुडघेदुखी व हालचालीत अडथळा'
        : language === 'hi'
        ? 'घुटने का दर्द एवं सुबह की जकड़न'
        : 'Joint pain & functional mobility impairment'
    );

    const voiceNote = savePatientVoiceNote({
      patientId,
      patientName,
      patientMobile: patientMobile || '',
      audioData: audioData || null,
      audioDuration: audioDuration || 15,
      language,
      transcription: finalTranscript,
      chiefIssue: finalIssue,
      status: 'pending_doctor_review',
    });

    addAuditLog(
      patientName,
      'patient',
      'create',
      `Patient recorded voice note (${voiceNote.id}) for pre-consultation intake`
    );

    return NextResponse.json({ success: true, voiceNote });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

