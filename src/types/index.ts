export type UserId = 'person_1' | 'person_2';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PrayerStatus = 'completed' | 'missed' | 'unrecorded';

export interface PersonProfile {
  id: UserId;
  name: string;
  partnerName: string;
  country: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
  calculationMethod: string;
  madhab: 'shafi' | 'hanafi';
  dailyQuranGoal: number; // in pages
  pointsGoal: number; // daily target for ring fill
  avatarColor: string;
}

export interface PrayerRecord {
  id: string;
  userId: UserId;
  date: string; // YYYY-MM-DD
  prayerName: PrayerName;
  scheduledTime: string; // e.g. "04:22 AM"
  actualTime?: string; // e.g. "04:28 AM"
  status: PrayerStatus;
  points: number;
  timezone: string;
  edited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PointEvent {
  id: string;
  userId: UserId;
  date: string; // YYYY-MM-DD
  activityType: 'prayer' | 'sunnah' | 'quran' | 'fasting' | 'good_deed' | 'sadaqah';
  activityId: string;
  timestamp: string;
  points: number;
  title: string;
  metadata?: Record<string, any>;
}

export interface SunnahRecord {
  id: string;
  userId: UserId;
  date: string;
  sunnahId: string;
  title: string;
  completed: boolean;
  points: number;
}

export interface QuranLog {
  userId: UserId;
  date: string;
  pagesRead: number;
  pointsEarned: number;
  currentJuz: number;
  bookmark?: {
    surah: string;
    surahNumber: number;
    ayah: number;
    page: number;
  };
  lastUpdated: string;
}

export interface FastingRecord {
  id: string;
  userId: UserId;
  date: string;
  type: 'ramadan' | 'voluntary_sunnah' | 'white_days' | 'qada' | 'custom';
  completed: boolean;
  suhoorCompleted?: boolean;
  iftarCompleted?: boolean;
  points: number;
}

export interface GoodDeedRecord {
  id: string;
  userId: UserId;
  date: string;
  deedId: string;
  title: string;
  completed: boolean;
  points: number;
}

export interface SadaqahRecord {
  id: string;
  userId: UserId;
  date: string;
  category: 'money' | 'food' | 'water' | 'help' | 'other';
  note: string;
  points: number;
  timestamp: string;
}

export interface DuaRecord {
  id: string;
  userId: UserId;
  title: string;
  category: 'family' | 'health' | 'career' | 'marriage' | 'guidance' | 'akhirah' | 'personal' | 'other';
  isShared: boolean;
  madeToday: boolean;
  lastMadeDate?: string;
  createdAt: string;
  authorName?: string;
}

export interface ReflectionRecord {
  id: string;
  userId: UserId;
  date: string;
  gratitude: string[];
  improvements: string;
  duas: string;
  learnedToday: string;
  createdAt: string;
}

export interface PartnerReaction {
  id: string;
  fromUserId: UserId;
  toUserId: UserId;
  message: string;
  emoji: string;
  timestamp: string;
}

export interface RamadanDayRecord {
  day: number;
  userId: UserId;
  fasting: boolean;
  prayersCount: number;
  tarawih: boolean;
  quranJuzRead: number;
  sadaqahDone: boolean;
  dhikrDone: boolean;
  suhoor: boolean;
  iftar: boolean;
  laylatulQadrDua: boolean;
}

export interface PrayerTimeInfo {
  name: PrayerName;
  displayName: string;
  scheduledTimeStr: string;
  scheduledDate: Date;
  windowEndStr: string;
  windowEndDate: Date;
}

export interface UISettings {
  accentColor: 'blue' | 'gold' | 'emerald' | 'sapphire' | 'rose';
  bgTone: 'navy' | 'amoled' | 'forest' | 'plum';
  glassBlur: 'soft' | 'medium' | 'deep' | 'minimal';
  showAtmosphericGlow: boolean;
  showPattern: boolean;
  timeFormat: '12h' | '24h';
  arabicFontSize: 'normal' | 'large' | 'huge';
  fontStyle: 'serif' | 'sans';
  showPointsCircle: boolean;
  showNextPrayerCard: boolean;
  showProgressTiles: boolean;
  showSunnahOnHome: boolean;
  showQuranOnHome: boolean;
  showJourneyOnHome: boolean;
  showWeeklyGraphOnHome: boolean;
  floatingParticles: boolean;
  hijriDayOffset: number;
}

