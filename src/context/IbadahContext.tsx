import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserId,
  PersonProfile,
  PrayerName,
  PrayerStatus,
  PrayerRecord,
  PointEvent,
  SunnahRecord,
  QuranLog,
  GoodDeedRecord,
  SadaqahRecord,
  DuaRecord,
  ReflectionRecord,
  PartnerReaction,
  RamadanDayRecord,
  UISettings,
} from '../types';
import {
  calculatePrayerTimes,
  getCurrentTimeInTimezone,
  getDateStringInTimezone,
  formatTimeInTimezone,
  formatGregorianDisplay,
  getHijriDateDisplay,
  DayPrayerSchedule,
} from '../utils/prayerTimes';
import {
  calculatePrayerPoints,
  getDailyPointsBreakdown,
  PointsConfig,
  DEFAULT_POINTS_CONFIG,
} from '../utils/pointsEngine';

export interface FloatingPointAnimation {
  id: string;
  points: number;
  label: string;
}

interface IbadahContextType {
  activeUserId: UserId;
  setActiveUserId: (id: UserId) => void;
  activeProfile: PersonProfile;
  partnerProfile: PersonProfile;
  updateProfile: (userId: UserId, updates: Partial<PersonProfile>) => void;

  // Time & Prayer Schedule
  currentSchedule: DayPrayerSchedule;
  partnerSchedule: DayPrayerSchedule;
  currentLocalTimeStr: string;
  currentLocalDateStr: string; // YYYY-MM-DD
  currentGregorianStr: string;
  currentHijriStr: string;

  // Selected date for viewing/history
  selectedDateStr: string;
  setSelectedDateStr: (date: string) => void;

  // Points & Ledger
  pointsConfig: PointsConfig;
  updatePointsConfig: (newConfig: Partial<PointsConfig>) => void;
  pointEvents: PointEvent[];
  todayBreakdown: ReturnType<typeof getDailyPointsBreakdown>;
  partnerTodayBreakdown: ReturnType<typeof getDailyPointsBreakdown>;
  selectedDayBreakdown: ReturnType<typeof getDailyPointsBreakdown>;
  todayPoints: number;
  weekPoints: number;
  monthPoints: number;
  floatingAnimations: FloatingPointAnimation[];
  removeFloatingAnimation: (id: string) => void;

  // Fard Prayers
  prayers: PrayerRecord[];
  getPrayersForDateAndUser: (date: string, userId: UserId) => Record<PrayerName, PrayerRecord | undefined>;
  recordPrayerCompletion: (prayerName: PrayerName, targetDateStr?: string, customActualTime?: string) => void;
  markPrayerMissed: (prayerName: PrayerName, targetDateStr?: string) => void;
  editPrayerRecord: (
    prayerId: string,
    newStatus: PrayerStatus,
    newActualTime?: string,
    customPoints?: number
  ) => void;

  // Sunnah & Nafl Prayers (+10 pts each)
  sunnahRecords: SunnahRecord[];
  isSunnahCompleted: (sunnahId: string, dateStr?: string) => boolean;
  toggleSunnahPrayer: (sunnahId: string, title: string, dateStr?: string) => void;

  // Quran
  quranLogs: QuranLog[];
  todayQuranLog: QuranLog;
  setQuranPagesRead: (pages: number, dateStr?: string) => void;
  updateQuranBookmark: (surah: string, surahNumber: number, ayah: number, page: number) => void;

  // Good Deeds & Sadaqah
  goodDeeds: GoodDeedRecord[];
  toggleGoodDeed: (deedId: string, title: string, dateStr?: string) => void;
  sadaqahLogs: SadaqahRecord[];
  recordSadaqah: (category: 'money' | 'food' | 'water' | 'help' | 'other', note: string, points?: number) => void;

  // Duas
  duas: DuaRecord[];
  myDuas: DuaRecord[];
  sharedDuas: DuaRecord[];
  toggleDuaMadeToday: (duaId: string) => void;
  createDua: (title: string, category: DuaRecord['category'], isShared: boolean) => void;
  deleteDua: (duaId: string) => void;

  // Reflections
  reflections: ReflectionRecord[];
  getReflectionForDate: (date: string, userId: UserId) => ReflectionRecord | undefined;
  saveReflection: (date: string, gratitude: string[], improvements: string, duas: string, learned: string) => void;

