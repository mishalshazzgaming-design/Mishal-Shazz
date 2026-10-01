import React from 'react';
import { useIbadah } from '../context/IbadahContext';
import { TrendingUp, Sparkles } from 'lucide-react';
import { getDateStringInTimezone, getCurrentTimeInTimezone } from '../utils/prayerTimes';

export const WeeklyGraph: React.FC = () => {
  const { pointEvents, activeUserId, activeProfile, currentLocalDateStr } = useIbadah();

  // Generate 7 days ending today
  const now = getCurrentTimeInTimezone(activeProfile.timezone);
  const days: { dateStr: string; dayLabel: string; dayNum: number; isToday: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = getDateStringInTimezone(d, activeProfile.timezone);
    const dayLabel = new Intl.DateTimeFormat('en-US', { timeZone: activeProfile.timezone, weekday: 'narrow' }).format(d);
    const dayNum = d.getDate();
    days.push({
      dateStr,
      dayLabel,
      dayNum,
      isToday: dateStr === currentLocalDateStr,
    });
  }

  // Calculate points for each day
  const dailyPoints = days.map(day => {
    const pts = pointEvents
      .filter(e => e.userId === activeUserId && e.date === day.dateStr)
      .reduce((sum, e) => sum + e.points, 0);
    return {
      ...day,
      points: pts,
    };
  });

  const totalWeekPoints = dailyPoints.reduce((sum, d) => sum + d.points, 0);
  const maxPoints = Math.max(500, ...dailyPoints.map(d => d.points));

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-white/12 shadow-xl relative overflow-hidden space-y-4">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#8DB7D9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Symbols & Total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#8DB7D9]/15 border border-[#8DB7D9]/30 flex items-center justify-center text-[#8DB7D9]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#8DB7D9] font-semibold flex items-center gap-1">
              <span>7-Day Journey</span>
              <span>📈</span>
            </div>
            <div className="text-xs text-[#B8C1CC]/70">Consistency overview</div>
          </div>
        </div>

        {/* Total Points Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D8B477]/15 to-[#8DB7D9]/15 border border-[#D8B477]/30 flex items-center gap-1.5">
          <span className="text-sm">⭐</span>
          <span className="text-xs text-[#B8C1CC]">Total:</span>
          <span className="font-serif-elegant font-bold text-sm sm:text-base text-[#D8B477]">
            {totalWeekPoints.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="pt-2 pb-1">
        <div className="h-36 sm:h-40 flex items-end justify-between gap-2 sm:gap-3 px-1 sm:px-3 border-b border-white/10 pb-2">
          {dailyPoints.map((day) => {
            const heightPercent = Math.max(8, Math.round((day.points / maxPoints) * 100));

            return (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Floating points number */}
                <span className={`text-[10px] mb-1 font-semibold transition opacity-80 group-hover:opacity-100 ${
                  day.isToday ? 'text-[#D8B477]' : 'text-[#8DB7D9]'
                }`}>
                  {day.points > 0 ? day.points : '•'}
                </span>

                {/* Vertical Bar */}
                <div className="w-full max-w-[28px] sm:max-w-[34px] bg-white/5 rounded-t-xl overflow-hidden p-0.5 relative flex items-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      day.isToday
                        ? 'bg-gradient-to-t from-[#8DB7D9] to-[#D8B477] shadow-[0_0_12px_rgba(216,180,119,0.4)]'
                        : day.points > 0
                        ? 'bg-gradient-to-t from-[#8DB7D9]/40 to-[#8DB7D9]/90'
                        : 'bg-white/10'
                    }`}
                  />
                </div>

                {/* Day label and date */}
                <div className="mt-2 text-center">
                  <span className={`text-[11px] font-bold block ${
                    day.isToday ? 'text-[#D8B477]' : 'text-[#F5F3EE]'
                  }`}>
                    {day.dayLabel}
                  </span>
                  <span className="text-[9px] text-[#B8C1CC]/60 block font-mono">
                    {day.dayNum}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal symbols footer */}
        <div className="flex items-center justify-between text-[11px] text-[#B8C1CC]/60 pt-2.5 px-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D8B477]" />
              <span>Today</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8DB7D9]" />
              <span>Past Days</span>
            </span>
          </div>
          <span className="text-[10px] text-[#D8B477] flex items-center gap-1">
            <span>✨</span>
            <span>+10 Nafl • +50 Quran Page</span>
          </span>
        </div>
      </div>
    </div>
  );
};
