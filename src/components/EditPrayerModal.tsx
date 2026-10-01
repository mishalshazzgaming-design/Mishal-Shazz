import React, { useState } from 'react';
import { X, Clock, Edit3, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { PrayerRecord, PrayerStatus } from '../types';
import { useIbadah } from '../context/IbadahContext';

interface EditPrayerModalProps {
  prayer: PrayerRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPrayerModal: React.FC<EditPrayerModalProps> = ({ prayer, isOpen, onClose }) => {
  const { editPrayerRecord, pointsConfig } = useIbadah();

  if (!isOpen || !prayer) return null;

  const [status, setStatus] = useState<PrayerStatus>(prayer.status);
  const [actualTime, setActualTime] = useState<string>(prayer.actualTime || '12:00 PM');
  const [customPoints, setCustomPoints] = useState<number>(prayer.points || 50);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    editPrayerRecord(
      prayer.id,
      status,
      status === 'completed' ? actualTime : undefined,
      status === 'completed' ? customPoints : 0
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7 border border-white/15 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-[#F5F3EE] p-1.5 rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8DB7D9]/20 border border-[#8DB7D9]/40 flex items-center justify-center text-[#8DB7D9]">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-elegant font-bold text-lg text-[#F5F3EE] uppercase">
              Edit {prayer.prayerName} Record
            </h3>
            <p className="text-xs text-[#B8C1CC]/70">Date: {prayer.date} • Scheduled: {prayer.scheduledTime}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#8DB7D9] uppercase tracking-wider block">
              Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                  status === 'completed'
                    ? 'bg-[#8DB7D9]/25 border-[#8DB7D9] text-[#F5F3EE]'
                    : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#8DB7D9]" />
                <span>Completed</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('missed')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                  status === 'missed'
                    ? 'bg-rose-500/25 border-rose-500 text-rose-200'
                    : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Missed</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('unrecorded')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                  status === 'unrecorded'
                    ? 'bg-white/20 border-white/30 text-[#F5F3EE]'
                    : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                }`}
              >
                <Circle className="w-4 h-4 text-white/40" />
                <span>Unrecorded</span>
              </button>
            </div>
          </div>

          {/* Actual time input if completed */}
          {status === 'completed' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-[#B8C1CC] block mb-1">
                  Actual Prayed Time
                </label>
                <input
                  type="text"
                  required
                  value={actualTime}
                  onChange={e => setActualTime(e.target.value)}
                  placeholder="e.g. 4:28 AM or 12:15 PM"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#B8C1CC] block mb-1">
                  Points Awarded (0 to 50)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={customPoints}
                  onChange={e => setCustomPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#B8C1CC] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8DB7D9] hover:bg-[#8DB7D9]/90 text-[#07111F] text-xs font-semibold transition active:scale-95 shadow-md shadow-[#8DB7D9]/10"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
