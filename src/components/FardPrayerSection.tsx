import React from 'react';
import { useIbadah } from '../context/IbadahContext';
import { PrayerName, PrayerRecord } from '../types';
import { CheckCircle2, Circle, XCircle, Clock, Edit2, Sparkles, AlertCircle } from 'lucide-react';

interface FardPrayerSectionProps {
  onOpenEditModal: (prayer: PrayerRecord) => void;
}

export const FardPrayerSection: React.FC<FardPrayerSectionProps> = ({ onOpenEditModal }) => {
  const {
    currentSchedule,
    activeUserId,
    currentLocalDateStr,
    getPrayersForDateAndUser,
    recordPrayerCompletion,
    markPrayerMissed,
    activeProfile,
  } = useIbadah();

  const userPrayers = getPrayersForDateAndUser(currentLocalDateStr, activeUserId);

  const prayersOrder: { key: PrayerName; displayName: string }[] = [
    { key: 'fajr', displayName: 'FAJR' },
    { key: 'dhuhr', displayName: 'DHUHR' },
    { key: 'asr', displayName: 'ASR' },
    { key: 'maghrib', displayName: 'MAGHRIB' },
    { key: 'isha', displayName: 'ISHA' },
  ];

  const completedCount = prayersOrder.filter(p => userPrayers[p.key]?.status === 'completed').length;

  return (
    <div className="w-full space-y-3">
      {/* Header with completion counter */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-semibold tracking-wider uppercase text-[#8DB7D9] flex items-center gap-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#8DB7D9]" />
            Fard Prayers
          </h2>
          <p className="text-[11px] text-[#B8C1CC]/70">Obligatory five prayers with exact timestamps</p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#F5F3EE]">
          <span className="text-[#8DB7D9] font-bold">{completedCount}</span> / 5 Completed
        </div>
      </div>

      {/* Grid / List of 5 prayers */}
      <div className="grid grid-cols-1 gap-2.5">
        {prayersOrder.map(({ key, displayName }) => {
          const prayerInfo = currentSchedule[key];
          const record = userPrayers[key];
          const isCompleted = record?.status === 'completed';
          const isMissed = record?.status === 'missed';
          const isUnrecorded = !isCompleted && !isMissed;

          return (
            <div
              key={key}
              className={`p-3.5 sm:p-4 rounded-xl transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCompleted
                  ? 'bg-white/7 border-[#8DB7D9]/30 shadow-sm shadow-[#8DB7D9]/5'
                  : isMissed
                  ? 'bg-rose-950/20 border-rose-500/20'
                  : 'bg-white/4 hover:bg-white/6 border-white/8'
              }`}
            >
              {/* Left Info: Name & Scheduled time */}
              <div className="flex items-start sm:items-center gap-3">
                {/* Status icon badge */}
                <div className="mt-0.5 sm:mt-0">
                  {isCompleted && (
                    <div className="w-8 h-8 rounded-full bg-[#8DB7D9]/20 border border-[#8DB7D9]/40 flex items-center justify-center text-[#8DB7D9]">
                      <CheckCircle2 className="w-5 h-5 fill-[#8DB7D9]/30" />
                    </div>
                  )}
                  {isMissed && (
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                  {isUnrecorded && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/40">
                      <Circle className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-elegant font-bold text-sm tracking-wide text-[#F5F3EE]">
                      {displayName}
                    </span>
                    <span className="text-xs text-[#B8C1CC]/70 font-sans">
                      Start: {prayerInfo.scheduledTimeStr}
                    </span>
                  </div>

                  {/* Dynamic Status line */}
                  <div className="flex items-center gap-2 mt-0.5 text-xs">
                    {isCompleted && (
                      <>
                        <span className="text-[#8DB7D9] font-medium flex items-center gap-1">
                          ✓ Completed
                        </span>
                        <span className="text-[#B8C1CC]/50">•</span>
                        <span className="text-[#F5F3EE]/90">Prayed at {record.actualTime}</span>
                        <span className="text-[#B8C1CC]/50">•</span>
                        <span className="text-[#D8B477] font-semibold">+{record.points} pts</span>
                        {record.edited && (
                          <span className="text-[10px] text-white/40 italic">(edited)</span>
                        )}
                      </>
                    )}
                    {isMissed && (
                      <>
                        <span className="text-rose-400 font-medium">✕ Missed</span>
                        <span className="text-[#B8C1CC]/50">•</span>
                        <span className="text-[#B8C1CC]/70">0 points</span>
                      </>
                    )}
                    {isUnrecorded && (
                      <span className="text-[#B8C1CC]/60 flex items-center gap-1">
                        ○ Not recorded yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {isUnrecorded && (
                  <>
                    <button
                      onClick={() => recordPrayerCompletion(key)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#8DB7D9]/20 hover:bg-[#8DB7D9]/30 text-[#8DB7D9] hover:text-[#F5F3EE] border border-[#8DB7D9]/40 text-xs font-medium transition active:scale-95 flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Complete Now</span>
                    </button>
                    <button
                      onClick={() => markPrayerMissed(key)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-rose-500/15 text-[#B8C1CC] hover:text-rose-300 border border-white/10 text-xs transition active:scale-95"
                      title="Mark as missed"
                    >
                      Missed
                    </button>
                  </>
                )}

                {record && (
                  <button
                    onClick={() => onOpenEditModal(record)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#B8C1CC] hover:text-[#F5F3EE] border border-white/10 text-xs transition active:scale-95 flex items-center gap-1"
                    title="Edit time or status"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Edit</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
