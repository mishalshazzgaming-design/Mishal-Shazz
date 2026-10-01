import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { GOOD_DEED_TEMPLATES } from '../data/deedsData';
import { HeartHandshake, CheckCircle2, Circle, Plus, Gift } from 'lucide-react';

export const GoodDeedsAndSadaqahSection: React.FC = () => {
  const {
    goodDeeds,
    toggleGoodDeed,
    sadaqahLogs,
    recordSadaqah,
    activeUserId,
    currentLocalDateStr,
    pointsConfig,
  } = useIbadah();

  const [activeTab, setActiveTab] = useState<'deeds' | 'sadaqah'>('deeds');
  const [customDeedTitle, setCustomDeedTitle] = useState('');
  const [showAddDeed, setShowAddDeed] = useState(false);

  // Sadaqah form state
  const [sadaqahCategory, setSadaqahCategory] = useState<'water' | 'food' | 'help' | 'money' | 'other'>('water');
  const [sadaqahNote, setSadaqahNote] = useState('');
  const [showAddSadaqah, setShowAddSadaqah] = useState(false);

  const handleAddCustomDeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDeedTitle.trim()) return;
    const deedId = `custom_deed_${Date.now()}`;
    toggleGoodDeed(deedId, customDeedTitle.trim());
    setCustomDeedTitle('');
    setShowAddDeed(false);
  };

  const handleAddSadaqah = (e: React.FormEvent) => {
    e.preventDefault();
    recordSadaqah(sadaqahCategory, sadaqahNote.trim());
    setSadaqahNote('');
    setShowAddSadaqah(false);
  };

  const todayDeeds = goodDeeds.filter(g => g.userId === activeUserId && g.date === currentLocalDateStr);
  const completedDeedIds = new Set(todayDeeds.filter(d => d.completed).map(d => d.deedId));

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-5 border border-white/12 space-y-4 shadow-xl relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#8DB7D9]" />
          <span className="font-serif-elegant font-bold text-sm sm:text-base text-[#F5F3EE]">
            Good Deeds & Sadaqah
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('deeds')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'deeds' ? 'bg-[#8DB7D9] text-[#07111F]' : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
            }`}
          >
            Deeds
          </button>
          <button
            onClick={() => setActiveTab('sadaqah')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'sadaqah' ? 'bg-[#D8B477] text-[#07111F]' : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
            }`}
          >
            Sadaqah
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY GOOD DEEDS */}
      {activeTab === 'deeds' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#B8C1CC]">
            <span>Daily kindness checklist</span>
            <button
              onClick={() => setShowAddDeed(!showAddDeed)}
              className="text-[#8DB7D9] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom</span>
            </button>
          </div>

          {showAddDeed && (
            <form onSubmit={handleAddCustomDeed} className="p-3 rounded-xl bg-[#0B1728] border border-white/12 flex gap-2">
              <input
                type="text"
                required
                value={customDeedTitle}
                onChange={e => setCustomDeedTitle(e.target.value)}
                placeholder="Custom deed..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#8DB7D9] text-[#07111F] text-xs font-semibold"
              >
                Save
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GOOD_DEED_TEMPLATES.map(item => {
              const isDone = completedDeedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleGoodDeed(item.id, item.title)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                    isDone
                      ? 'bg-[#8DB7D9]/15 border-[#8DB7D9]/40 text-[#F5F3EE]'
                      : 'bg-white/4 hover:bg-white/6 border-white/6 text-[#B8C1CC]'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span>{item.symbol}</span>
                    <span className="text-xs font-medium truncate">{item.title}</span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#8DB7D9] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-white/20 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SADAQAH */}
      {activeTab === 'sadaqah' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#B8C1CC]">
            <span>Acts of charity</span>
            <button
              onClick={() => setShowAddSadaqah(!showAddSadaqah)}
              className="px-2.5 py-1 rounded-lg bg-[#D8B477]/20 hover:bg-[#D8B477]/30 text-[#D8B477] border border-[#D8B477]/30 text-xs flex items-center gap-1 transition"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          </div>

          {showAddSadaqah && (
            <form onSubmit={handleAddSadaqah} className="p-3 rounded-xl bg-[#0B1728] border border-white/15 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={sadaqahCategory}
                  onChange={e => setSadaqahCategory(e.target.value as any)}
                  className="w-full bg-[#07111F] text-xs text-[#F5F3EE] border border-white/15 rounded-lg px-2.5 py-1.5 outline-none"
                >
                  <option value="water">💧 Provided Water / Drinks</option>
                  <option value="food">🍞 Shared Food</option>
                  <option value="help">🤝 Physical Help</option>
                  <option value="money">✨ Donated Funds</option>
                  <option value="other">🤍 Other Charity</option>
                </select>
                <input
                  type="text"
                  value={sadaqahNote}
                  onChange={e => setSadaqahNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSadaqah(false)}
                  className="px-2.5 py-1 rounded bg-white/5 text-xs text-[#B8C1CC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded bg-[#D8B477] text-[#07111F] text-xs font-semibold"
                >
                  Save (+{pointsConfig.pointsPerSadaqah})
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {sadaqahLogs.filter(s => s.userId === activeUserId).length === 0 ? (
              <div className="p-4 rounded-xl bg-white/3 border border-white/6 text-center text-xs text-[#B8C1CC]">
                No Sadaqah logged today
              </div>
            ) : (
              sadaqahLogs
                .filter(s => s.userId === activeUserId)
                .map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-white/4 border border-white/8 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>✨</span>
                      <span className="font-semibold text-[#F5F3EE] capitalize">
                        {item.category}
                      </span>
                      {item.note && <span className="text-[#B8C1CC]/70 truncate max-w-[140px]">• {item.note}</span>}
                    </div>
                    <span className="text-[#D8B477] font-semibold">+{item.points}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
