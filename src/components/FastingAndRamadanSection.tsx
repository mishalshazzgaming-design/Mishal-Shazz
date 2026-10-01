import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Moon, Sun, CheckCircle2, Circle, Flame, Sparkles, Star, Calendar } from 'lucide-react';

export const FastingAndRamadanSection: React.FC = () => {
  const {
    ramadanModeEnabled,
    setRamadanModeEnabled,
    currentSchedule,
    activeProfile,
    activeUserId,
    currentLocalDateStr,
    ramadanRecords,
    updateRamadanDay,
  } = useIbadah();

  const [currentDay, setCurrentDay] = useState<number>(14); // e.g. Day 14 of Ramadan

  const todayRecord = ramadanRecords.find(r => r.day === currentDay && r.userId === activeUserId) || {
    day: currentDay,
    userId: activeUserId,
    fasting: true,
    prayersCount: 5,
    tarawih: true,
    quranJuzRead: 1,
    sadaqahDone: true,
    dhikrDone: true,
    suhoor: true,
    iftar: true,
    laylatulQadrDua: false,
  };

  const suhoorTime = currentSchedule.fajr.scheduledTimeStr;
  const iftarTime = currentSchedule.maghrib.scheduledTimeStr;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative crescent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D8B477]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#D8B477] font-medium flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-[#D8B477]" />
            <span>Fasting & Special Seasons</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            {ramadanModeEnabled ? 'Ramadan Mode 🌙' : 'Fasting Companion'}
          </h2>
          <p className="text-xs text-[#B8C1CC]/70">
            Suhoor ends at Fajr ({suhoorTime}), Iftar begins at Maghrib ({iftarTime})
          </p>
        </div>

        {/* Ramadan Mode Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-[#B8C1CC]">Ramadan Mode</span>
          <button
            onClick={() => setRamadanModeEnabled(!ramadanModeEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative border ${
              ramadanModeEnabled
                ? 'bg-[#D8B477] border-[#D8B477]'
                : 'bg-white/10 border-white/20'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#07111F] transition-transform ${
                ramadanModeEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Suhoor & Iftar Timing Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-white/4 border border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8DB7D9]/15 border border-[#8DB7D9]/30 flex items-center justify-center text-[#8DB7D9]">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#B8C1CC]/70 uppercase tracking-wider block">Suhoor Ends</span>
              <span className="text-lg font-bold font-serif-elegant text-[#F5F3EE]">{suhoorTime}</span>
              <span className="text-[10px] text-[#B8C1CC]/60 block">(Fajr Adhan)</span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#8DB7D9] border border-white/10">
            {activeProfile.city}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white/4 border border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D8B477]/15 border border-[#D8B477]/30 flex items-center justify-center text-[#D8B477]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-[#B8C1CC]/70 uppercase tracking-wider block">Iftar Begins</span>
              <span className="text-lg font-bold font-serif-elegant text-[#D8B477]">{iftarTime}</span>
              <span className="text-[10px] text-[#B8C1CC]/60 block">(Maghrib Adhan)</span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#D8B477] border border-white/10">
            Dua & Dates
          </span>
        </div>
      </div>

      {/* RAMADAN 30-DAY CHECKLIST (If Ramadan Mode Enabled) */}
      {ramadanModeEnabled ? (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#B8C1CC]">Selecting Day:</span>
              <select
                value={currentDay}
                onChange={e => setCurrentDay(Number(e.target.value))}
                className="bg-[#0B1728] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-[#F5F3EE] font-semibold outline-none"
              >
                {Array.from({ length: 30 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Day {i + 1} of 30
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-[#D8B477] font-serif-elegant font-semibold">
              Ramadan Kareem 🌙
            </span>
          </div>

          {/* Checklist for selected day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'fasting', label: 'Fasted Today', note: 'From dawn till sunset' },
              { key: 'tarawih', label: 'Tarawih / Qiyam', note: 'Night prayers in congregation or home' },
              { key: 'suhoor', label: 'Had Suhoor Barakah', note: '“Take Suhoor, for in it is blessing.”' },
              { key: 'iftar', label: 'Made Iftar on Time', note: 'Hasten the breaking of fast' },
              { key: 'sadaqahDone', label: 'Ramadan Charity / Sadaqah', note: 'Giving generously in Ramadan' },
              { key: 'laylatulQadrDua', label: 'Laylat al-Qadr Dua', note: 'Allahumma innaka ‘afuwwun...' },
            ].map(item => {
              const isChecked = !!(todayRecord as any)[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => updateRamadanDay(currentDay, { [item.key]: !isChecked })}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-[#D8B477]/12 border-[#D8B477]/35 text-[#F5F3EE]'
                      : 'bg-white/4 hover:bg-white/6 border-white/6 text-[#B8C1CC]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold text-[#F5F3EE]">{item.label}</div>
                    <div className="text-[10px] text-[#B8C1CC]/70">{item.note}</div>
                  </div>
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#D8B477]" />
                  ) : (
                    <Circle className="w-5 h-5 text-white/20" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Voluntary Fasting Tracker */
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-[#8DB7D9] font-medium">
            Sunnah Voluntary Fasting Opportunities
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-1">
              <span className="text-xs font-semibold text-[#F5F3EE] block">Mondays & Thursdays</span>
              <p className="text-[11px] text-[#B8C1CC]/70">
                Deeds are presented to Allah on these two days. (Jami` at-Tirmidhi)
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-1">
              <span className="text-xs font-semibold text-[#F5F3EE] block">The White Days (Ayyam al-Beed)</span>
              <p className="text-[11px] text-[#B8C1CC]/70">
                13th, 14th, and 15th of each lunar month. Equivalent to fasting a lifetime.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-1">
              <span className="text-xs font-semibold text-[#F5F3EE] block">Qada (Make-up Fasting)</span>
              <p className="text-[11px] text-[#B8C1CC]/70">
                Fulfilling missed obligatory fasts with clear intention before dawn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