  // Partner Reactions & Encouragements
  partnerReactions: PartnerReaction[];
  sendPartnerReaction: (message: string, emoji: string) => void;

  // Ramadan Mode
  ramadanModeEnabled: boolean;
  setRamadanModeEnabled: (enabled: boolean) => void;
  ramadanRecords: RamadanDayRecord[];
  updateRamadanDay: (day: number, updates: Partial<RamadanDayRecord>) => void;

  // Permission assert helper
  assertCanModify: (recordUserId: UserId) => void;
  securityMessage: string | null;
  clearSecurityMessage: () => void;

  // UI Customization Settings
  uiSettings: UISettings;
  updateUISettings: (updates: Partial<UISettings>) => void;
  resetUISettings: () => void;
}

export const DEFAULT_UI_SETTINGS: UISettings = {
  accentColor: 'blue',
  bgTone: 'navy',
  glassBlur: 'medium',
  showAtmosphericGlow: true,
  showPattern: true,
  timeFormat: '12h',
  arabicFontSize: 'normal',
  fontStyle: 'serif',
  showPointsCircle: true,
  showNextPrayerCard: true,
  showProgressTiles: true,
  showSunnahOnHome: true,
  showQuranOnHome: true,
  showJourneyOnHome: true,
  showWeeklyGraphOnHome: true,
  floatingParticles: true,
  hijriDayOffset: 0,
};

const DEFAULT_PROFILES: Record<UserId, PersonProfile> = {
  person_1: {
    id: 'person_1',
    name: 'Person 1',
    partnerName: 'Person 2',
    country: 'Kuwait',
    city: 'Kuwait City',
    timezone: 'Asia/Kuwait',
    latitude: 29.3759,
    longitude: 47.9774,
    calculationMethod: 'Kuwait',
    madhab: 'shafi',
    dailyQuranGoal: 10,
    pointsGoal: 800,
    avatarColor: '#8DB7D9',
  },
  person_2: {
    id: 'person_2',
    name: 'Person 2',
    partnerName: 'Person 1',
    country: 'Uzbekistan',
    city: 'Tashkent',
    timezone: 'Asia/Tashkent',
    latitude: 41.2995,
    longitude: 69.2401,
    calculationMethod: 'MuslimWorldLeague',
    madhab: 'hanafi',
    dailyQuranGoal: 10,
    pointsGoal: 800,
    avatarColor: '#D8B477',
  },
};

const IbadahContext = createContext<IbadahContextType | undefined>(undefined);

