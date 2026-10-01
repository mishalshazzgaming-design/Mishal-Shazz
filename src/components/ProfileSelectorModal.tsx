import React from 'react';
import { useIbadah } from '../context/IbadahContext';
import { UserId } from '../types';
import { Moon, Users, MapPin, Clock, ShieldCheck, Check } from 'lucide-react';

interface ProfileSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSelectorModal: React.FC<ProfileSelectorModalProps> = ({ isOpen, onClose }) => {
  const { activeUserId, setActiveUserId, activeProfile, partnerProfile } = useIbadah();

  if (!isOpen) return null;

  const handleSelect = (id: UserId) => {
    setActiveUserId(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7 border border-white/15 space-y-6 shadow-2xl relative text-center">
        {/* Top App Icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-tr from-[#8DB7D9]/20 to-[#D8B477]/20 border border-[#8DB7D9]/30 flex items-center justify-center text-[#8DB7D9]">
          <Moon className="w-6 h-6 fill-[#8DB7D9]/30" />
        </div>

        {/* Title */}
        <div>
          <h2 className="font-serif-elegant text-2xl font-bold tracking-widest text-[#F5F3EE]">
            OUR IBADAH
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#D8B477] mt-1 font-medium">
            A private space for two.
          </p>
          <p className="text-xs text-[#B8C1CC]/70 mt-2">
            Select your profile to enter your personal companion space.
          </p>
        </div>

        {/* Two Profile Selection Cards */}
        <div className="grid grid-cols-1 gap-3 text-left">
          {/* Person 1 Card */}
          <button
            onClick={() => handleSelect('person_1')}
            className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group active:scale-98 ${
              activeUserId === 'person_1'
                ? 'bg-gradient-to-r from-[#8DB7D9]/20 to-white/5 border-[#8DB7D9]/50 shadow-md shadow-[#8DB7D9]/10'
                : 'bg-white/4 hover:bg-white/8 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#8DB7D9]/20 border border-[#8DB7D9]/40 flex items-center justify-center text-[#8DB7D9] font-bold text-sm">
                P1
              </div>
              <div>
                <div className="font-serif-elegant font-bold text-sm text-[#F5F3EE] flex items-center gap-2">
                  <span>Person 1</span>
                  {activeUserId === 'person_1' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8DB7D9] text-[#07111F] font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#B8C1CC] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#8DB7D9]" />
                  <span>Kuwait (Asia/Kuwait)</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#8DB7D9] font-medium group-hover:translate-x-1 transition">
              Enter →
            </div>
          </button>

          {/* Person 2 Card */}
          <button
            onClick={() => handleSelect('person_2')}
            className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between group active:scale-98 ${
              activeUserId === 'person_2'
                ? 'bg-gradient-to-r from-[#D8B477]/20 to-white/5 border-[#D8B477]/50 shadow-md shadow-[#D8B477]/10'
                : 'bg-white/4 hover:bg-white/8 border-white/10'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#D8B477]/20 border border-[#D8B477]/40 flex items-center justify-center text-[#D8B477] font-bold text-sm">
                P2
              </div>
              <div>
                <div className="font-serif-elegant font-bold text-sm text-[#F5F3EE] flex items-center gap-2">
                  <span>Person 2</span>
                  {activeUserId === 'person_2' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D8B477] text-[#07111F] font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#B8C1CC] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#D8B477]" />
                  <span>Uzbekistan (Asia/Tashkent)</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#D8B477] font-medium group-hover:translate-x-1 transition">
              Enter →
            </div>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-white/4 border border-white/6 flex items-start gap-2.5 text-left text-[11px] text-[#B8C1CC]/80">
          <ShieldCheck className="w-4 h-4 text-[#8DB7D9] shrink-0 mt-0.5" />
          <p>
            Data privacy is strictly enforced. Each person owns their own records, private duas, and journal reflections.
          </p>
        </div>
      </div>
    </div>
  );
};
