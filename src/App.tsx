import React, { useState, useEffect } from 'react';
import { IbadahProvider, useIbadah } from './context/IbadahContext';
import { Header } from './components/Header';
import { PointsCircle } from './components/PointsCircle';
import { NextPrayerCard } from './components/NextPrayerCard';
import { FardPrayerSection } from './components/FardPrayerSection';
import { SunnahPrayerSection } from './components/SunnahPrayerSection';
import { QuranSection } from './components/QuranSection';
import { SharedJourneySection } from './components/SharedJourneySection';
import { WeeklyGraph } from './components/WeeklyGraph';
import { CalendarSection } from './components/CalendarSection';
import { PrayerHistorySection } from './components/PrayerHistorySection';
import { DuasAndJournalSection } from './components/DuasAndJournalSection';
import { FastingAndRamadanSection } from './components/FastingAndRamadanSection';
import { GoodDeedsAndSadaqahSection } from './components/GoodDeedsAndSadaqahSection';
import { LearnSection } from './components/LearnSection';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { ProfileSelectorModal } from './components/ProfileSelectorModal';
import { PointsInfoModal } from './components/PointsInfoModal';
import { EditPrayerModal } from './components/EditPrayerModal';
import { SettingsModal } from './components/SettingsModal';
import { PrayerRecord } from './types';
import {
  Compass,
  BookOpen,
  Sparkles,
  Users,
  Calendar,
  History,
  Moon,
  HeartHandshake,
  BookHeart,
  GraduationCap,
  Settings,
  X,
  TrendingUp,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeProfile,
    partnerProfile,
    currentGregorianStr,
    currentHijriStr,
    todayPoints,
    weekPoints,
    monthPoints,
    todayQuranLog,
    goodDeeds,
    sunnahRecords,
    activeUserId,
    currentLocalDateStr,
    getPrayersForDateAndUser,
    securityMessage,
    clearSecurityMessage,
    uiSettings,
  } = useIbadah();

  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(() => {
    return !localStorage.getItem('our_ibadah_visited');
  });
  const [isPointsInfoOpen, setIsPointsInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<PrayerRecord | null>(null);

  useEffect(() => {
    localStorage.setItem('our_ibadah_visited', 'true');
  }, []);

  const prayersToday = getPrayersForDateAndUser(currentLocalDateStr, activeUserId);
  const completedPrayersCount = Object.values(prayersToday).filter(p => p?.status === 'completed').length;
  const completedSunnahCount = sunnahRecords.filter(s => s.userId === activeUserId && s.date === currentLocalDateStr && s.completed).length;
  const completedDeedsCount = goodDeeds.filter(g => g.userId === activeUserId && g.date === currentLocalDateStr && g.completed).length;

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine dynamic background color from UI settings
  const bgClasses: Record<string, string> = {
    navy: 'bg-[#07111F]',
    amoled: 'bg-[#03070E]',
    forest: 'bg-[#061412]',
    plum: 'bg-[#100918]',
  };
  const currentBgClass = bgClasses[uiSettings.bgTone] || 'bg-[#07111F]';

  // Determine font styling
  const headingFontClass = uiSettings.fontStyle === 'sans' ? 'font-sans font-bold' : 'font-serif-elegant font-bold';

  // Determine blur styling
  const blurClass = `blur-${uiSettings.glassBlur}`;

  return (
    <div className={`min-h-screen ${currentBgClass} text-[#F5F3EE] flex flex-col relative ${uiSettings.showPattern ? 'islamic-pattern' : ''} selection:bg-[#8DB7D9]/30 transition-colors duration-500`}>
      {/* Background ambient lighting orbs (configurable in UI settings) */}
      {uiSettings.showAtmosphericGlow && (
        <>
          <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#8DB7D9]/12 via-[#101E32]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[400px] bg-[#D8B477]/6 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Floating Header */}
      <Header
        onOpenProfileSelector={() => setIsProfileModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Security alert toast */}
      {securityMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="p-3 rounded-2xl bg-[#0B1728] border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between shadow-2xl shadow-black/80">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{securityMessage}</span>
            </div>
            <button
              onClick={clearSecurityMessage}
              className="text-white/40 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 flex gap-6 pb-24 sm:pb-8">
        {/* DESKTOP LEFT SIDEBAR NAVIGATION */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 space-y-4">
          <div className={`glass-panel rounded-2xl p-3 border border-white/10 space-y-1 ${blurClass}`}>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8DB7D9] px-3 py-1 block">
              Menu
            </span>

            {[
              { key: 'today' as NavTab, label: 'Today', icon: <Compass className="w-4 h-4" /> },
              { key: 'ibadah' as NavTab, label: 'Prayers', icon: <Clock className="w-4 h-4" /> },
              { key: 'quran' as NavTab, label: 'Quran', icon: <BookOpen className="w-4 h-4" /> },
              { key: 'journey' as NavTab, label: 'Journey', icon: <Users className="w-4 h-4" /> },
              { key: 'calendar' as NavTab, label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
              { key: 'history' as NavTab, label: 'History', icon: <History className="w-4 h-4" /> },
              { key: 'fasting' as NavTab, label: 'Fasting', icon: <Moon className="w-4 h-4" /> },
              { key: 'journal' as NavTab, label: 'Duas & Journal', icon: <BookHeart className="w-4 h-4" /> },
              { key: 'learn' as NavTab, label: 'Knowledge', icon: <GraduationCap className="w-4 h-4" /> },
            ].map(item => {
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => navigateTo(item.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-[#8DB7D9]/20 text-[#F5F3EE] border border-[#8DB7D9]/30 shadow-sm font-semibold'
                      : 'text-[#B8C1CC] hover:text-[#F5F3EE] hover:bg-white/5'
                  }`}
                >
                  <span className={active ? 'text-[#8DB7D9]' : 'text-[#B8C1CC]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Points summary card */}
          <div className="glass-panel-subtle rounded-2xl p-4 border border-white/8 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D8B477]">
              <span>⭐</span>
              <span>Points Summary</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#B8C1CC]">
                <span>Today:</span>
                <span className="text-[#F5F3EE] font-semibold">{todayPoints}</span>
              </div>
              <div className="flex justify-between text-[#B8C1CC]">
                <span>Week:</span>
                <span className="text-[#8DB7D9] font-semibold">{weekPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#B8C1CC]">
                <span>Month:</span>
                <span className="text-[#D8B477] font-semibold">{monthPoints.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 max-w-3xl w-full mx-auto space-y-6">
          {/* GREETING & DATE (Appears on Today tab) */}
          {activeTab === 'today' && (
            <div className="space-y-1 text-center sm:text-left pt-1">
              <div className={`${headingFontClass} text-2xl sm:text-3xl tracking-wide text-[#F5F3EE]`}>
                Assalamu Alaikum, {activeProfile.name}
              </div>
              <div className="text-xs text-[#B8C1CC] flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                <span>{currentGregorianStr}</span>
                <span className="text-white/30">•</span>
                <span className={`text-[#D8B477] font-arabic arabic-${uiSettings.arabicFontSize}`}>{currentHijriStr}</span>
                <span className="text-white/30">•</span>
                <span className="text-[#8DB7D9] flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activeProfile.city}, {activeProfile.country}
                </span>
              </div>
            </div>
          )}

          {/* TAB 1: TODAY (Main Dashboard with section visibility customizable in UI settings) */}
          {activeTab === 'today' && (
            <>
              {/* 1. LARGE PROMINENT TODAY'S POINTS CIRCLE */}
              {uiSettings.showPointsCircle && (
                <PointsCircle onOpenPointsInfo={() => setIsPointsInfoOpen(true)} />
              )}

              {/* 2. NEXT PRAYER CARD */}
              {uiSettings.showNextPrayerCard && <NextPrayerCard />}

              {/* 3. TODAY'S PROGRESS SUMMARY TILES */}
              {uiSettings.showProgressTiles && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/4 border border-white/6 text-center space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-[#B8C1CC]/70 block">
                      🕌 Fard
                    </span>
                    <span className="text-base font-bold text-[#F5F3EE]">
                      {completedPrayersCount} / 5
                    </span>
                    <span className="text-[10px] text-[#8DB7D9] block">Prayers</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/4 border border-white/6 text-center space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-[#B8C1CC]/70 block">
                      ✨ Sunnah
                    </span>
                    <span className="text-base font-bold text-[#D8B477]">
                      {completedSunnahCount} / 4
                    </span>
                    <span className="text-[10px] text-[#D8B477] block">+10 pts each</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/4 border border-white/6 text-center space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-[#B8C1CC]/70 block">
                      📖 Quran
                    </span>
                    <span className="text-base font-bold text-[#8DB7D9]">
                      {todayQuranLog.pagesRead} / {activeProfile.dailyQuranGoal || 10}
                    </span>
                    <span className="text-[10px] text-[#B8C1CC]/70 block">pages</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/4 border border-white/6 text-center space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wide text-[#B8C1CC]/70 block">
                      🤝 Deeds
                    </span>
                    <span className="text-base font-bold text-[#F5F3EE]">
                      {completedDeedsCount}
                    </span>
                    <span className="text-[10px] text-[#8DB7D9] block">completed</span>
                  </div>
                </div>
              )}

              {/* 4. MAIN FARD PRAYERS SECTION (Always available) */}
              <FardPrayerSection onOpenEditModal={prayer => setEditingPrayer(prayer)} />

              {/* 5. SUNNAH PRAYERS (+10 PTS EACH) */}
              {uiSettings.showSunnahOnHome && <SunnahPrayerSection />}

              {/* 6. QUICK QURAN STEPPER */}
              {uiSettings.showQuranOnHome && <QuranSection />}

              {/* 7. SHARED JOURNEY */}
              {uiSettings.showJourneyOnHome && <SharedJourneySection />}

              {/* 8. WEEKLY GRAPH AT DOWN SHOWING TOTAL POINTS */}
              {uiSettings.showWeeklyGraphOnHome && <WeeklyGraph />}
            </>
          )}

          {/* TAB 2: IBADAH / PRAYERS */}
          {activeTab === 'ibadah' && (
            <div className="space-y-6">
              <NextPrayerCard />
              <FardPrayerSection onOpenEditModal={prayer => setEditingPrayer(prayer)} />
              <SunnahPrayerSection />
              <WeeklyGraph />
              <PrayerHistorySection />
            </div>
          )}

          {/* TAB 3: QURAN */}
          {activeTab === 'quran' && <QuranSection />}

          {/* TAB 4: SHARED JOURNEY */}
          {activeTab === 'journey' && <SharedJourneySection />}

          {/* TAB 5: CALENDAR */}
          {activeTab === 'calendar' && (
            <CalendarSection onOpenEditModal={prayer => setEditingPrayer(prayer)} />
          )}

          {/* TAB 6: PRAYER HISTORY */}
          {activeTab === 'history' && <PrayerHistorySection />}

          {/* TAB 7: FASTING & RAMADAN */}
          {activeTab === 'fasting' && <FastingAndRamadanSection />}

          {/* TAB 8: DUAS & JOURNAL */}
          {activeTab === 'journal' && <DuasAndJournalSection />}

          {/* TAB 9: LEARN */}
          {activeTab === 'learn' && <LearnSection />}
        </main>

        {/* DESKTOP RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-4">
          {/* Partner Status Card */}
          <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
                  style={{ backgroundColor: partnerProfile.avatarColor }}
                />
                <span className="font-serif-elegant font-bold text-sm text-[#F5F3EE]">
                  {partnerProfile.name}
                </span>
              </div>
              <span className="text-[10px] text-[#D8B477] bg-[#D8B477]/10 px-2 py-0.5 rounded-full border border-[#D8B477]/20 font-semibold">
                Partner
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#B8C1CC]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D8B477]" />
                <span>{partnerProfile.city}, {partnerProfile.country}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8DB7D9]" />
                <span>Time: {partnerProfile.timezone}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/4 border border-white/6 text-xs text-center space-y-0.5">
              <span className="text-[10px] text-[#B8C1CC]/70 uppercase block">Encouragement</span>
              <p className="text-[#F5F3EE] italic text-[11px]">
                “Keep encouraging each other 🤍”
              </p>
            </div>
          </div>

          {/* Daily Deeds Checklist */}
          <GoodDeedsAndSadaqahSection />
        </aside>
      </div>

      {/* MOBILE MORE MENU DRAWER */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#07111F]/80 backdrop-blur-md flex flex-col justify-end sm:hidden animate-in fade-in duration-200">
          <div className="glass-panel rounded-t-3xl p-5 border-t border-white/15 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-serif-elegant font-bold text-base text-[#F5F3EE]">
                Features
              </span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => navigateTo('calendar')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left"
              >
                <Calendar className="w-4 h-4 text-[#8DB7D9]" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => navigateTo('history')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left"
              >
                <History className="w-4 h-4 text-[#8DB7D9]" />
                <span>Prayer History</span>
              </button>
              <button
                onClick={() => navigateTo('fasting')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left"
              >
                <Moon className="w-4 h-4 text-[#D8B477]" />
                <span>Fasting & Ramadan</span>
              </button>
              <button
                onClick={() => navigateTo('journal')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left"
              >
                <BookHeart className="w-4 h-4 text-[#8DB7D9]" />
                <span>Duas & Journal</span>
              </button>
              <button
                onClick={() => navigateTo('learn')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left"
              >
                <GraduationCap className="w-4 h-4 text-[#D8B477]" />
                <span>Knowledge</span>
              </button>
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-left"
              >
                <Settings className="w-4 h-4 text-[#B8C1CC]" />
                <span>Settings & UI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION */}
      <BottomNavigation
        activeTab={activeTab}
        onSelectTab={navigateTo}
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
        isMoreOpen={isMoreMenuOpen}
      />

      {/* MODALS */}
      <ProfileSelectorModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <PointsInfoModal
        isOpen={isPointsInfoOpen}
        onClose={() => setIsPointsInfoOpen(false)}
      />

      <EditPrayerModal
        prayer={editingPrayer}
        isOpen={!!editingPrayer}
        onClose={() => setEditingPrayer(null)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <IbadahProvider>
      <MainAppContent />
    </IbadahProvider>
  );
}
