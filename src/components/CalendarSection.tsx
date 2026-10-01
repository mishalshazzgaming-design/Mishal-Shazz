import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Circle, Edit2, Sparkles } from 'lucide-react';
import { PrayerName, PrayerRecord, PrayerStatus } from '../types';
import { formatGregorianDisplay, getHijriDateDisplay } from '../utils/prayerTimes';

interface CalendarSectionProps {
  onOpenEditModal: (prayer: PrayerRecord) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ onOpenEditModal }) => {
  const {
    activeProfile,
    activeUserId,
    selectedDateStr,
    setSelectedDateStr,
    getPrayersForDateAndUser,
    selectedDayBreakdown,
    quranLogs,
    currentLocalDateStr,
  } = useIbadah();

  // Current calendar view month/year
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Generate days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format YYYY-MM-DD
  const formatDayStr = (d: number) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  const selectedDateObj = new Date(selectedDateStr + 'T12:00:00');
  const selectedGregorian = formatGregorianDisplay(selectedDateObj, activeProfile.timezone);
  const selectedHijri = getHijriDateDisplay(selectedDateObj, activeProfile.timezone);

  const selectedPrayers = getPrayersForDateAndUser(selectedDateStr, activeUserId);
  const prayersOrder: { key: PrayerName; displayName: string }[] = [
    { key: 'fajr', displayName: 'Fajr' },
    { key: 'dhuhr', displayName: 'Dhuhr' },
    { key: 'asr', displayName: 'Asr' },
    { key: 'maghrib', displayName: 'Maghrib' },
    { key: 'isha', displayName: 'Isha' },
  ];

  const selectedCompletedCount = prayersOrder.filter(p => selectedPrayers[p.key]?.status === 'completed').length;
  const selectedQuranLog = quranLogs.find(q => q.userId === activeUserId && q.date === selectedDateStr);

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#8DB7D9] font-medium flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Prayer & Points History</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            Monthly Calendar
          </h2>
        </div>

        {/* Month selector controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5F3EE] transition"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs sm:text-sm font-semibold text-[#F5F3EE] min-w-[110px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5F3EE] transition"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day name labels */}
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-[#B8C1CC]/70 pb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty_${i}`} className="h-10 sm:h-12 rounded-xl bg-transparent" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayStr = formatDayStr(dayNum);
            const isSelected = dayStr === selectedDateStr;
            const isToday = dayStr === currentLocalDateStr;

            const dayPrayers = getPrayersForDateAndUser(dayStr, activeUserId);
            const completed = prayersOrder.filter(p => dayPrayers[p.key]?.status === 'completed').length;
            const hasRecords = Object.values(dayPrayers).some(p => p !== undefined);

            // Dot status
            let dotColor = 'bg-white/15'; // ⚪ No records
            if (completed === 5) {
              dotColor = 'bg-emerald-400 shadow-sm shadow-emerald-400/50'; // 🟢 All 5
            } else if (completed > 0 || hasRecords) {
              dotColor = 'bg-amber-400'; // 🟡 Partial
            }

            return (
              <button
                key={dayStr}
                onClick={() => setSelectedDateStr(dayStr)}
                className={`h-11 sm:h-13 rounded-xl border flex flex-col items-center justify-center p-1 transition relative group ${
                  isSelected
                    ? 'bg-[#8DB7D9]/25 border-[#8DB7D9] shadow-md shadow-[#8DB7D9]/10'
                    : isToday
                    ? 'bg-white/8 border-white/20'
                    : 'bg-white/3 hover:bg-white/6 border-white/6'
                }`}
              >
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    isSelected ? 'text-[#F5F3EE]' : isToday ? 'text-[#8DB7D9]' : 'text-[#B8C1CC]'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Status indicator dot */}
                <span className={`w-1.5 h-1.5 rounded-full mt-1 ${dotColor}`} />
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-[#B8C1CC]/70">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            All 5 Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Partial / In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            No records
          </span>
        </div>
      </div>

      {/* SELECTED DAY DETAIL DRAWER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1728]/90 border border-white/12 space-y-4 shadow-inner">
        {/* Selected Date Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-white/10">
          <div>
            <div className="font-serif-elegant font-bold text-base sm:text-lg text-[#F5F3EE]">
              {selectedGregorian}
            </div>
            <div className="text-xs text-[#D8B477] font-arabic">
              {selectedHijri}
            </div>
          </div>
          <div className="text-xs text-[#8DB7D9] font-medium self-start sm:self-center">
            {selectedCompletedCount} / 5 completed • {selectedDayBreakdown.prayerTotal} prayer points
          </div>
        </div>

        {/* FARD PRAYERS LIST */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-[#B8C1CC]/70 font-medium">
            Fard Prayers Breakdown
          </div>

          <div className="space-y-1.5">
            {prayersOrder.map(({ key, displayName }) => {
              const record = selectedPrayers[key];
              const isCompleted = record?.status === 'completed';
              const isMissed = record?.status === 'missed';

              return (
                <div
                  key={key}
                  className="p-2.5 rounded-xl bg-white/4 border border-white/6 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5F3EE] w-16">{displayName}</span>
                    {isCompleted && (
                      <span className="text-[#8DB7D9] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ✓ Completed at {record.actualTime || 'recorded time'}
                        <span className="text-[#D8B477] font-semibold ml-1">+{record.points} pts</span>
                        {record.edited && <span className="text-[10px] text-white/40 italic">(edited)</span>}
                      </span>
                    )}
                    {isMissed && (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        ✕ Missed (0 points)
                      </span>
                    )}
                    {!record && (
                      <span className="text-[#B8C1CC]/40 flex items-center gap-1">
                        <Circle className="w-3.5 h-3.5" />
                        ○ Not recorded
                      </span>
                    )}
                  </div>

                  {/* Edit button */}
                  {record && (
                    <button
                      onClick={() => onOpenEditModal(record)}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] text-[#8DB7D9] border border-white/10 transition"
                    >
                      Edit
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* TOTAL POINTS BREAKDOWN */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#B8C1CC]">
            <span>🕌 Fard Prayers:</span>
            <span className="font-semibold text-[#F5F3EE]">+{selectedDayBreakdown.prayerTotal}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#B8C1CC]">
            <span>✨ Sunnah & Nafl:</span>
            <span className="font-semibold text-[#F5F3EE]">+{selectedDayBreakdown.sunnahPoints}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#B8C1CC]">
            <span>📖 Quran ({selectedQuranLog?.pagesRead || 0}p):</span>
            <span className="font-semibold text-[#F5F3EE]">+{selectedDayBreakdown.quranPoints}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#B8C1CC]">
            <span>🤝 Good Deeds & Sadaqah:</span>
            <span className="font-semibold text-[#F5F3EE]">+{selectedDayBreakdown.otherTotal}</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold">
            <span className="text-[#D8B477]">⭐ Total:</span>
            <span className="text-base text-[#D8B477] font-serif-elegant">
              ⭐ {selectedDayBreakdown.grandTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
