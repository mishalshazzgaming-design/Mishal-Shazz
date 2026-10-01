import React from 'react';
import { useIbadah } from '../context/IbadahContext';
import { Moon, Users, Settings, Bell, Sparkles, MapPin, Clock } from 'lucide-react';

interface HeaderProps {
  onOpenProfileSelector: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfileSelector,
  onOpenSettings,
}) => {
  const {
    activeProfile,
    partnerProfile,
    currentLocalTimeStr,
    ramadanModeEnabled,
    partnerReactions,
  } = useIbadah();

  const latestPartnerReaction = partnerReactions.length > 0 ? partnerReactions[0] : null;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07111F]/80 border-b border-white/10 px-4 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8DB7D9]/20 to-[#D8B477]/20 border border-[#8DB7D9]/30 flex items-center justify-center text-[#8DB7D9]">
            <Moon className="w-4 h-4 fill-[#8DB7D9]/30" />
          </div>
          <div>
            <h1 className="font-serif-elegant tracking-widest text-sm sm:text-base font-semibold text-[#F5F3EE] flex items-center gap-1.5">
              OUR IBADAH
              {ramadanModeEnabled && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D8B477]/20 text-[#D8B477] border border-[#D8B477]/30 font-sans tracking-normal">
                  Ramadan
                </span>
              )}
            </h1>
            <p className="text-[10px] text-[#B8C1CC]/70 tracking-wider">A private space for two</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2">
          {/* Active Profile Switcher Pill */}
          <button
            onClick={onOpenProfileSelector}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/12 text-xs transition active:scale-95 group"
            title="Switch profile between Person 1 and Person 2"
          >
            <div
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20 animate-pulse"
              style={{ backgroundColor: activeProfile.avatarColor }}
            />
            <span className="font-medium text-[#F5F3EE]">{activeProfile.name}</span>
            <span className="hidden sm:inline text-[11px] text-[#8DB7D9]">
              ({activeProfile.city})
            </span>
            <Users className="w-3.5 h-3.5 text-[#B8C1CC] group-hover:text-[#F5F3EE] transition" />
          </button>

          {/* Quick Time & City info */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#B8C1CC]">
            <Clock className="w-3 h-3 text-[#8DB7D9]" />
            <span>{currentLocalTimeStr}</span>
            <span className="text-white/20">|</span>
            <MapPin className="w-3 h-3 text-[#D8B477]" />
            <span>{activeProfile.city}</span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#B8C1CC] hover:text-[#F5F3EE] transition active:scale-95"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gentle Partner Notification banner if latest reaction exists */}
      {latestPartnerReaction && latestPartnerReaction.toUserId === activeProfile.id && (
        <div className="max-w-6xl mx-auto mt-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8DB7D9]/10 to-[#D8B477]/10 border border-[#8DB7D9]/20 text-[11px] text-[#F5F3EE] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-sm">{latestPartnerReaction.emoji}</span>
            <span className="text-[#8DB7D9] font-medium">{partnerProfile.name}:</span>
            <span className="text-[#F5F3EE]/90 truncate">{latestPartnerReaction.message}</span>
          </div>
          <span className="text-[10px] text-[#B8C1CC]/60 shrink-0 ml-2">from partner</span>
        </div>
      )}
    </header>
  );
};
