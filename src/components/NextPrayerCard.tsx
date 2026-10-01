import React from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Clock, Sun, Moon, Compass, BellRing } from 'lucide-react';
import { PrayerName } from '../types';

export const NextPrayerCard: React.FC = () => {
  const { currentSchedule, activeProfile } = useIbadah();
  const next = currentSchedule.nextPrayer;

  const prayersList: { key: PrayerName | 'sunrise'; name: string; time: string; isNext: boolean; icon: React.ReactNode }[] = [
    { key: 'fajr', name: 'Fajr', time: currentSchedule.fajr.scheduledTimeStr, isNext: next.name === 'fajr' && !next.isPastToday, icon: <Moon className="w-3.5 h-3.5" /> },
    { key: 'sunrise', name: 'Sunrise', time: currentSchedule.sunrise.scheduledTimeStr, isNext: false, icon: <Sun className="w-3.5 h-3.5" /> },
    { key: 'dhuhr', name: 'Dhuhr', time: currentSchedule.dhuhr.scheduledTimeStr, isNext: next.name === 'dhuhr', icon: <Sun className="w-3.5 h-3.5 text-[#D8B477]" /> },
    { key: 'asr', name: 'Asr', time: currentSchedule.asr.scheduledTimeStr, isNext: next.name === 'asr', icon: <Sun className="w-3.5 h-3.5 text-[#8DB7D9]" /> },
    { key: 'maghrib', name: 'Maghrib', time: currentSchedule.maghrib.scheduledTimeStr, isNext: next.name === 'maghrib', icon: <Moon className="w-3.5 h-3.5 text-[#D8B477]" /> },
    { key: 'isha', name: 'Isha', time: currentSchedule.isha.scheduledTimeStr, isNext: next.name === 'isha', icon: <Moon className="w-3.5 h-3.5 text-[#8DB7D9]" /> },
  ];

  // Ring for minutes countdown (max 360 min scale)
  const maxCountdownMin = 360;
  const countdownRatio = Math.min(1, Math.max(0.05, (maxCountdownMin - next.minutesRemaining) / maxCountdownMin));

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-white/12 shadow-xl relative overflow-hidden transition-all">
      {/* Background glow behind active card */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#8DB7D9]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Next Prayer highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8DB7D9] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8DB7D9] animate-ping" />
            <span>Next Prayer</span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5 tracking-wide flex items-baseline gap-2">
            <span>{next.displayName.toUpperCase()}</span>
            <span className="text-lg sm:text-xl font-normal text-[#D8B477]">
              {next.scheduledTimeStr}
            </span>
          </div>
          <p className="text-xs text-[#B8C1CC] mt-0.5">
            {activeProfile.city}, {activeProfile.country}
          </p>
        </div>

        {/* Circular Countdown Ring */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="#8DB7D9"
                strokeWidth="4"
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - countdownRatio)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Clock className="w-4 h-4 text-[#8DB7D9]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#F5F3EE] font-serif-elegant">
              {next.minutesRemaining < 60
                ? `${next.minutesRemaining} min`
                : `${Math.floor(next.minutesRemaining / 60)}h ${next.minutesRemaining % 60}m`}
            </span>
            <span className="text-[11px] text-[#B8C1CC]">Remaining</span>
          </div>
        </div>
      </div>

      {/* Horizontal Prayer Strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3">
        {prayersList.map(prayer => (
          <div
            key={prayer.key}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition text-center ${
              prayer.isNext
                ? 'bg-gradient-to-b from-[#8DB7D9]/25 to-white/10 border border-[#8DB7D9]/40 shadow-md shadow-[#8DB7D9]/10'
                : 'bg-white/5 hover:bg-white/8 border border-white/5'
            }`}
          >
            <div className={`mb-1 ${prayer.isNext ? 'text-[#8DB7D9]' : 'text-[#B8C1CC]'}`}>
              {prayer.icon}
            </div>
            <span
              className={`text-xs font-medium tracking-wide ${
                prayer.isNext ? 'text-[#F5F3EE] font-semibold' : 'text-[#B8C1CC]'
              }`}
            >
              {prayer.name}
            </span>
            <span
              className={`text-[11px] mt-0.5 ${
                prayer.isNext ? 'text-[#D8B477] font-semibold' : 'text-[#B8C1CC]/70'
              }`}
            >
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
