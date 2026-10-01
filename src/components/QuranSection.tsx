import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { BookOpen, Plus, Minus, Bookmark, Sparkles, Flame, CheckCircle, Award } from 'lucide-react';

export const QuranSection: React.FC = () => {
  const {
    todayQuranLog,
    setQuranPagesRead,
    updateQuranBookmark,
    activeProfile,
    updateProfile,
    activeUserId,
    quranLogs,
    pointsConfig,
  } = useIbadah();

  const [inputPages, setInputPages] = useState<number>(todayQuranLog.pagesRead);
  const [showBookmarkEdit, setShowBookmarkEdit] = useState<boolean>(false);
  const [bmSurah, setBmSurah] = useState<string>(todayQuranLog.bookmark?.surah || 'Al-Baqarah');
  const [bmSurahNum, setBmSurahNum] = useState<number>(todayQuranLog.bookmark?.surahNumber || 2);
  const [bmAyah, setBmAyah] = useState<number>(todayQuranLog.bookmark?.ayah || 255);
  const [bmPage, setBmPage] = useState<number>(todayQuranLog.bookmark?.page || 42);

  // Sync inputPages if todayQuranLog updates
  React.useEffect(() => {
    setInputPages(todayQuranLog.pagesRead);
  }, [todayQuranLog.pagesRead]);

  const handleApplyPages = (newVal: number) => {
    const val = Math.max(0, newVal);
    setInputPages(val);
    setQuranPagesRead(val);
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuranBookmark(bmSurah, Number(bmSurahNum), Number(bmAyah), Number(bmPage));
    setShowBookmarkEdit(false);
  };

  // Calculate pages this week and month
  const userLogs = quranLogs.filter(q => q.userId === activeUserId);
  const totalPagesMonth = userLogs.reduce((acc, q) => acc + q.pagesRead, 0);
  const streakDays = userLogs.filter(q => q.pagesRead > 0).length || 1;

  const currentGoal = activeProfile.dailyQuranGoal || 10;
  const progressPercent = Math.min(100, Math.round((todayQuranLog.pagesRead / currentGoal) * 100));
  const pointsEarned = todayQuranLog.pagesRead * pointsConfig.pointsPerQuranPage;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-[#D8B477]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D8B477]">
            <BookOpen className="w-4 h-4 text-[#D8B477]" />
            <span>Daily Quran Reading</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            Recite & Reflect
          </h2>
          <p className="text-xs text-[#B8C1CC]/70">
            Earn {pointsConfig.pointsPerQuranPage} Ibadah Points for each page recited
          </p>
        </div>

        {/* Daily streak indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#F5F3EE] self-start sm:self-center">
          <Flame className="w-4 h-4 text-[#D8B477] fill-[#D8B477]/30" />
          <span>{streakDays} Day Reading Habit</span>
        </div>
      </div>

      {/* Main Interactive Stepper: "HOW MANY PAGES DID YOU READ TODAY?" */}
      <div className="glass-panel-subtle rounded-xl p-5 border border-white/10 text-center space-y-4">
        <div className="text-xs uppercase font-medium tracking-widest text-[#8DB7D9]">
          How Many Pages Did You Read Today?
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleApplyPages(inputPages - 1)}
            disabled={inputPages <= 0}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/15 flex items-center justify-center text-[#F5F3EE] transition active:scale-95 text-lg"
            aria-label="Decrease pages"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-serif-elegant font-bold text-[#F5F3EE]">
              {inputPages}
            </span>
            <span className="text-xs uppercase tracking-wider text-[#B8C1CC] mt-0.5">Pages</span>
          </div>

          <button
            onClick={() => handleApplyPages(inputPages + 1)}
            className="w-12 h-12 rounded-full bg-[#8DB7D9]/20 hover:bg-[#8DB7D9]/30 border border-[#8DB7D9]/40 flex items-center justify-center text-[#8DB7D9] hover:text-[#F5F3EE] transition active:scale-95 text-lg shadow-sm"
            aria-label="Increase pages"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic points reward badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D8B477]/15 border border-[#D8B477]/30 text-xs font-semibold text-[#D8B477]">
          <span>⭐</span>
          <span>+{pointsEarned} Ibadah Points</span>
        </div>

        {/* Quick Increment Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => handleApplyPages(inputPages + 1)}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#B8C1CC] transition active:scale-95"
          >
            +1 Page
          </button>
          <button
            onClick={() => handleApplyPages(inputPages + 5)}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#B8C1CC] transition active:scale-95"
          >
            +5 Pages
          </button>
          <button
            onClick={() => handleApplyPages(inputPages + 10)}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#B8C1CC] transition active:scale-95"
          >
            +10 Pages
          </button>
          <button
            onClick={() => handleApplyPages(inputPages + 20)}
            className="px-3 py-1 rounded-lg bg-[#8DB7D9]/15 hover:bg-[#8DB7D9]/25 border border-[#8DB7D9]/30 text-xs text-[#8DB7D9] transition active:scale-95"
          >
            +1 Juz (20p)
          </button>
        </div>
      </div>

      {/* Progress & Goals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Today's Goal Progress */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 space-y-1.5">
          <div className="text-[11px] text-[#B8C1CC]/70 uppercase tracking-wide">Daily Goal</div>
          <div className="text-base font-bold text-[#F5F3EE]">
            {todayQuranLog.pagesRead} / {currentGoal} pages
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8DB7D9] to-[#D8B477] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Current Juz */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 space-y-1">
          <div className="text-[11px] text-[#B8C1CC]/70 uppercase tracking-wide">Current Juz</div>
          <div className="text-base font-bold text-[#D8B477] font-serif-elegant">
            Juz {todayQuranLog.currentJuz || 1}
          </div>
          <div className="text-[10px] text-[#B8C1CC]/60">of 30 Juz total</div>
        </div>

        {/* Monthly pages */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 space-y-1">
          <div className="text-[11px] text-[#B8C1CC]/70 uppercase tracking-wide">This Month</div>
          <div className="text-base font-bold text-[#8DB7D9]">
            {totalPagesMonth} pages
          </div>
          <div className="text-[10px] text-[#B8C1CC]/60">approx {Math.round(totalPagesMonth / 20)} Juz completed</div>
        </div>

        {/* Target Selector */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 space-y-1">
          <div className="text-[11px] text-[#B8C1CC]/70 uppercase tracking-wide">Change Goal</div>
          <select
            value={currentGoal}
            onChange={(e) => updateProfile(activeUserId, { dailyQuranGoal: Number(e.target.value) })}
            className="w-full bg-[#0B1728] border border-white/15 rounded-lg px-2 py-1 text-xs text-[#F5F3EE] outline-none"
          >
            <option value={5}>5 pages / day</option>
            <option value={10}>10 pages / day</option>
            <option value={20}>20 pages (1 Juz)</option>
            <option value={30}>30 pages / day</option>
          </select>
        </div>
      </div>

      {/* Bookmark Tracker Section */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-white/5 to-white/3 border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D8B477]/15 border border-[#D8B477]/30 flex items-center justify-center text-[#D8B477]">
            <Bookmark className="w-5 h-5 fill-[#D8B477]/30" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#B8C1CC]/70">Quran Bookmark</div>
            <div className="text-sm font-semibold text-[#F5F3EE]">
              {todayQuranLog.bookmark
                ? `${todayQuranLog.bookmark.surah} (Surah ${todayQuranLog.bookmark.surahNumber}, Ayah ${todayQuranLog.bookmark.ayah}) • Page ${todayQuranLog.bookmark.page}`
                : 'Surah Al-Baqarah • Ayah 255 • Page 42'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowBookmarkEdit(!showBookmarkEdit)}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/12 text-xs text-[#8DB7D9] transition active:scale-95 self-start sm:self-center"
        >
          {showBookmarkEdit ? 'Close' : 'Update Bookmark'}
        </button>
      </div>

      {/* Edit Bookmark Form Drawer */}
      {showBookmarkEdit && (
        <form onSubmit={handleSaveBookmark} className="p-4 rounded-xl bg-[#0B1728] border border-white/15 space-y-3">
          <div className="text-xs font-semibold text-[#D8B477]">Update Bookmark Location</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-[#B8C1CC]">Surah Name</label>
              <input
                type="text"
                value={bmSurah}
                onChange={e => setBmSurah(e.target.value)}
                className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-[#F5F3EE]"
                placeholder="e.g. Al-Kahf"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#B8C1CC]">Surah #</label>
              <input
                type="number"
                value={bmSurahNum}
                onChange={e => setBmSurahNum(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-[#F5F3EE]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#B8C1CC]">Ayah #</label>
              <input
                type="number"
                value={bmAyah}
                onChange={e => setBmAyah(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-[#F5F3EE]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#B8C1CC]">Page #</label>
              <input
                type="number"
                value={bmPage}
                onChange={e => setBmPage(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-[#F5F3EE]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-[#8DB7D9] text-[#07111F] text-xs font-semibold hover:bg-[#8DB7D9]/90 transition"
          >
            Save Bookmark
          </button>
        </form>
      )}

      {/* Inspirational Ayah of the day */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#07111F] to-[#0B1728] border border-white/6 text-center space-y-1.5">
        <p className="font-arabic text-base sm:text-lg text-[#F5F3EE]/95 leading-loose">
          وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا
        </p>
        <p className="text-xs text-[#B8C1CC] italic">
          “And recite the Quran with measured recitation.” (Surah Al-Muzzammil 73:4)
        </p>
      </div>
    </div>
  );
};