export const IbadahProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUserId, setActiveUserIdState] = useState<UserId>(() => {
    const saved = localStorage.getItem('our_ibadah_active_user');
    return (saved as UserId) || 'person_1';
  });

  const [profiles, setProfiles] = useState<Record<UserId, PersonProfile>>(() => {
    const saved = localStorage.getItem('our_ibadah_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROFILES;
  });

  const [pointsConfig, setPointsConfig] = useState<PointsConfig>(() => {
    const saved = localStorage.getItem('our_ibadah_points_config');
    return saved ? JSON.parse(saved) : DEFAULT_POINTS_CONFIG;
  });

  // Seeded point events for realistic weekly graph visualization
  const [pointEvents, setPointEvents] = useState<PointEvent[]>(() => {
    const saved = localStorage.getItem('our_ibadah_point_events_v2');
    if (saved) return JSON.parse(saved);

    // Initial realistic past 7 days points history
    const baseNow = new Date();
    const seeded: PointEvent[] = [];
    const seedDays = [
      { offset: 6, points: [50, 50, 40, 50, 50, 300, 10, 10] }, // ~560 pts
      { offset: 5, points: [50, 40, 50, 50, 40, 400, 10, 20] }, // ~660 pts
      { offset: 4, points: [50, 50, 50, 40, 50, 250, 10] },     // ~500 pts
      { offset: 3, points: [50, 50, 50, 50, 50, 450, 10, 10] }, // ~720 pts
      { offset: 2, points: [50, 40, 40, 50, 50, 300, 20] },     // ~550 pts
      { offset: 1, points: [50, 50, 50, 50, 40, 350, 10, 10] }, // ~610 pts
    ];

    seedDays.forEach(s => {
      const d = new Date(baseNow);
      d.setDate(baseNow.getDate() - s.offset);
      const dateStr = d.toISOString().split('T')[0];
      s.points.forEach((pts, idx) => {
        seeded.push({
          id: `seed_${s.offset}_${idx}`,
          userId: 'person_1',
          date: dateStr,
          activityType: idx === 5 ? 'quran' : idx > 5 ? 'sunnah' : 'prayer',
          activityId: `item_${idx}`,
          timestamp: d.toISOString(),
          points: pts,
          title: `Activity (+${pts})`,
        });
        seeded.push({
          id: `seed_p2_${s.offset}_${idx}`,
          userId: 'person_2',
          date: dateStr,
          activityType: idx === 5 ? 'quran' : idx > 5 ? 'sunnah' : 'prayer',
          activityId: `item_${idx}`,
          timestamp: d.toISOString(),
          points: Math.round(pts * 0.85),
          title: `Activity (+${pts})`,
        });
      });
    });

    return seeded;
  });

  const [prayers, setPrayers] = useState<PrayerRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_prayers');
    return saved ? JSON.parse(saved) : [];
  });

  const [sunnahRecords, setSunnahRecords] = useState<SunnahRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_sunnah_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [quranLogs, setQuranLogs] = useState<QuranLog[]>(() => {
    const saved = localStorage.getItem('our_ibadah_quran_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [goodDeeds, setGoodDeeds] = useState<GoodDeedRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_good_deeds');
    return saved ? JSON.parse(saved) : [];
  });

  const [sadaqahLogs, setSadaqahLogs] = useState<SadaqahRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_sadaqah');
    return saved ? JSON.parse(saved) : [];
  });

  const [duas, setDuas] = useState<DuaRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_duas');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'dua_1',
        userId: 'person_1',
        title: 'Rabbi zidni \'ilma (My Lord, increase me in knowledge)',
        category: 'guidance',
        isShared: true,
        madeToday: true,
        createdAt: new Date().toISOString(),
        authorName: 'Person 1',
      },
      {
        id: 'dua_2',
        userId: 'person_2',
        title: 'May Allah grant both of us ease, forgiveness, and accept our prayers.',
        category: 'personal',
        isShared: true,
        madeToday: true,
        createdAt: new Date().toISOString(),
        authorName: 'Person 2',
      },
    ];
  });

  const [reflections, setReflections] = useState<ReflectionRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_reflections');
    return saved ? JSON.parse(saved) : [];
  });

  const [partnerReactions, setPartnerReactions] = useState<PartnerReaction[]>(() => {
    const saved = localStorage.getItem('our_ibadah_partner_reactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'react_1',
        fromUserId: 'person_2',
        toUserId: 'person_1',
        message: 'May Allah accept your prayers today! 🤲',
        emoji: '✨',
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [ramadanModeEnabled, setRamadanModeEnabled] = useState<boolean>(() => {
    return localStorage.getItem('our_ibadah_ramadan_mode') === 'true';
  });

  const [ramadanRecords, setRamadanRecords] = useState<RamadanDayRecord[]>(() => {
    const saved = localStorage.getItem('our_ibadah_ramadan_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [uiSettings, setUiSettings] = useState<UISettings>(() => {
    const saved = localStorage.getItem('our_ibadah_ui_settings');
    if (saved) {
      try {
        return { ...DEFAULT_UI_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_UI_SETTINGS;
  });

  const updateUISettings = (updates: Partial<UISettings>) => {
    setUiSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('our_ibadah_ui_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const resetUISettings = () => {
    setUiSettings(DEFAULT_UI_SETTINGS);
    localStorage.setItem('our_ibadah_ui_settings', JSON.stringify(DEFAULT_UI_SETTINGS));
  };

  const [floatingAnimations, setFloatingAnimations] = useState<FloatingPointAnimation[]>([]);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  const activeProfile = profiles[activeUserId];
  const partnerUserId: UserId = activeUserId === 'person_1' ? 'person_2' : 'person_1';
  const partnerProfile = profiles[partnerUserId];

  const is24h = uiSettings.timeFormat === '24h';
  const activeUserNow = useMemo(() => getCurrentTimeInTimezone(activeProfile.timezone), [activeProfile.timezone]);
  const currentLocalTimeStr = useMemo(() => formatTimeInTimezone(activeUserNow, activeProfile.timezone, is24h), [activeUserNow, activeProfile.timezone, is24h]);
  const currentLocalDateStr = useMemo(() => getDateStringInTimezone(activeUserNow, activeProfile.timezone), [activeUserNow, activeProfile.timezone]);
  const currentGregorianStr = useMemo(() => formatGregorianDisplay(activeUserNow, activeProfile.timezone), [activeUserNow, activeProfile.timezone]);
  const currentHijriStr = useMemo(() => getHijriDateDisplay(activeUserNow, activeProfile.timezone, uiSettings.hijriDayOffset), [activeUserNow, activeProfile.timezone, uiSettings.hijriDayOffset]);

  const [selectedDateStr, setSelectedDateStr] = useState<string>(currentLocalDateStr);

  useEffect(() => {
    setSelectedDateStr(currentLocalDateStr);
  }, [currentLocalDateStr]);

  const currentSchedule = useMemo(() => calculatePrayerTimes(activeProfile, undefined, is24h), [activeProfile, is24h]);
  const partnerSchedule = useMemo(() => calculatePrayerTimes(partnerProfile, undefined, is24h), [partnerProfile, is24h]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_active_user', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_point_events_v2', JSON.stringify(pointEvents));
  }, [pointEvents]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_prayers', JSON.stringify(prayers));
  }, [prayers]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_sunnah_records', JSON.stringify(sunnahRecords));
  }, [sunnahRecords]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_quran_logs', JSON.stringify(quranLogs));
  }, [quranLogs]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_good_deeds', JSON.stringify(goodDeeds));
  }, [goodDeeds]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_sadaqah', JSON.stringify(sadaqahLogs));
  }, [sadaqahLogs]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_duas', JSON.stringify(duas));
  }, [duas]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_reflections', JSON.stringify(reflections));
  }, [reflections]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_partner_reactions', JSON.stringify(partnerReactions));
  }, [partnerReactions]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_ramadan_mode', String(ramadanModeEnabled));
  }, [ramadanModeEnabled]);

  useEffect(() => {
    localStorage.setItem('our_ibadah_ramadan_records', JSON.stringify(ramadanRecords));
  }, [ramadanRecords]);

  const assertCanModify = (recordUserId: UserId) => {
    if (recordUserId !== activeUserId) {
      const msg = `Permission Denied: Only ${profiles[recordUserId].name} can modify their records.`;
      setSecurityMessage(msg);
      throw new Error(msg);
    }
  };

  const clearSecurityMessage = () => setSecurityMessage(null);

  const setActiveUserId = (id: UserId) => {
    setActiveUserIdState(id);
    clearSecurityMessage();
  };

  const updateProfile = (userId: UserId, updates: Partial<PersonProfile>) => {
    assertCanModify(userId);
    setProfiles(prev => ({
      ...prev,
      [userId]: { ...prev[userId], ...updates },
    }));
  };

  const updatePointsConfig = (newConfig: Partial<PointsConfig>) => {
    setPointsConfig(prev => {
      const updated = { ...prev, ...newConfig };
      localStorage.setItem('our_ibadah_points_config', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerPointAnimation = (points: number, label: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setFloatingAnimations(prev => [...prev, { id, points, label }]);
  };

  const removeFloatingAnimation = (id: string) => {
    setFloatingAnimations(prev => prev.filter(a => a.id !== id));
  };

  const todayBreakdown = useMemo(() => {
    return getDailyPointsBreakdown(pointEvents, activeUserId, currentLocalDateStr);
  }, [pointEvents, activeUserId, currentLocalDateStr]);

  const partnerTodayBreakdown = useMemo(() => {
    const partnerDate = getDateStringInTimezone(getCurrentTimeInTimezone(partnerProfile.timezone), partnerProfile.timezone);
    return getDailyPointsBreakdown(pointEvents, partnerUserId, partnerDate);
  }, [pointEvents, partnerUserId, partnerProfile.timezone]);

  const selectedDayBreakdown = useMemo(() => {
    return getDailyPointsBreakdown(pointEvents, activeUserId, selectedDateStr);
  }, [pointEvents, activeUserId, selectedDateStr]);

  const todayPoints = todayBreakdown.grandTotal;

  const { weekPoints, monthPoints } = useMemo(() => {
    const now = getCurrentTimeInTimezone(activeProfile.timezone);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    const startOfWeekStr = getDateStringInTimezone(startOfWeek, activeProfile.timezone);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthStr = getDateStringInTimezone(startOfMonth, activeProfile.timezone);

    let wPoints = 0;
    let mPoints = 0;

    for (const e of pointEvents) {
      if (e.userId === activeUserId) {
        if (e.date >= startOfWeekStr && e.date <= currentLocalDateStr) {
          wPoints += e.points;
        }
        if (e.date >= startOfMonthStr && e.date <= currentLocalDateStr) {
          mPoints += e.points;
        }
      }
    }

    return { weekPoints: wPoints, monthPoints: mPoints };
  }, [pointEvents, activeUserId, activeProfile.timezone, currentLocalDateStr]);

  const getPrayersForDateAndUser = (date: string, userId: UserId) => {
    const userPrayers = prayers.filter(p => p.userId === userId && p.date === date);
    const result: Record<PrayerName, PrayerRecord | undefined> = {
      fajr: undefined,
      dhuhr: undefined,
      asr: undefined,
      maghrib: undefined,
      isha: undefined,
    };
    for (const p of userPrayers) {
      result[p.prayerName] = p;
    }
    return result;
  };

  const recordPrayerCompletion = (
    prayerName: PrayerName,
    targetDateStr?: string,
    customActualTime?: string
  ) => {
    assertCanModify(activeUserId);
    const date = targetDateStr || currentLocalDateStr;
    const existing = prayers.find(p => p.userId === activeUserId && p.date === date && p.prayerName === prayerName);

    if (existing && existing.status === 'completed') {
      return;
    }

    const prayerInfo = currentSchedule[prayerName];
    const now = getCurrentTimeInTimezone(activeProfile.timezone);
    const actualTimeStr = customActualTime || formatTimeInTimezone(now, activeProfile.timezone);

    const pointsEarned = calculatePrayerPoints(
      prayerInfo.scheduledDate,
      now,
      prayerInfo.windowEndDate,
      pointsConfig
    );

    const recordId = existing ? existing.id : `pr_${activeUserId}_${date}_${prayerName}`;
    const newRecord: PrayerRecord = {
      id: recordId,
      userId: activeUserId,
      date,
      prayerName,
      scheduledTime: prayerInfo.scheduledTimeStr,
      actualTime: actualTimeStr,
      status: 'completed',
      points: pointsEarned,
      timezone: activeProfile.timezone,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPrayers(prev => [...prev.filter(p => p.id !== recordId), newRecord]);

    const eventId = `pe_prayer_${recordId}`;
    const newEvent: PointEvent = {
      id: eventId,
      userId: activeUserId,
      date,
      activityType: 'prayer',
      activityId: prayerName,
      timestamp: new Date().toISOString(),
      points: pointsEarned,
      title: `${prayerInfo.displayName} (+${pointsEarned})`,
    };

    setPointEvents(prev => [...prev.filter(e => e.id !== eventId), newEvent]);
    triggerPointAnimation(pointsEarned, `${prayerInfo.displayName}`);
  };

  const markPrayerMissed = (prayerName: PrayerName, targetDateStr?: string) => {
    assertCanModify(activeUserId);
    const date = targetDateStr || currentLocalDateStr;
    const prayerInfo = currentSchedule[prayerName];
    const existing = prayers.find(p => p.userId === activeUserId && p.date === date && p.prayerName === prayerName);
    const recordId = existing ? existing.id : `pr_${activeUserId}_${date}_${prayerName}`;

    const newRecord: PrayerRecord = {
      id: recordId,
      userId: activeUserId,
      date,
      prayerName,
      scheduledTime: prayerInfo.scheduledTimeStr,
      status: 'missed',
      points: 0,
      timezone: activeProfile.timezone,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPrayers(prev => [...prev.filter(p => p.id !== recordId), newRecord]);
    const eventId = `pe_prayer_${recordId}`;
    setPointEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const editPrayerRecord = (
    prayerId: string,
    newStatus: PrayerStatus,
    newActualTime?: string,
    customPoints?: number
  ) => {
    const existing = prayers.find(p => p.id === prayerId);
    if (!existing) return;
    assertCanModify(existing.userId);

    const calculatedPoints =
      newStatus === 'completed'
        ? (customPoints !== undefined ? customPoints : (existing.points || 50))
        : 0;

    const updatedRecord: PrayerRecord = {
      ...existing,
      status: newStatus,
      actualTime: newStatus === 'completed' ? (newActualTime || existing.actualTime || '12:00 PM') : undefined,
      points: calculatedPoints,
      edited: true,
      updatedAt: new Date().toISOString(),
    };

    setPrayers(prev => prev.map(p => (p.id === prayerId ? updatedRecord : p)));

    const eventId = `pe_prayer_${prayerId}`;
    if (newStatus === 'completed') {
      const updatedEvent: PointEvent = {
        id: eventId,
        userId: existing.userId,
        date: existing.date,
        activityType: 'prayer',
        activityId: existing.prayerName,
        timestamp: new Date().toISOString(),
        points: calculatedPoints,
        title: `${existing.prayerName.toUpperCase()} (+${calculatedPoints})`,
      };
      setPointEvents(prev => [...prev.filter(e => e.id !== eventId), updatedEvent]);
    } else {
      setPointEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  // Sunnah & Nafl Prayers (+10 pts each)
  const isSunnahCompleted = (sunnahId: string, dateStr?: string) => {
    const date = dateStr || currentLocalDateStr;
    return sunnahRecords.some(s => s.userId === activeUserId && s.date === date && s.sunnahId === sunnahId && s.completed);
  };

  const toggleSunnahPrayer = (sunnahId: string, title: string, dateStr?: string) => {
    assertCanModify(activeUserId);
    const date = dateStr || currentLocalDateStr;
    const existing = sunnahRecords.find(s => s.userId === activeUserId && s.date === date && s.sunnahId === sunnahId);
    const eventId = `pe_sunnah_${activeUserId}_${date}_${sunnahId}`;

    if (existing && existing.completed) {
      // Uncheck & remove 10 points
      setSunnahRecords(prev => prev.filter(s => s.id !== existing.id));
      setPointEvents(prev => prev.filter(e => e.id !== eventId));
    } else {
      // Check & add 10 points
      const recordId = `sun_${activeUserId}_${date}_${sunnahId}`;
      const record: SunnahRecord = {
        id: recordId,
        userId: activeUserId,
        date,
        sunnahId,
        title,
        completed: true,
        points: 10,
      };
      setSunnahRecords(prev => [...prev.filter(s => s.id !== recordId), record]);

      const newEvent: PointEvent = {
        id: eventId,
        userId: activeUserId,
        date,
        activityType: 'sunnah',
        activityId: sunnahId,
        timestamp: new Date().toISOString(),
        points: 10,
        title: `${title} (+10)`,
      };
      setPointEvents(prev => [...prev.filter(e => e.id !== eventId), newEvent]);
      triggerPointAnimation(10, title);
    }
  };

  // Quran section
  const todayQuranLog = useMemo(() => {
    const found = quranLogs.find(q => q.userId === activeUserId && q.date === currentLocalDateStr);
    return (
      found || {
        userId: activeUserId,
        date: currentLocalDateStr,
        pagesRead: 0,
        pointsEarned: 0,
        currentJuz: 1,
        lastUpdated: new Date().toISOString(),
      }
    );
  }, [quranLogs, activeUserId, currentLocalDateStr]);

  const setQuranPagesRead = (pages: number, dateStr?: string) => {
    assertCanModify(activeUserId);
    const date = dateStr || currentLocalDateStr;
    const safePages = Math.max(0, pages);
    const newPoints = safePages * pointsConfig.pointsPerQuranPage;
    const currentJuz = Math.min(30, Math.max(1, Math.ceil((safePages || 1) / 20)));

    setQuranLogs(prev => {
      const filtered = prev.filter(q => !(q.userId === activeUserId && q.date === date));
      const existing = prev.find(q => q.userId === activeUserId && q.date === date);
      return [
        ...filtered,
        {
          userId: activeUserId,
          date,
          pagesRead: safePages,
          pointsEarned: newPoints,
          currentJuz,
          bookmark: existing?.bookmark,
          lastUpdated: new Date().toISOString(),
        },
      ];
    });

    const eventId = `pe_quran_${activeUserId}_${date}`;
    if (safePages > 0) {
      const quranEvent: PointEvent = {
        id: eventId,
        userId: activeUserId,
        date,
        activityType: 'quran',
        activityId: 'quran_pages',
        timestamp: new Date().toISOString(),
        points: newPoints,
        title: `Quran (${safePages}p · +${newPoints})`,
        metadata: { pages: safePages },
      };
      setPointEvents(prev => [...prev.filter(e => e.id !== eventId), quranEvent]);
    } else {
      setPointEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  const updateQuranBookmark = (surah: string, surahNumber: number, ayah: number, page: number) => {
    assertCanModify(activeUserId);
    setQuranLogs(prev => {
      const existing = prev.find(q => q.userId === activeUserId && q.date === currentLocalDateStr);
      const updated: QuranLog = {
        userId: activeUserId,
        date: currentLocalDateStr,
        pagesRead: existing ? existing.pagesRead : 0,
        pointsEarned: existing ? existing.pointsEarned : 0,
        currentJuz: Math.ceil(page / 20),
        bookmark: { surah, surahNumber, ayah, page },
        lastUpdated: new Date().toISOString(),
      };
      return [...prev.filter(q => !(q.userId === activeUserId && q.date === currentLocalDateStr)), updated];
    });
  };

  // Good deeds
  const toggleGoodDeed = (deedId: string, title: string, dateStr?: string) => {
    assertCanModify(activeUserId);
    const date = dateStr || currentLocalDateStr;
    const existing = goodDeeds.find(g => g.userId === activeUserId && g.date === date && g.deedId === deedId);

    if (existing && existing.completed) {
      setGoodDeeds(prev => prev.filter(g => g.id !== existing.id));
      setPointEvents(prev => prev.filter(e => e.id !== `pe_deed_${existing.id}`));
    } else {
      const recordId = `gd_${activeUserId}_${date}_${deedId}`;
      const points = pointsConfig.pointsPerGoodDeed;
      const record: GoodDeedRecord = {
        id: recordId,
        userId: activeUserId,
        date,
        deedId,
        title,
        completed: true,
        points,
      };
      setGoodDeeds(prev => [...prev, record]);

      const eventId = `pe_deed_${recordId}`;
      const newEvent: PointEvent = {
        id: eventId,
        userId: activeUserId,
        date,
        activityType: 'good_deed',
        activityId: deedId,
        timestamp: new Date().toISOString(),
        points,
        title: `${title} (+${points})`,
      };
      setPointEvents(prev => [...prev, newEvent]);
      triggerPointAnimation(points, title);
    }
  };

  // Sadaqah
  const recordSadaqah = (
    category: 'money' | 'food' | 'water' | 'help' | 'other',
    note: string,
    points: number = pointsConfig.pointsPerSadaqah
  ) => {
    assertCanModify(activeUserId);
    const recordId = `sad_${Date.now()}`;
    const newRecord: SadaqahRecord = {
      id: recordId,
      userId: activeUserId,
      date: currentLocalDateStr,
      category,
      note,
      points,
      timestamp: new Date().toISOString(),
    };
    setSadaqahLogs(prev => [newRecord, ...prev]);

    const eventId = `pe_sadaqah_${recordId}`;
    const newEvent: PointEvent = {
      id: eventId,
      userId: activeUserId,
      date: currentLocalDateStr,
      activityType: 'sadaqah',
      activityId: category,
      timestamp: new Date().toISOString(),
      points,
      title: `Sadaqah (+${points})`,
    };
    setPointEvents(prev => [...prev, newEvent]);
    triggerPointAnimation(points, 'Sadaqah');
  };

  // Duas
  const myDuas = useMemo(() => duas.filter(d => d.userId === activeUserId && !d.isShared), [duas, activeUserId]);
  const sharedDuas = useMemo(() => duas.filter(d => d.isShared), [duas]);

  const toggleDuaMadeToday = (duaId: string) => {
    setDuas(prev =>
      prev.map(d => {
        if (d.id === duaId) {
          return {
            ...d,
            madeToday: !d.madeToday,
            lastMadeDate: !d.madeToday ? currentLocalDateStr : d.lastMadeDate,
          };
        }
        return d;
      })
    );
  };

  const createDua = (title: string, category: DuaRecord['category'], isShared: boolean) => {
    assertCanModify(activeUserId);
    const newDua: DuaRecord = {
      id: `dua_${Date.now()}`,
      userId: activeUserId,
      title,
      category,
      isShared,
      madeToday: true,
      lastMadeDate: currentLocalDateStr,
      createdAt: new Date().toISOString(),
      authorName: activeProfile.name,
    };
    setDuas(prev => [newDua, ...prev]);
  };

  const deleteDua = (duaId: string) => {
    const dua = duas.find(d => d.id === duaId);
    if (!dua) return;
    assertCanModify(dua.userId);
    setDuas(prev => prev.filter(d => d.id !== duaId));
  };

  // Reflections
  const getReflectionForDate = (date: string, userId: UserId) => {
    if (userId !== activeUserId) return undefined;
    return reflections.find(r => r.userId === userId && r.date === date);
  };

  const saveReflection = (
    date: string,
    gratitude: string[],
    improvements: string,
    duasText: string,
    learned: string
  ) => {
    assertCanModify(activeUserId);
    setReflections(prev => {
      const filtered = prev.filter(r => !(r.userId === activeUserId && r.date === date));
      const record: ReflectionRecord = {
        id: `ref_${activeUserId}_${date}`,
        userId: activeUserId,
        date,
        gratitude,
        improvements,
        duas: duasText,
        learnedToday: learned,
        createdAt: new Date().toISOString(),
      };
      return [...filtered, record];
    });
  };

  // Partner reactions
  const sendPartnerReaction = (message: string, emoji: string) => {
    assertCanModify(activeUserId);
    const reaction: PartnerReaction = {
      id: `react_${Date.now()}`,
      fromUserId: activeUserId,
      toUserId: partnerUserId,
      message,
      emoji,
      timestamp: new Date().toISOString(),
    };
    setPartnerReactions(prev => [reaction, ...prev]);
  };

  // Ramadan mode
  const updateRamadanDay = (day: number, updates: Partial<RamadanDayRecord>) => {
    assertCanModify(activeUserId);
    setRamadanRecords(prev => {
      const existing = prev.find(r => r.day === day && r.userId === activeUserId);
      const updated: RamadanDayRecord = existing
        ? { ...existing, ...updates }
        : {
            day,
            userId: activeUserId,
            fasting: false,
            prayersCount: 0,
            tarawih: false,
            quranJuzRead: 0,
            sadaqahDone: false,
            dhikrDone: false,
            suhoor: false,
            iftar: false,
            laylatulQadrDua: false,
            ...updates,
          };
      return [...prev.filter(r => !(r.day === day && r.userId === activeUserId)), updated];
    });
  };

  return (
    <IbadahContext.Provider
      value={{
        activeUserId,
        setActiveUserId,
        activeProfile,
        partnerProfile,
        updateProfile,
        currentSchedule,
        partnerSchedule,
        currentLocalTimeStr,
        currentLocalDateStr,
        currentGregorianStr,
        currentHijriStr,
        selectedDateStr,
        setSelectedDateStr,
        pointsConfig,
        updatePointsConfig,
        pointEvents,
        todayBreakdown,
        partnerTodayBreakdown,
        selectedDayBreakdown,
        todayPoints,
        weekPoints,
        monthPoints,
        floatingAnimations,
        removeFloatingAnimation,
        prayers,
        getPrayersForDateAndUser,
        recordPrayerCompletion,
        markPrayerMissed,
        editPrayerRecord,
        sunnahRecords,
        isSunnahCompleted,
        toggleSunnahPrayer,
        quranLogs,
        todayQuranLog,
        setQuranPagesRead,
        updateQuranBookmark,
        goodDeeds,
        toggleGoodDeed,
        sadaqahLogs,
        recordSadaqah,
        duas,
        myDuas,
        sharedDuas,
        toggleDuaMadeToday,
        createDua,
        deleteDua,
        reflections,
        getReflectionForDate,
        saveReflection,
        partnerReactions,
        sendPartnerReaction,
        ramadanModeEnabled,
        setRamadanModeEnabled,
        ramadanRecords,
        updateRamadanDay,
        assertCanModify,
        securityMessage,
        clearSecurityMessage,
        uiSettings,
        updateUISettings,
        resetUISettings,
      }}
    >
      {children}
    </IbadahContext.Provider>
  );
};

export const useIbadah = () => {
  const context = useContext(IbadahContext);
  if (!context) {
    throw new Error('useIbadah must be used within an IbadahProvider');
  }
  return context;
};
