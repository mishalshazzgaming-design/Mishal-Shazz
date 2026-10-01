import React from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Moon, Sun, Sparkles, Check, Heart, Shield } from 'lucide-react';

interface SunnahItem {
  id: string;
  name: string;
  symbol: string;
  rakaat: string;
  timingIcon: string;
}

const SUNNAH_PRAYERS: SunnahItem[] = [
  {
    id: 'tahajjud',
    name: 'Tahajjud (Qiyam)',
    symbol: '🌙',
    rakaat: '2–8 rak’ahs',
    timingIcon: '🌌 Late Night',
  },
  {
    id: 'witr',
    name: 'Salat al-Witr',
    symbol: '✨',
    rakaat: '1 or 3 rak’ahs',
    timingIcon: '🌙 After Isha',
  },
  {
    id: 'duha',
    name: 'Salat ad-Duha',
    symbol: '☀️',
    rakaat: '2–8 rak’ahs',
    timingIcon: '🌅 Mid-Morning',
  },
  {
    id: 'rawatib',
    name: 'Sunnah Rawatib',
    symbol: '🕌',
    rakaat: '12 rak’ahs',
    timingIcon: '⏳ Daily Sunnah',
  },
];

export const SunnahPrayerSection: React.FC = () => {
  const { isSunnahCompleted, toggleSunnahPrayer } = useIbadah();

  return (
    <div className="w-full glass-panel-subtle rounded-2xl p-4 sm:p-5 border border-white/8 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">✨</span>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#D8B477] font-sans">
            Sunnah & Voluntary (Nafl)
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#D8B477]/15 text-[#D8B477] border border-[#D8B477]/30 font-semibold flex items-center gap-1">
          <span>⭐</span>
          <span>+10 pts each</span>
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {SUNNAH_PRAYERS.map(item => {
          const isDone = isSunnahCompleted(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleSunnahPrayer(item.id, item.name)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98 ${
                isDone
                  ? 'bg-gradient-to-r from-[#D8B477]/15 to-white/5 border-[#D8B477]/40 shadow-sm'
                  : 'bg-white/4 hover:bg-white/7 border-white/6 text-[#B8C1CC]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.symbol}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#F5F3EE]">{item.name}</span>
                    <span className="text-[10px] text-[#D8B477] font-semibold">+10</span>
                  </div>
                  <div className="text-[11px] text-[#B8C1CC]/70 flex items-center gap-1.5 mt-0.5">
                    <span>{item.rakaat}</span>
                    <span>•</span>
                    <span>{item.timingIcon}</span>
                  </div>
                </div>
              </div>

              {/* Check Circle */}
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition ${
                  isDone
                    ? 'bg-[#D8B477] border-[#D8B477] text-[#07111F] shadow-sm shadow-[#D8B477]/30'
                    : 'border-white/20 text-transparent hover:border-white/40'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
