'use client';

import React, { useState } from 'react';
import { Patient, HealthQuestionnaire, LanguageCode } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  ClipboardList,
  X,
  CheckCircle2,
  AlertTriangle,
  Activity,
  HeartPulse,
  Sparkles
} from 'lucide-react';

interface QuestionnaireModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveIntake: (intake: HealthQuestionnaire) => void;
  currentLanguage: LanguageCode;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSaveIntake,
  currentLanguage,
}) => {
  const t = getTranslation(currentLanguage);

  const [category, setCategory] = useState<HealthQuestionnaire['category']>('knee_joint');
  const [chiefComplaint, setChiefComplaint] = useState(
    'Severe right knee pain for 6 months, worse on stairs and kneeling. Morning stiffness ~20 minutes.'
  );
  const [symptomsDuration, setSymptomsDuration] = useState('6 months, progressive');
  const [pastHistory, setPastHistory] = useState('Hypertension (5 years) on Amlodipine 5mg');
  const [currentMedicines, setCurrentMedicines] = useState('Tab Amlodipine 5mg OD');
  const [priorTreatment, setPriorTreatment] = useState('Home remedies, occasional over-the-counter painkillers');
  const [allergies, setAllergies] = useState('Gastric acidity and stomach burning with NSAID pain tablets');
  const [lifestyle, setLifestyle] = useState('Sedentary, climbs 2 flights of stairs daily at home');

  if (!isOpen || !patient) return null;

  const handleCategorySelect = (cat: HealthQuestionnaire['category']) => {
    setCategory(cat);
    if (cat === 'knee_joint') {
      setChiefComplaint('Severe right knee pain for 6 months, worse on stairs and squatting. Morning stiffness ~20 minutes.');
      setSymptomsDuration('6 months');
      setAllergies('Gastric burning with strong pain tablets');
    } else if (cat === 'back_spine') {
      setChiefComplaint('Lower back stiffness and muscular spasm for 2 weeks from prolonged desk sitting.');
      setSymptomsDuration('2 weeks');
      setAllergies('None known');
    } else if (cat === 'fever_viral') {
      setChiefComplaint('High fever, body chills, headache and sore throat for 3 days.');
      setSymptomsDuration('3 days');
      setAllergies('Penicillin allergy reported');
    } else {
      setChiefComplaint('General health check-up, fatigue, and routine blood pressure screening.');
      setSymptomsDuration('1 month');
      setAllergies('No known drug allergies (NKDA)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const intake: HealthQuestionnaire = {
      id: `INTAKE-${Date.now()}`,
      patientId: patient.id,
      visitDate: new Date().toISOString().split('T')[0],
      chiefComplaint,
      symptomsAndDuration: symptomsDuration,
      pastHistory,
      currentMedicines,
      priorTreatment,
      allergies,
      lifestyle,
      category,
    };
    onSaveIntake(intake);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-revonix-900 border border-revonix-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-revonix-900/95 backdrop-blur-md p-4 border-b border-revonix-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-revonix-purple-600/20 text-revonix-purple-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Module 2: Pre-Consultation Health Questionnaire</h3>
              <p className="text-xs text-slate-400">
                Patient: <span className="text-white font-semibold">{patient.name}</span> ({patient.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-revonix-800 hover:bg-revonix-700 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Adaptive Complaint Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-revonix-purple-300 mb-2">
              Select Complaint Category (Adapts Questionnaire)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleCategorySelect('knee_joint')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  category === 'knee_joint'
                    ? 'bg-revonix-purple-600 text-white border-revonix-purple-400 shadow-md'
                    : 'bg-revonix-850 text-slate-300 border-revonix-700 hover:bg-revonix-800'
                }`}
              >
                🦴 Knee & Joint Pain
              </button>

              <button
                type="button"
                onClick={() => handleCategorySelect('back_spine')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  category === 'back_spine'
                    ? 'bg-revonix-purple-600 text-white border-revonix-purple-400 shadow-md'
                    : 'bg-revonix-850 text-slate-300 border-revonix-700 hover:bg-revonix-800'
                }`}
              >
                🧘 Back & Spine
              </button>

              <button
                type="button"
                onClick={() => handleCategorySelect('fever_viral')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  category === 'fever_viral'
                    ? 'bg-revonix-purple-600 text-white border-revonix-purple-400 shadow-md'
                    : 'bg-revonix-850 text-slate-300 border-revonix-700 hover:bg-revonix-800'
                }`}
              >
                🌡️ Fever & Infection
              </button>

              <button
                type="button"
                onClick={() => handleCategorySelect('general')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  category === 'general'
                    ? 'bg-revonix-purple-600 text-white border-revonix-purple-400 shadow-md'
                    : 'bg-revonix-850 text-slate-300 border-revonix-700 hover:bg-revonix-800'
                }`}
              >
                🩺 General Health / BP
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chief Complaint & Details *
              </label>
              <textarea
                rows={2}
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Duration & Onset
                </label>
                <input
                  type="text"
                  value={symptomsDuration}
                  onChange={(e) => setSymptomsDuration(e.target.value)}
                  className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Past Medical History
                </label>
                <input
                  type="text"
                  value={pastHistory}
                  onChange={(e) => setPastHistory(e.target.value)}
                  className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Medicines
                </label>
                <input
                  type="text"
                  value={currentMedicines}
                  onChange={(e) => setCurrentMedicines(e.target.value)}
                  className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Drug Allergies & Sensitivities</span>
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full bg-revonix-850 border border-amber-600/40 rounded-lg px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lifestyle & Physical Activity Level
              </label>
              <input
                type="text"
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                className="w-full bg-revonix-850 border border-revonix-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-revonix-purple-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-revonix-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-revonix-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-revonix-purple-600 to-indigo-600 hover:from-revonix-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow"
            >
              Attach Questionnaire to Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

