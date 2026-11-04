'use client';

import React, { useState } from 'react';
import { FollowUp, UserRole, LanguageCode } from '@/types';
import { getTranslation } from '@/lib/translations';
import {
  CalendarClock,
  ClockAlert,
  Send,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Filter
} from 'lucide-react';

interface FollowUpViewProps {
  followUps: FollowUp[];
  onSendReminder: (followUpId: string) => void;
  currentRole: UserRole;
  currentLanguage: LanguageCode;
}

export const FollowUpView: React.FC<FollowUpViewProps> = ({
  followUps,
  onSendReminder,
  currentRole,
  currentLanguage,
}) => {
  const t = getTranslation(currentLanguage);

  const [filter, setFilter] = useState<'all' | 'due' | 'overdue' | 'completed'>('all');
  const [activeModalItem, setActiveModalItem] = useState<FollowUp | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const filtered = followUps.filter((f) => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  const handleDispatchReminder = (fu: FollowUp) => {
    onSendReminder(fu.id);
    setActiveModalItem(null);
    setSuccessNote(
      `Reminder successfully dispatched to ${fu.patientName} (${fu.patientMobile}) via ${reminderChannel.toUpperCase()}! Reminder counter incremented.`
    );
    setTimeout(() => setSuccessNote(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-revonix-850/80 p-5 rounded-2xl border border-revonix-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">
              Module 11: Follow-Up Management & Digital Reminders
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-revonix-purple-900 text-revonix-purple-300 font-mono font-bold">
              Receptionist Owner
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracks doctor-set return dates, flags overdue patients, and dispatches multilingual WhatsApp & SMS reminders.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center bg-revonix-900 border border-revonix-700 rounded-xl p-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-revonix-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({followUps.length})
          </button>
          <button
            onClick={() => setFilter('due')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'due'
                ? 'bg-revonix-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming Due
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'overdue'
                ? 'bg-red-600 text-white font-bold'
                : 'text-red-400 hover:text-red-200'
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {successNote && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Follow-up Table */}
      <div className="bg-revonix-850/90 border border-revonix-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-revonix-900/80 text-slate-400 border-b border-revonix-700/60">
              <tr>
                <th className="py-3 px-4">Patient & Mobile</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Clinical Reason</th>
                <th className="py-3 px-4">Reminders Sent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-revonix-700/40 text-slate-200">
              {filtered.map((fu) => {
                const isOverdue = fu.status === 'overdue';

                return (
                  <tr
                    key={fu.id}
                    className={`hover:bg-revonix-800/40 transition-colors ${
                      isOverdue ? 'bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{fu.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{fu.patientMobile}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-revonix-purple-400" />
                        <span>{fu.dueDate}</span>
                      </div>
                      {isOverdue && (
                        <span className="text-[10px] text-red-400 font-bold">
                          Follow-up Past Due
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-[240px]">
                      <div className="text-slate-300 truncate" title={fu.reason}>
                        {fu.reason}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Linked: {fu.consultationId}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono px-2 py-0.5 rounded bg-revonix-900 text-slate-300 text-xs">
                        {fu.reminderCount} sent
                      </span>
                      {fu.lastReminderAt && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Last: {new Date(fu.lastReminderAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                          <ClockAlert className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          <span>Upcoming</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveModalItem(fu)}
                        className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reminder</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Message Preview Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-revonix-900 border border-revonix-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-revonix-700/60 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Dispatch Patient Follow-Up Reminder</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {activeModalItem.patientMobile}
              </span>
            </div>

            {/* Channel toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setReminderChannel('whatsapp')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  reminderChannel === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-revonix-850 text-slate-300 border border-revonix-700'
                }`}
              >
                WhatsApp Message (Meta API)
              </button>
              <button
                type="button"
                onClick={() => setReminderChannel('sms')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  reminderChannel === 'sms'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-revonix-850 text-slate-300 border border-revonix-700'
                }`}
              >
                SMS Gateway Link
              </button>
            </div>

            {/* Message Preview Box */}
            <div className="p-4 rounded-xl bg-revonix-950 border border-revonix-800 text-xs text-slate-200 space-y-2 leading-relaxed">
              <div className="font-semibold text-emerald-400">
                [Parasnath Speciality Clinic, Badlapur]
              </div>
              <p>
                नमस्ते <strong>{activeModalItem.patientName}</strong> जी,
              </p>
              <p>
                डॉक्टर अरविंद पाटिल के परामर्श अनुसार आपकी अगली फॉलो-अप भेंट की तारीख{' '}
                <strong className="text-amber-300">{activeModalItem.dueDate}</strong> तय है।
              </p>
              <p className="text-slate-400 text-[11px]">
                कारण: {activeModalItem.reason}. कृपया अपनी एक्स-रे रिपोर्ट व पूर्व पर्चे साथ लाएं।
              </p>
              <p className="text-[11px] text-slate-500">
                हेल्पलाइन: +91 251 269 8800 | कतरप रोड, बदलापूर पूर्व
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-4 py-2 rounded-lg bg-revonix-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDispatchReminder(activeModalItem)}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

