import { PointEvent, PrayerName } from '../types';

export interface PointsConfig {
  prayerPoints: {
    tier1_0to30: number; // default 50
    tier2_31to60: number; // default 40
    tier3_61to90: number; // default 30
    tier4_91to120: number; // default 20
    tier5_over120: number; // default 10
  };
  pointsPerSunnah: number; // default 10 points per sunnah/nafl prayer
  pointsPerQuranPage: number; // default 50
  pointsPerGoodDeed: number; // default 15
  pointsPerSadaqah: number; // default 20
  pointsPerFasting: number; // default 50
}

export const DEFAULT_POINTS_CONFIG: PointsConfig = {
  prayerPoints: {
    tier1_0to30: 50,
    tier2_31to60: 40,
    tier3_61to90: 30,
    tier4_91to120: 20,
    tier5_over120: 10,
  },
  pointsPerSunnah: 10,
  pointsPerQuranPage: 50,
  pointsPerGoodDeed: 15,
  pointsPerSadaqah: 20,
  pointsPerFasting: 50,
};

/**
 * Calculates prayer timeliness points based on elapsed minutes from scheduled prayer start
 */
export function calculatePrayerPoints(
  scheduledDate: Date,
  actualCompletionDate: Date,
  windowEndDate?: Date,
  config: PointsConfig = DEFAULT_POINTS_CONFIG
): number {
  const diffMs = actualCompletionDate.getTime() - scheduledDate.getTime();
  const elapsedMinutes = Math.floor(diffMs / 60000);

  if (elapsedMinutes <= 30) {
    return config.prayerPoints.tier1_0to30;
  }
  if (elapsedMinutes <= 60) {
    return config.prayerPoints.tier2_31to60;
  }
  if (elapsedMinutes <= 90) {
    return config.prayerPoints.tier3_61to90;
  }
  if (elapsedMinutes <= 120) {
    return config.prayerPoints.tier4_91to120;
  }

  return config.prayerPoints.tier5_over120;
}

/**
 * Aggregates point events for a specific user and date
 */
export function calculateDailyPoints(events: PointEvent[], userId: string, date: string): number {
  return events
    .filter(e => e.userId === userId && e.date === date)
    .reduce((sum, e) => sum + e.points, 0);
}

/**
 * Aggregates daily breakdown by activity category
 */
export function getDailyPointsBreakdown(events: PointEvent[], userId: string, date: string) {
  const dayEvents = events.filter(e => e.userId === userId && e.date === date);
  
  const prayerBreakdown: Record<PrayerName, number> = {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  };

  let sunnahPoints = 0;
  let quranPoints = 0;
  let goodDeedsPoints = 0;
  let sadaqahPoints = 0;
  let fastingPoints = 0;

  for (const event of dayEvents) {
    if (event.activityType === 'prayer') {
      const pName = event.activityId as PrayerName;
      if (prayerBreakdown[pName] !== undefined) {
        prayerBreakdown[pName] = (prayerBreakdown[pName] || 0) + event.points;
      }
    } else if (event.activityType === 'sunnah') {
      sunnahPoints += event.points;
    } else if (event.activityType === 'quran') {
      quranPoints += event.points;
    } else if (event.activityType === 'good_deed') {
      goodDeedsPoints += event.points;
    } else if (event.activityType === 'sadaqah') {
      sadaqahPoints += event.points;
    } else if (event.activityType === 'fasting') {
      fastingPoints += event.points;
    }
  }

  const prayerTotal = Object.values(prayerBreakdown).reduce((a, b) => a + b, 0);
  const otherTotal = goodDeedsPoints + sadaqahPoints + fastingPoints;
  const grandTotal = prayerTotal + sunnahPoints + quranPoints + otherTotal;

  return {
    prayerBreakdown,
    prayerTotal,
    sunnahPoints,
    quranPoints,
    goodDeedsPoints,
    sadaqahPoints,
    fastingPoints,
    otherTotal,
    grandTotal,
    recentEvents: [...dayEvents].sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  };
}
