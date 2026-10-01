import React, { useState } from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Info, Sparkles, TrendingUp } from 'lucide-react';

interface PointsCircleProps {
  onOpenPointsInfo: () => void;
}

export const PointsCircle: React.FC<PointsCircleProps> = ({ onOpenPointsInfo }) => {
  const {
    todayPoints,
    activeProfile,
    todayBreakdown,
    floatingAnimations,
    removeFloatingAnimation,
  } = useIbadah();

  // Ring progress calculation (based on active profile's pointsGoal, e.g. 800)
  const target = activeProfile.pointsGoal || 800;
  const progressRatio = Math.min(1, Math.max(0, todayPoints / target));

  // Circular progress SVG constants
  const size = 200;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth - 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const recentChips = todayBreakdown.recentEvents.slice(0, 4);

  return (
    <div className="relative flex flex-col items-center justify-center pt-2 pb-4">
      {/* Floating Animations Area */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30">
        {floatingAnimations.map(anim => (
          <div
            key={anim.id}
            onAnimationEnd={() => removeFloatingAnimation(anim.id)}
            className="absolute text-base font-semibold text-[#D8B477] bg-[#07111F]/90 px-3 py-1 rounded-full border border-[#D8B477]/40 shadow-lg shadow-[#D8B477]/20 flex items-center gap-1 animate-float-fade"
          >
            <span>⭐</span>
            <span>+{anim.points}</span>
            <span className="text-xs text-[#8DB7D9] font-normal">{anim.label}</span>
          </div>
        ))}
      </div>

      {/* Main Points Circle Card */}
      <div className="relative group">
        {/* Soft Background Radial Glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-b from-[#8DB7D9]/15 to-[#D8B477]/10 blur-2xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none" />

        {/* Outer Circular SVG Ring */}
        <div className="relative w-[210px] h-[210px] sm:w-[220px] sm:h-[220px] flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(141,183,217,0.2)]">
            <defs>
              <linearGradient id="pointsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8DB7D9" />
                <stop offset="70%" stopColor="#8DB7D9" />
                <stop offset="100%" stopColor="#D8B477" />
              </linearGradient>
              <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Track Background */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Dynamic Progress Fill */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="url(#pointsGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
              filter="url(#subtleGlow)"
            />
          </svg>

          {/* Inner Content Disc */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-b from-[#0B1728]/95 to-[#07111F]/95 backdrop-blur-xl border border-white/12 flex flex-col items-center justify-center p-4 text-center shadow-inner">
            {/* Star Icon & Subtitle */}
            <div className="flex items-center gap-1 text-[#D8B477] text-sm mb-0.5">
              <span className="text-base">⭐</span>
              <span className="text-[11px] font-medium tracking-wider text-[#D8B477]/90 uppercase font-sans">
                Ibadah Points
              </span>
            </div>

            {/* Big Main Number */}
            <div className="text-4xl sm:text-5xl font-bold font-serif-elegant tracking-tight text-[#F5F3EE] drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] leading-tight">
              {todayPoints.toLocaleString()}
            </div>

            {/* Label below points */}
            <div className="text-[11px] font-medium uppercase tracking-widest text-[#8DB7D9] mt-0.5">
              Today's Points
            </div>

            {/* Progress goal badge */}
            <div className="mt-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#B8C1CC] flex items-center gap-1">
              <span>Goal: {target}</span>
              <span>•</span>
              <span className="text-[#8DB7D9]">{Math.round(progressRatio * 100)}%</span>
            </div>

            {/* Subtle Info Button */}
            <button
              onClick={onOpenPointsInfo}
              className="absolute bottom-3 text-white/40 hover:text-[#8DB7D9] transition p-1"
              title="What are Ibadah Points?"
              aria-label="Points information"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Underneath: Recent Activity Chips */}
      {recentChips.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 max-w-sm px-2">
          {recentChips.map(chip => (
            <span
              key={chip.id}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#F5F3EE]/90 shadow-sm"
            >
              <span className="text-[#D8B477] font-semibold">+{chip.points}</span>
              <span className="text-[#B8C1CC] capitalize">
                {chip.activityType === 'prayer' ? chip.activityId : chip.activityType.replace('_', ' ')}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Subtle reassurance quote */}
      <p className="text-[11px] text-[#B8C1CC]/60 mt-2 text-center italic tracking-wide">
        “The deeds most beloved to Allah are those that are consistent.”
      </p>
    </div>
  );
};
