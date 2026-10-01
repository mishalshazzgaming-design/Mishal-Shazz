import React, { useState } from 'react';
import { LEARNING_ITEMS, LearnArticle } from '../data/learningData';
import { GraduationCap, BookOpen, Quote, ShieldCheck, Heart } from 'lucide-react';

export const LearnSection: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredItems = filterCategory === 'all'
    ? LEARNING_ITEMS
    : LEARNING_ITEMS.filter(item => item.category === filterCategory);

  const badgeColor = (badge: LearnArticle['typeBadge']) => {
    switch (badge) {
      case 'Quran':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Hadith':
        return 'bg-[#8DB7D9]/15 text-[#8DB7D9] border-[#8DB7D9]/30';
      case 'Fiqh':
        return 'bg-[#D8B477]/15 text-[#D8B477] border-[#D8B477]/30';
      case 'Seerah':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-white/12 space-y-6 shadow-xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#8DB7D9] font-medium flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#8DB7D9]" />
            <span>Sacred Knowledge</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-[#F5F3EE] mt-0.5">
            Learn & Reflect
          </h2>
          <p className="text-xs text-[#B8C1CC]/70">
            Verified Quran, authentic Sunnah citations, and foundational Islamic manners
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs self-start sm:self-center">
          {['all', 'quran', 'hadith', 'fiqh', 'manners'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize transition ${
                filterCategory === cat
                  ? 'bg-[#8DB7D9] text-[#07111F] font-semibold'
                  : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Cards */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-xl bg-white/4 hover:bg-white/6 border border-white/8 transition space-y-3"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${badgeColor(item.typeBadge)}`}>
                {item.typeBadge}
              </span>
              <span className="text-[11px] text-[#B8C1CC]/60 italic font-mono">
                {item.reference}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif-elegant font-bold text-base text-[#F5F3EE]">
              {item.title}
            </h3>

            {/* Arabic text if present */}
            {item.arabic && (
              <p className="font-arabic text-lg sm:text-xl text-right text-[#D8B477] leading-loose pt-1">
                {item.arabic}
              </p>
            )}

            {/* English translation */}
            <p className="text-xs sm:text-sm text-[#F5F3EE]/90 leading-relaxed italic border-l-2 border-[#8DB7D9]/40 pl-3">
              {item.english}
            </p>

            {/* Commentary / Practical Wisdom */}
            <div className="pt-2 border-t border-white/6 text-xs text-[#B8C1CC] leading-relaxed">
              <span className="text-[#8DB7D9] font-medium mr-1">Reflection:</span>
              {item.commentary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
