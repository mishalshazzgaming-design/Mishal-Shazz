import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Heart, Plus, Trash2, CheckCircle2, Circle, Sparkles, BookHeart, Lock, Save } from 'lucide-react';
import { DuaRecord } from '../types';

export const DuasAndJournalSection: React.FC = () => {
  const {
    myDuas,
    createDua,
    deleteDua,
    toggleDuaMadeToday,
    getReflectionForDate,
    saveReflection,
    activeUserId,
    currentLocalDateStr,
  } = useIbadah();

  const [activeTab, setActiveTab] = useState<'duas' | 'reflection'>('duas');

  // New Dua Form
  const [showAddDua, setShowAddDua] = useState(false);
  const [duaTitle, setDuaTitle] = useState('');
  const [duaCategory, setDuaCategory] = useState<DuaRecord['category']>('personal');

  // Reflection form state
  const existingReflection = getReflectionForDate(currentLocalDateStr, activeUserId);
  const [gratitude1, setGratitude1] = useState(existingReflection?.gratitude[0] || '');
  const [gratitude2, setGratitude2] = useState(existingReflection?.gratitude[1] || '');
  const [gratitude3, setGratitude3] = useState(existingReflection?.gratitude[2] || '');
  const [improvements, setImprovements] = useState(existingReflection?.improvements || '');
  const [duasText, setDuasText] = useState(existingReflection?.duas || '');
  const [learnedText, setLearnedText] = useState(existingReflection?.learnedToday || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleAddDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duaTitle.trim()) return;
    createDua(duaTitle, duaCategory, false);
    setDuaTitle('');
    setShowAddDua(false);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    const gratitude = [gratitude1, gratitude2, gratitude3].filter(g => g.trim().length > 0);
    saveReflection(currentLocalDateStr, gratitude, improvements, duasText, learnedText);
    setSaveStatus('Saved securely in your private journal ✨');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const categoryBadges: Record<string, string> = {
    family: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    health: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    career: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    marriage: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    guidance: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    akhirah: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    personal: 'bg-[#8DB7D9]/20 text-[#8DB7D9] border-[#8DB7D9]/30',
    other: 'bg-white/10 text-white/80 border-white/20',
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative">
      {/* Header and Tab Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#D8B477] font-medium flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#D8B477]" />
            <span>Private Sanctuary</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            Duas & Reflection
          </h2>
          <p className="text-xs text-[#B8C1CC]/70">
            Completely private to you. Neither your partner nor anyone else can view this.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs self-start sm:self-center">
          <button
            onClick={() => setActiveTab('duas')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeTab === 'duas'
                ? 'bg-[#8DB7D9] text-[#07111F]'
                : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
            }`}
          >
            My Duas 🤲
          </button>
          <button
            onClick={() => setActiveTab('reflection')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeTab === 'reflection'
                ? 'bg-[#8DB7D9] text-[#07111F]'
                : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
            }`}
          >
            My Reflection 📖
          </button>
        </div>
      </div>

      {/* TAB 1: MY DUAS */}
      {activeTab === 'duas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B8C1CC]/70">
              Personal prayers to make after Salah, in Tahajjud, or throughout the day.
            </span>
            <button
              onClick={() => setShowAddDua(!showAddDua)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/12 text-xs text-[#8DB7D9] flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Personal Dua</span>
            </button>
          </div>

          {/* Add Dua Form */}
          {showAddDua && (
            <form onSubmit={handleAddDua} className="p-4 rounded-xl bg-[#0B1728] border border-white/12 space-y-3">
              <div className="text-xs font-semibold text-[#8DB7D9]">New Personal Dua</div>
              <textarea
                required
                rows={2}
                value={duaTitle}
                onChange={e => setDuaTitle(e.target.value)}
                placeholder="Write your heartfelt dua here..."
                className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-[#B8C1CC]">Category:</label>
                  <select
                    value={duaCategory}
                    onChange={e => setDuaCategory(e.target.value as DuaRecord['category'])}
                    className="bg-[#07111F] text-xs text-[#F5F3EE] border border-white/15 rounded px-2 py-1 outline-none"
                  >
                    <option value="personal">Personal</option>
                    <option value="family">Family</option>
                    <option value="health">Health</option>
                    <option value="marriage">Marriage</option>
                    <option value="career">Career</option>
                    <option value="guidance">Guidance</option>
                    <option value="akhirah">Akhirah</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDua(false)}
                    className="px-3 py-1 rounded bg-white/5 text-xs text-[#B8C1CC]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded bg-[#8DB7D9] text-[#07111F] text-xs font-semibold"
                  >
                    Save Dua
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* List of My Duas */}
          <div className="space-y-2.5">
            {myDuas.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/3 border border-white/6 text-center text-xs text-[#B8C1CC]">
                You have not added any personal duas yet. Write down what you wish to ask Allah.
              </div>
            ) : (
              myDuas.map(dua => (
                <div
                  key={dua.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    dua.madeToday
                      ? 'bg-[#8DB7D9]/10 border-[#8DB7D9]/30'
                      : 'bg-white/4 hover:bg-white/6 border-white/8'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleDuaMadeToday(dua.id)}
                      className="mt-0.5 text-xs"
                      title="Mark as made today"
                    >
                      {dua.madeToday ? (
                        <CheckCircle2 className="w-4 h-4 text-[#8DB7D9]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#B8C1CC]/40 hover:text-[#8DB7D9]" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs text-[#F5F3EE] leading-relaxed font-medium">
                        {dua.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border capitalize font-medium ${
                            categoryBadges[dua.category] || categoryBadges.personal
                          }`}
                        >
                          {dua.category}
                        </span>
                        {dua.madeToday && (
                          <span className="text-[10px] text-[#8DB7D9]">Made today ✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteDua(dua.id)}
                    className="text-white/30 hover:text-rose-400 p-1 transition"
                    title="Delete dua"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY REFLECTION */}
      {activeTab === 'reflection' && (
        <form onSubmit={handleSaveReflection} className="space-y-5">
          {/* ALHAMDULILLAH TODAY: 1-3 Gratitude entries */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#D8B477] uppercase tracking-wider block">
              Alhamdulillah Today — 3 Things I am Grateful For
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                value={gratitude1}
                onChange={e => setGratitude1(e.target.value)}
                placeholder="1. e.g. Health to pray on my feet today"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none focus:border-[#D8B477]"
              />
              <input
                type="text"
                value={gratitude2}
                onChange={e => setGratitude2(e.target.value)}
                placeholder="2. e.g. A peaceful moment with Quran"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none focus:border-[#D8B477]"
              />
              <input
                type="text"
                value={gratitude3}
                onChange={e => setGratitude3(e.target.value)}
                placeholder="3. e.g. Ease in our provisions and home"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none focus:border-[#D8B477]"
              />
            </div>
          </div>

          {/* What can I improve? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8DB7D9] uppercase tracking-wider block">
              What can I gently improve tomorrow?
            </label>
            <textarea
              rows={2}
              value={improvements}
              onChange={e => setImprovements(e.target.value)}
              placeholder="e.g. Wake up 15 minutes before Fajr for 2 rak'ahs of Tahajjud..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none focus:border-[#8DB7D9]"
            />
          </div>

          {/* What did I learn today? */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8C1CC] uppercase tracking-wider block">
              What did I learn or reflect upon today?
            </label>
            <textarea
              rows={2}
              value={learnedText}
              onChange={e => setLearnedText(e.target.value)}
              placeholder="e.g. Reflected on Surah Ash-Sharh and how ease accompanies every hardship..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none focus:border-[#8DB7D9]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveStatus ? (
              <span className="text-xs text-[#D8B477] font-medium">{saveStatus}</span>
            ) : (
              <span className="text-[11px] text-[#B8C1CC]/60 italic">
                Saved for {currentLocalDateStr}
              </span>
            )}

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8DB7D9] hover:bg-[#8DB7D9]/90 text-[#07111F] text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-[#8DB7D9]/10"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Reflection</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
