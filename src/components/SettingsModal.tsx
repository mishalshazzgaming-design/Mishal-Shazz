import React, { useState } from 'react';
import {
  X,
  Settings,
  Palette,
  MapPin,
  Clock,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  Type,
  Sun,
  Moon,
} from 'lucide-react';
import { useIbadah } from '../context/IbadahContext';
import { UISettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    activeProfile,
    updateProfile,
    activeUserId,
    pointsConfig,
    updatePointsConfig,
    setActiveUserId,
    uiSettings,
    updateUISettings,
    resetUISettings,
  } = useIbadah();

  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'ui'>('ui');

  // Profile state
  const [name, setName] = useState(activeProfile.name);
  const [country, setCountry] = useState(activeProfile.country);
  const [city, setCity] = useState(activeProfile.city);
  const [timezone, setTimezone] = useState(activeProfile.timezone);
  const [calcMethod, setCalcMethod] = useState(activeProfile.calculationMethod);
  const [madhab, setMadhab] = useState<'shafi' | 'hanafi'>(activeProfile.madhab);
  const [quranGoal, setQuranGoal] = useState(activeProfile.dailyQuranGoal || 10);
  const [pointsGoal, setPointsGoal] = useState(activeProfile.pointsGoal || 800);
  const [quranPointsPerPage, setQuranPointsPerPage] = useState(pointsConfig.pointsPerQuranPage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick preset locations
  const applyPresetKuwait = () => {
    setCountry('Kuwait');
    setCity('Kuwait City');
    setTimezone('Asia/Kuwait');
    setCalcMethod('Kuwait');
  };

  const applyPresetUzbekistan = () => {
    setCountry('Uzbekistan');
    setCity('Tashkent');
    setTimezone('Asia/Tashkent');
    setCalcMethod('MuslimWorldLeague');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(activeUserId, {
      name,
      country,
      city,
      timezone,
      calculationMethod: calcMethod,
      madhab,
      dailyQuranGoal: Number(quranGoal),
      pointsGoal: Number(pointsGoal),
    });

    updatePointsConfig({
      pointsPerQuranPage: Number(quranPointsPerPage),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all app data to default sample state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-5 sm:p-6 border border-white/15 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-[#F5F3EE] p-1.5 rounded-full hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#F5F3EE]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-elegant font-bold text-lg text-[#F5F3EE]">
              Settings & Customization
            </h3>
            <p className="text-xs text-[#B8C1CC]/70">{activeProfile.name} • {activeProfile.city}</p>
          </div>
        </div>

        {/* Settings Tabs: General Profile vs UI Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('ui')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'ui'
                ? 'bg-[#8DB7D9] text-[#07111F] font-semibold shadow-sm'
                : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>UI & Appearance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition ${
              activeTab === 'profile'
                ? 'bg-[#8DB7D9] text-[#07111F] font-semibold shadow-sm'
                : 'text-[#B8C1CC] hover:text-[#F5F3EE]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Profile & Location</span>
          </button>
        </div>

        {/* TAB 1: UI & APPEARANCE CUSTOMIZATION */}
        {activeTab === 'ui' && (
          <div className="space-y-4 text-xs">
            {/* 1. Accent Color Palette */}
            <div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-2.5">
              <span className="font-semibold text-[#8DB7D9] uppercase tracking-wider block text-[11px]">
                🎨 Accent Color Theme
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'blue', name: 'Moonlit Blue', hex: '#8DB7D9', preview: 'bg-[#8DB7D9]' },
                  { id: 'gold', name: 'Warm Gold', hex: '#D8B477', preview: 'bg-[#D8B477]' },
                  { id: 'emerald', name: 'Serene Emerald', hex: '#5FB396', preview: 'bg-[#5FB396]' },
                  { id: 'sapphire', name: 'Royal Sapphire', hex: '#6B8AFD', preview: 'bg-[#6B8AFD]' },
                  { id: 'rose', name: 'Rose Dawn', hex: '#D988A5', preview: 'bg-[#D988A5]' },
                ].map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => updateUISettings({ accentColor: acc.id as any })}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                      uiSettings.accentColor === acc.id
                        ? 'border-white/50 bg-white/10 shadow-sm'
                        : 'border-white/5 bg-white/3 hover:bg-white/6'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full ${acc.preview} ring-2 ring-white/20`} />
                    <span className="text-[10px] text-center text-[#F5F3EE] font-medium leading-tight">
                      {acc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Midnight Dark Tone Background */}
            <div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-2.5">
              <span className="font-semibold text-[#D8B477] uppercase tracking-wider block text-[11px]">
                🌌 Dark Tone Ambience
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'navy', label: 'Cosmic Navy', desc: '#07111F', bg: 'bg-[#07111F]' },
                  { id: 'amoled', label: 'Obsidian AMOLED', desc: '#03070E', bg: 'bg-[#03070E]' },
                  { id: 'forest', label: 'Forest Slate', desc: '#061412', bg: 'bg-[#061412]' },
                  { id: 'plum', label: 'Deep Amethyst', desc: '#100918', bg: 'bg-[#100918]' },
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => updateUISettings({ bgTone: b.id as any })}
                    className={`p-2 rounded-xl border text-center transition ${
                      uiSettings.bgTone === b.id
                        ? 'border-[#D8B477] bg-white/10'
                        : 'border-white/10 bg-white/3 hover:bg-white/6'
                    }`}
                  >
                    <div className={`w-full h-5 rounded-lg mb-1 ${b.bg} border border-white/10`} />
                    <span className="text-[11px] font-semibold text-[#F5F3EE] block">{b.label}</span>
                    <span className="text-[9px] text-[#B8C1CC]/60 font-mono">{b.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Visual Glass & Atmosphere Effects */}
            <div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-3">
              <span className="font-semibold text-[#8DB7D9] uppercase tracking-wider block text-[11px]">
                ✨ Atmosphere & Glass Effects
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
                  <span className="text-[11px] text-[#F5F3EE]">Ambient Glowing Orbs</span>
                  <button
                    type="button"
                    onClick={() => updateUISettings({ showAtmosphericGlow: !uiSettings.showAtmosphericGlow })}
                    className={`w-10 h-5 rounded-full transition-colors relative border ${
                      uiSettings.showAtmosphericGlow ? 'bg-[#8DB7D9] border-[#8DB7D9]' : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-[#07111F] transition-transform ${
                        uiSettings.showAtmosphericGlow ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
                  <span className="text-[11px] text-[#F5F3EE]">Geometric Pattern</span>
                  <button
                    type="button"
                    onClick={() => updateUISettings({ showPattern: !uiSettings.showPattern })}
                    className={`w-10 h-5 rounded-full transition-colors relative border ${
                      uiSettings.showPattern ? 'bg-[#8DB7D9] border-[#8DB7D9]' : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-[#07111F] transition-transform ${
                        uiSettings.showPattern ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
                  <span className="text-[11px] text-[#F5F3EE]">Floating Animations</span>
                  <button
                    type="button"
                    onClick={() => updateUISettings({ floatingParticles: !uiSettings.floatingParticles })}
                    className={`w-10 h-5 rounded-full transition-colors relative border ${
                      uiSettings.floatingParticles ? 'bg-[#8DB7D9] border-[#8DB7D9]' : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-[#07111F] transition-transform ${
                        uiSettings.floatingParticles ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
                  <span className="text-[11px] text-[#F5F3EE]">Glass Blur Frost</span>
                  <select
                    value={uiSettings.glassBlur}
                    onChange={e => updateUISettings({ glassBlur: e.target.value as any })}
                    className="bg-[#07111F] text-[#8DB7D9] text-[11px] border border-white/10 rounded px-1.5 py-0.5 outline-none"
                  >
                    <option value="soft">Soft (10px)</option>
                    <option value="medium">Medium (18px)</option>
                    <option value="deep">Deep Frost (26px)</option>
                    <option value="minimal">Minimal Flat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Time, Calendar & Typography Controls */}
            <div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-3">
              <span className="font-semibold text-[#D8B477] uppercase tracking-wider block text-[11px]">
                ⏰ Time, Date & Typography
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/6">
                  <div>
                    <span className="text-[11px] font-medium text-[#F5F3EE] block">Time Format</span>
                    <span className="text-[9px] text-[#B8C1CC]/60">12-Hour vs 24-Hour</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateUISettings({ timeFormat: '12h' })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                        uiSettings.timeFormat === '12h'
                          ? 'bg-[#8DB7D9] text-[#07111F] border-[#8DB7D9]'
                          : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                      }`}
                    >
                      12h
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUISettings({ timeFormat: '24h' })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                        uiSettings.timeFormat === '24h'
                          ? 'bg-[#8DB7D9] text-[#07111F] border-[#8DB7D9]'
                          : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                      }`}
                    >
                      24h
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/6">
                  <div>
                    <span className="text-[11px] font-medium text-[#F5F3EE] block">Hijri Moon Offset</span>
                    <span className="text-[9px] text-[#B8C1CC]/60">Sight adjustment</span>
                  </div>
                  <select
                    value={uiSettings.hijriDayOffset}
                    onChange={e => updateUISettings({ hijriDayOffset: Number(e.target.value) })}
                    className="bg-[#07111F] text-[#D8B477] text-[11px] border border-white/10 rounded px-2 py-1 outline-none"
                  >
                    <option value={-2}>-2 days</option>
                    <option value={-1}>-1 day</option>
                    <option value={0}>0 (Standard)</option>
                    <option value={1}>+1 day</option>
                    <option value={2}>+2 days</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/6">
                  <div>
                    <span className="text-[11px] font-medium text-[#F5F3EE] block">Arabic Calligraphy Size</span>
                    <span className="text-[9px] text-[#B8C1CC]/60">Script sizing</span>
                  </div>
                  <select
                    value={uiSettings.arabicFontSize}
                    onChange={e => updateUISettings({ arabicFontSize: e.target.value as any })}
                    className="bg-[#07111F] text-[#8DB7D9] text-[11px] border border-white/10 rounded px-2 py-1 outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="huge">Extra Large</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/3 border border-white/6">
                  <div>
                    <span className="text-[11px] font-medium text-[#F5F3EE] block">Font Style</span>
                    <span className="text-[9px] text-[#B8C1CC]/60">Heading aesthetics</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => updateUISettings({ fontStyle: 'serif' })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                        uiSettings.fontStyle === 'serif'
                          ? 'bg-[#D8B477] text-[#07111F] border-[#D8B477]'
                          : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                      }`}
                    >
                      Regal Serif
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUISettings({ fontStyle: 'sans' })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border ${
                        uiSettings.fontStyle === 'sans'
                          ? 'bg-[#D8B477] text-[#07111F] border-[#D8B477]'
                          : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                      }`}
                    >
                      Modern Sans
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Dashboard Home Layout & Component Visibility */}
            <div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-2.5">
              <span className="font-semibold text-[#8DB7D9] uppercase tracking-wider block text-[11px]">
                📱 Home Dashboard Sections (Toggle to customize)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'showPointsCircle', label: '⭐ Points Circle' },
                  { key: 'showNextPrayerCard', label: '⏱️ Next Prayer Card' },
                  { key: 'showProgressTiles', label: '📊 4 Progress Tiles' },
                  { key: 'showSunnahOnHome', label: '✨ Sunnah & Nafl' },
                  { key: 'showQuranOnHome', label: '📖 Quran Section' },
                  { key: 'showJourneyOnHome', label: '👥 Shared Journey' },
                  { key: 'showWeeklyGraphOnHome', label: '📈 7-Day Graph' },
                ].map(item => {
                  const isVisible = (uiSettings as any)[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => updateUISettings({ [item.key]: !isVisible })}
                      className={`p-2 rounded-xl border flex items-center justify-between transition ${
                        isVisible
                          ? 'bg-[#8DB7D9]/15 border-[#8DB7D9]/40 text-[#F5F3EE]'
                          : 'bg-white/3 border-white/6 text-white/40'
                      }`}
                    >
                      <span className="text-[11px] font-medium truncate">{item.label}</span>
                      <span className={`text-[10px] font-bold ${isVisible ? 'text-[#8DB7D9]' : 'text-white/30'}`}>
                        {isVisible ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={resetUISettings}
                className="text-[11px] text-[#B8C1CC] hover:text-[#F5F3EE] flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default UI</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#8DB7D9] hover:bg-[#8DB7D9]/90 text-[#07111F] text-xs font-semibold shadow-md shadow-[#8DB7D9]/10"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & LOCATION */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Active Profile Switch */}
            <div className="p-3 rounded-xl bg-white/4 border border-white/8 space-y-2">
              <span className="text-[11px] font-semibold text-[#8DB7D9] uppercase tracking-wider block">
                Active Person Profile
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveUserId('person_1')}
                  className={`py-2 px-3 rounded-lg border font-medium transition ${
                    activeUserId === 'person_1'
                      ? 'bg-[#8DB7D9]/25 border-[#8DB7D9] text-[#F5F3EE]'
                      : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                  }`}
                >
                  Person 1 (Kuwait)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUserId('person_2')}
                  className={`py-2 px-3 rounded-lg border font-medium transition ${
                    activeUserId === 'person_2'
                      ? 'bg-[#D8B477]/25 border-[#D8B477] text-[#F5F3EE]'
                      : 'bg-white/5 border-white/10 text-[#B8C1CC]'
                  }`}
                >
                  Person 2 (Uzbekistan)
                </button>
              </div>
            </div>

            {/* Location & Timezone */}
            <div className="space-y-3 p-3.5 rounded-xl bg-white/4 border border-white/8">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#D8B477] uppercase tracking-wider">
                  Location & Timezone
                </span>
                <div className="flex gap-1.5 text-[10px]">
                  <button
                    type="button"
                    onClick={applyPresetKuwait}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#8DB7D9] border border-white/10"
                  >
                    Kuwait
                  </button>
                  <button
                    type="button"
                    onClick={applyPresetUzbekistan}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#D8B477] border border-white/10"
                  >
                    Uzbekistan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">IANA Time Zone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    placeholder="e.g. Asia/Kuwait"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">Calculation Method</label>
                  <select
                    value={calcMethod}
                    onChange={e => setCalcMethod(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  >
                    <option value="Kuwait">Kuwait</option>
                    <option value="MuslimWorldLeague">Muslim World League</option>
                    <option value="UmmAlQura">Umm Al-Qura (Makkah)</option>
                    <option value="Egyptian">Egyptian General Authority</option>
                    <option value="Karachi">University of Islamic Sciences, Karachi</option>
                    <option value="NorthAmerica">ISNA (North America)</option>
                    <option value="Dubai">Dubai / UAE</option>
                    <option value="Qatar">Qatar</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">Asr Madhab</label>
                  <select
                    value={madhab}
                    onChange={e => setMadhab(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  >
                    <option value="shafi">Shafi'i / Standard (1x Shadow)</option>
                    <option value="hanafi">Hanafi (2x Shadow)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Points Rules */}
            <div className="space-y-3 p-3.5 rounded-xl bg-white/4 border border-white/8">
              <span className="text-[11px] font-semibold text-[#8DB7D9] uppercase tracking-wider block">
                Points Engine Configuration
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">Points per Quran Page</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={quranPointsPerPage}
                    onChange={e => setQuranPointsPerPage(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#B8C1CC] block mb-1">Daily Points Ring Goal</label>
                  <input
                    type="number"
                    min={200}
                    max={3000}
                    value={pointsGoal}
                    onChange={e => setPointsGoal(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#07111F] border border-white/12 text-[#F5F3EE] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetData}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#B8C1CC] hover:text-[#F5F3EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8DB7D9] text-[#07111F] font-semibold flex items-center gap-1.5 shadow-md shadow-[#8DB7D9]/10"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
