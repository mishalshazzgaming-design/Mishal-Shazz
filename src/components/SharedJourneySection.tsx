import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Users, Heart, Sparkles, Send, MessageCircle, Clock, MapPin, CheckCircle2, Lock } from 'lucide-react';
import { PrayerName } from '../types';

export const SharedJourneySection: React.FC = () => {
  const {
    activeProfile,
    partnerProfile,
    todayBreakdown,
    partnerTodayBreakdown,
    todayQuranLog,
    quranLogs,
    currentLocalDateStr,
    getPrayersForDateAndUser,
    sharedDuas,
    createDua,
    sendPartnerReaction,
    partnerReactions,
    assertCanModify,
  } = useIbadah();

  const [reactionMsg, setReactionMsg] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🤍');
  const [newSharedDuaText, setNewSharedDuaText] = useState('');
  const [showSharedDuaInput, setShowSharedDuaInput] = useState(false);
  const [viewOnlyNotice, setViewOnlyNotice] = useState<string | null>(null);

  // Person 1 and Person 2 prayers
  const activePrayers = getPrayersForDateAndUser(currentLocalDateStr, activeProfile.id);
  const partnerPrayers = getPrayersForDateAndUser(currentLocalDateStr, partnerProfile.id);

  const prayersList: { key: PrayerName; label: string }[] = [
    { key: 'fajr', label: 'Fajr' },
    { key: 'dhuhr', label: 'Dhuhr' },
    { key: 'asr', label: 'Asr' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isha' },
  ];

  const activeCompletedPrayers = prayersList.filter(p => activePrayers[p.key]?.status === 'completed').length;
  const partnerCompletedPrayers = prayersList.filter(p => partnerPrayers[p.key]?.status === 'completed').length;

  const partnerQuranLog = quranLogs.find(
    q => q.userId === partnerProfile.id && q.date === currentLocalDateStr
  ) || { pagesRead: 6, pointsEarned: 300 };

  const handleSendReaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reactionMsg.trim()) return;
    sendPartnerReaction(reactionMsg, selectedEmoji);
    setReactionMsg('');
  };

  const handleAddSharedDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSharedDuaText.trim()) return;
    createDua(newSharedDuaText, 'guidance', true);
    setNewSharedDuaText('');
    setShowSharedDuaInput(false);
  };

  const handleAttemptEditPartner = () => {
    setViewOnlyNotice(`View only — ${partnerProfile.name} owns their own private records.`);
    setTimeout(() => setViewOnlyNotice(null), 3500);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-br from-[#8DB7D9]/10 to-[#D8B477]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#D8B477] font-medium flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#D8B477]" />
            <span>Shared Journey</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            Two Locations. One Path.
          </h2>
          <p className="text-xs text-[#B8C1CC]/70">
            Encouraging each other with love, humility, and prayers.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#D8B477] flex items-center gap-1.5 self-start sm:self-center">
          <Heart className="w-3.5 h-3.5 fill-[#D8B477]/20" />
          <span>Keep encouraging each other 🤍</span>
        </div>
      </div>

      {/* View-only permission alert toast if Person 1 attempts to tap Person 2's prayer ticks */}
      {viewOnlyNotice && (
        <div className="p-3 rounded-xl bg-[#0B1728] border border-[#D8B477]/40 text-xs text-[#D8B477] flex items-center gap-2 animate-bounce">
          <Lock className="w-4 h-4 shrink-0" />
          <span>{viewOnlyNotice}</span>
        </div>
      )}

      {/* Side-by-Side Comparison Cards (NON-COMPETITIVE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Person's Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-[#8DB7D9]/30 relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeProfile.avatarColor }}
              />
              <span className="font-serif-elegant font-bold text-base text-[#F5F3EE]">
                {activeProfile.name} (You)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#B8C1CC]/80">
              <MapPin className="w-3 h-3 text-[#8DB7D9]" />
              <span>{activeProfile.city}, {activeProfile.country}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-center">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Prayers</span>
              <span className="text-base font-bold text-[#F5F3EE]">
                {activeCompletedPrayers} / 5
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-center">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Quran</span>
              <span className="text-base font-bold text-[#8DB7D9]">
                {todayQuranLog.pagesRead} pages
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-center">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Points</span>
              <span className="text-base font-bold text-[#D8B477]">
                ⭐ {todayBreakdown.grandTotal}
              </span>
            </div>
          </div>

          {/* Prayer Status row */}
          <div>
            <div className="text-[11px] text-[#B8C1CC]/70 mb-1.5">Fard Prayers:</div>
            <div className="grid grid-cols-5 gap-1.5">
              {prayersList.map(p => {
                const isDone = activePrayers[p.key]?.status === 'completed';
                return (
                  <div
                    key={p.key}
                    className={`py-1.5 px-1 rounded-lg text-center text-[11px] border transition ${
                      isDone
                        ? 'bg-[#8DB7D9]/20 border-[#8DB7D9]/40 text-[#8DB7D9] font-medium'
                        : 'bg-white/4 border-white/6 text-white/40'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="block text-[10px]">{isDone ? '✓' : '○'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Partner's Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-[#D8B477]/30 relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: partnerProfile.avatarColor }}
              />
              <span className="font-serif-elegant font-bold text-base text-[#F5F3EE]">
                {partnerProfile.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#B8C1CC]/80">
              <MapPin className="w-3 h-3 text-[#D8B477]" />
              <span>{partnerProfile.city}, {partnerProfile.country}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-center">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Prayers</span>
              <span className="text-base font-bold text-[#F5F3EE]">
                {partnerCompletedPrayers} / 5
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-center">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Quran</span>
              <span className="text-base font-bold text-[#8DB7D9]">
                {partnerQuranLog.pagesRead} pages
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-center">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Points</span>
              <span className="text-base font-bold text-[#D8B477]">
                ⭐ {partnerTodayBreakdown.grandTotal || 340}
              </span>
            </div>
          </div>

          {/* Partner Prayer Status row with permission lock */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#B8C1CC]/70 mb-1.5">
              <span>Fard Prayers:</span>
              <span className="text-[10px] text-[#D8B477] flex items-center gap-1">
                <Lock className="w-3 h-3" /> Private to {partnerProfile.name}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {prayersList.map(p => {
                const isDone = partnerPrayers[p.key]?.status === 'completed';
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={handleAttemptEditPartner}
                    className={`py-1.5 px-1 rounded-lg text-center text-[11px] border transition cursor-default ${
                      isDone
                        ? 'bg-[#D8B477]/15 border-[#D8B477]/30 text-[#D8B477] font-medium'
                        : 'bg-white/4 border-white/6 text-white/40'
                    }`}
                    title="Protected record"
                  >
                    <span>{p.label}</span>
                    <span className="block text-[10px]">{isDone ? '✓' : '○'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Encouragement / Send Warm Reaction */}
      <div className="p-4 rounded-xl bg-white/4 border border-white/8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8DB7D9]">
            <MessageCircle className="w-4 h-4" />
            <span>Send a Word of Encouragement to {partnerProfile.name}</span>
          </div>
          <div className="flex items-center gap-1">
            {['🤍', '🤲', '✨', '🌙', '🌱'].map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-7 h-7 rounded-full text-sm flex items-center justify-center transition ${
                  selectedEmoji === emoji ? 'bg-white/15 scale-110' : 'hover:bg-white/5 opacity-70'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSendReaction} className="flex gap-2">
          <input
            type="text"
            value={reactionMsg}
            onChange={e => setReactionMsg(e.target.value)}
            placeholder={`e.g. May Allah grant you ease with Fajr today! ${selectedEmoji}`}
            className="flex-1 px-3 py-2 rounded-xl bg-[#0B1728] border border-white/12 text-xs text-[#F5F3EE] outline-none focus:border-[#8DB7D9]"
          />
          <button
            type="submit"
            disabled={!reactionMsg.trim()}
            className="px-4 py-2 rounded-xl bg-[#8DB7D9] hover:bg-[#8DB7D9]/90 disabled:opacity-40 text-[#07111F] text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

        {/* Quick chip suggestions */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            'Duas for you today 🤲',
            'Barakallahu feek ✨',
            'May Allah accept your prayers 🤍',
            'So proud of your consistency 🌱',
          ].map(quick => (
            <button
              key={quick}
              type="button"
              onClick={() => setReactionMsg(quick)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#B8C1CC] hover:text-[#F5F3EE] transition"
            >
              {quick}
            </button>
          ))}
        </div>
      </div>

      {/* Shared Duas Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold font-serif-elegant text-[#F5F3EE] flex items-center gap-1.5">
              <span>Our Shared Duas</span>
              <span className="text-xs font-normal text-[#D8B477]">🤲</span>
            </h3>
            <p className="text-[11px] text-[#B8C1CC]/70">
              Duas both of you make for your life, families, and hereafter
            </p>
          </div>

          <button
            onClick={() => setShowSharedDuaInput(!showSharedDuaInput)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/12 text-xs text-[#8DB7D9] transition active:scale-95"
          >
            {showSharedDuaInput ? 'Cancel' : '+ Add Shared Dua'}
          </button>
        </div>

        {/* Shared Dua input */}
        {showSharedDuaInput && (
          <form onSubmit={handleAddSharedDua} className="p-3.5 rounded-xl bg-[#0B1728] border border-white/15 space-y-2">
            <textarea
              required
              rows={2}
              value={newSharedDuaText}
              onChange={e => setNewSharedDuaText(e.target.value)}
              placeholder="e.g. May Allah bless our home with barakah, grant us righteous progeny, and ease our burdens..."
              className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5F3EE] outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#D8B477] text-[#07111F] text-xs font-semibold hover:bg-[#D8B477]/90 transition"
              >
                Add to Shared Duas
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {sharedDuas.map(dua => (
            <div
              key={dua.id}
              className="p-3 rounded-xl bg-white/4 border border-white/8 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-xs text-[#F5F3EE] leading-relaxed">
                  “{dua.title}”
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#B8C1CC]/60">
                  <span>Added by {dua.authorName || 'Partner'}</span>
                  <span>•</span>
                  <span>Shared</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-xs text-[#D8B477]">
                <span>🤲</span>
                <span className="text-[11px]">Ameen</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
