import React from 'react';
import { X, Sparkles, Star, HeartHandshake, BookOpen, Clock } from 'lucide-react';
import { useIbadah } from '../context/IbadahContext';

interface PointsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PointsInfoModal: React.FC<PointsInfoModalProps> = ({ isOpen, onClose }) => {
  const { pointsConfig } = useIbadah();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-white/15 space-y-4 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-[#F5F3EE] p-1.5 rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#D8B477]/20 border border-[#D8B477]/40 flex items-center justify-center text-[#D8B477]">
            <Star className="w-4 h-4 fill-[#D8B477]/30" />
          </div>
          <div>
            <h3 className="font-serif-elegant font-bold text-base text-[#F5F3EE]">
              Ibadah Points System
            </h3>
            <p className="text-[11px] text-[#B8C1CC]/70">App-created motivation system</p>
          </div>
        </div>

        {/* Theological Disclaimer (Section 8) */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D8B477]/10 to-[#8DB7D9]/10 border border-[#D8B477]/30 text-xs text-[#F5F3EE] leading-relaxed">
          <p className="font-semibold text-[#D8B477]">
            “Ibadah Points are an app-created motivation system. They do not represent or measure the reward of an act of worship in Islam.”
          </p>
        </div>

        {/* Breakdown with clean symbols */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-1">
            <div className="font-semibold text-[#F5F3EE] flex items-center gap-1.5">
              <span>🕌</span>
              <span>Fard Prayers</span>
            </div>
            <p className="text-[11px] text-[#B8C1CC]/80">
              Up to 50 pts (0–30 min: 50, 31–60: 40, 61–90: 30, 91–120: 20)
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-1">
            <div className="font-semibold text-[#F5F3EE] flex items-center gap-1.5">
              <span>✨</span>
              <span>Sunnah & Nafl</span>
            </div>
            <p className="text-[11px] text-[#B8C1CC]/80">
              +10 pts for each completed Sunnah (Tahajjud, Witr, Duha, Rawatib)
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-1">
            <div className="font-semibold text-[#F5F3EE] flex items-center gap-1.5">
              <span>📖</span>
              <span>Quran Pages</span>
            </div>
            <p className="text-[11px] text-[#B8C1CC]/80">
              +{pointsConfig.pointsPerQuranPage} pts per page (10p = 500)
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-1">
            <div className="font-semibold text-[#F5F3EE] flex items-center gap-1.5">
              <span>🤝</span>
              <span>Good Deeds & Charity</span>
            </div>
            <p className="text-[11px] text-[#B8C1CC]/80">
              +{pointsConfig.pointsPerGoodDeed} pts deed • +{pointsConfig.pointsPerSadaqah} pts Sadaqah
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#8DB7D9] text-[#07111F] text-xs font-semibold hover:bg-[#8DB7D9]/90 transition"
        >
          Understood
        </button>
      </div>
    </div>
  );
};
