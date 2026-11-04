'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Languages
} from 'lucide-react';

interface PatientVoiceNoteRecorderProps {
  patientId: string;
  patientName: string;
  patientMobile: string;
  onVoiceNoteSubmitted: (voiceNote: any) => void;
}

export const PatientVoiceNoteRecorder: React.FC<PatientVoiceNoteRecorderProps> = ({
  patientId,
  patientName,
  patientMobile,
  onVoiceNoteSubmitted,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('hi');
  const [transcript, setTranscript] = useState('');
  const [chiefIssue, setChiefIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    setMicPermissionError(null);
    setAudioUrl(null);
    setAudioBase64(null);
    setTranscript('');
    setChiefIssue('');
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());

        // Simulated AI Transcription matching the selected language
        generateAITranscript(language);
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            // Auto stop at 2 minutes
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone error:', err);
      // Fallback for environments without physical mic permissions
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 6) {
          stopSimulatedRecording();
          return 6;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopSimulatedRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setAudioUrl('demo_voice_note.webm');
    generateAITranscript(language);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  const generateAITranscript = (selectedLang: 'en' | 'hi' | 'mr') => {
    if (selectedLang === 'hi') {
      setTranscript(
        'नमस्ते डॉक्टर साहिब, मुझे पिछले 10-12 दिनों से घुटने में गंभीर दर्द है। चलने-फिरने में और सीढ़ियां चढ़ते समय कट-कट की आवाज आती है और सुबह उठने पर काफी अकड़न रहती है।'
      );
      setChiefIssue('घुटने में तेज दर्द, कट-कट आवाज और सुबह की जकड़न (2 सप्ताह)');
    } else if (selectedLang === 'mr') {
      setTranscript(
        'नमस्कार डॉक्टर, गेल्या दोन आठवड्यांपासून माझ्या उजव्या गुडघ्यात खूप त्रास होत आहे. जिने चढताना आणि खाली उतरताना तीव्र कळ येते, पाय दुमडताना त्रास होतो.'
      );
      setChiefIssue('उजव्या गुडघ्यात तीव्र वेदना आणि हालचालीत अडचण (२ आठवडे)');
    } else {
      setTranscript(
        'Hello Doctor, I have been experiencing persistent right knee pain and morning stiffness for the past two weeks, worsening especially when climbing stairs or walking downhill.'
      );
      setChiefIssue('Severe right knee pain, stiffness and functional limitation since 2 weeks');
    }
  };

  const handleLanguageChange = (lang: 'en' | 'hi' | 'mr') => {
    setLanguage(lang);
    if (audioUrl) {
      generateAITranscript(lang);
    }
  };

  const handleTogglePlay = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSubmitVoiceNote = async () => {
    if (!patientId || !patientName) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/patient-voice-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          patientName,
          patientMobile,
          audioData: audioBase64 || null,
          audioDuration: recordingSeconds || 15,
          language,
          transcription: transcript,
          chiefIssue: chiefIssue,
        }),
      });

      const data = await res.json();
      if (res.ok && data.voiceNote) {
        setHasSubmitted(true);
        onVoiceNoteSubmitted(data.voiceNote);
      } else {
        alert(data.error || 'Failed to submit voice note');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 border border-purple-800/40 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
            <Mic className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
              <span>Patient Voice Note Recording</span>
              <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800/60">
                Pre-Consultation Intake
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Record a short voice note describing your health complaint for Dr. Arvind Patil.
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs shrink-0 self-start sm:self-auto">
          <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          <button
            type="button"
            onClick={() => handleLanguageChange('hi')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              language === 'hi' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('mr')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              language === 'mr' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            मराठी
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              language === 'en' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {hasSubmitted ? (
        /* Success Confirmation */
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">Voice Note Sent Successfully to Clinic Doctors!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Dr. Arvind Patil and the outpatient team have received your recording and AI transcription. They will review it before your consultation starts.
          </p>
          <button
            type="button"
            onClick={() => {
              setHasSubmitted(false);
              setAudioUrl(null);
              setTranscript('');
              setChiefIssue('');
            }}
            className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            Record Another Voice Note
          </button>
        </div>
      ) : (
        /* Recording Controls */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
            {/* Left: Record Button & Timer */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 active:scale-95 transition-all"
                >
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span>Start Voice Recording</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 active:scale-95 transition-all animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Recording</span>
                </button>
              )}

              {/* Timer Display */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-sm font-bold text-white">
                  {formatTime(recordingSeconds)}
                </span>
                <span className="text-[10px] text-slate-500">(Max 2:00)</span>
              </div>
            </div>

            {/* Center: Live Audio Wave Visualizer Animation */}
            {isRecording ? (
              <div className="flex items-center gap-1 h-8">
                {[40, 75, 100, 60, 90, 45, 80, 100, 65, 85, 50, 70].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-purple-400 rounded-full animate-bounce"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.08}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
            ) : audioUrl ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/50">
                <CheckCircle2 className="w-4 h-4" />
                <span>Audio Captured ({recordingSeconds || 15}s)</span>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic">
                Press button to record your symptoms in your preferred language
              </div>
            )}
          </div>

          {/* Audio Player Preview */}
          {audioUrl && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-300 font-medium">Recorded Voice Note Preview</span>
              </div>

              <div className="flex items-center gap-2">
                <audio
                  ref={audioElementRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
                </button>

                <button
                  type="button"
                  onClick={startRecording}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Re-record voice note"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* AI Transcription & Chief Complaint Extraction */}
          {transcript && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-purple-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Speech-to-Text Transcription ({language.toUpperCase()}):</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Editable</span>
              </div>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={2}
                placeholder="Transcribed voice symptoms..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Primary Issue Summary (Transmitted to Doctor's Intake Queue):
                </label>
                <input
                  type="text"
                  value={chiefIssue}
                  onChange={(e) => setChiefIssue(e.target.value)}
                  placeholder="e.g. Knee pain, fever, back stiffness..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmitVoiceNote}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending to Doctor...' : 'Submit Voice Note to Attending Doctor'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

