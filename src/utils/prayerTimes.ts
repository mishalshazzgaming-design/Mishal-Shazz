import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { PersonProfile, PrayerName, PrayerTimeInfo } from '../types';

export function getCalculationParameters(methodName: string, madhab: 'shafi' | 'hanafi') {
  let params;
  switch (methodName) {
    case 'Kuwait':
      params = CalculationMethod.Kuwait();
      break;
    case 'UmmAlQura':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'MuslimWorldLeague':
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'NorthAmerica':
    case 'ISNA':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'Dubai':
      params = CalculationMethod.Dubai();
      break;
    case 'Qatar':
      params = CalculationMethod.Qatar();
      break;
    default:
      params = CalculationMethod.MuslimWorldLeague();
  }

  if (madhab === 'hanafi') {
    params.madhab = Madhab.Hanafi;
  } else {
    params.madhab = Madhab.Shafi;
  }

  return params;
}

/**
 * Get current time in specified IANA timezone
 */
export function getCurrentTimeInTimezone(timeZone: string): Date {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const partMap: Record<string, string> = {};
    for (const p of parts) {
      partMap[p.type] = p.value;
    }
    return new Date(
      parseInt(partMap.year, 10),
      parseInt(partMap.month, 10) - 1,
      parseInt(partMap.day, 10),
      parseInt(partMap.hour, 10),
      parseInt(partMap.minute, 10),
      parseInt(partMap.second, 10)
    );
  } catch (e) {
    console.error('Error getting time in timezone:', e);
    return new Date();
  }
}

/**
 * Formats time as "4:28 AM" or "04:28" in user's timezone
 */
export function formatTimeInTimezone(date: Date, timeZone: string, is24Hour: boolean = false): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: is24Hour ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: !is24Hour,
    }).format(date);
  } catch {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: !is24Hour });
  }
}

/**
 * Formats date as YYYY-MM-DD in user's timezone
 */
export function getDateStringInTimezone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Formats date as "Thursday · October 1"
 */
export function formatGregorianDisplay(date: Date, timeZone: string): string {
  try {
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { timeZone, month: 'long' }).format(date);
    const day = new Intl.DateTimeFormat('en-US', { timeZone, day: 'numeric' }).format(date);
    return `${weekday} · ${month} ${day}`;
  } catch {
    return date.toDateString();
  }
}

/**
 * Calculates Hijri Date string with Islamic month name and AH year
 */
export function getHijriDateDisplay(date: Date, timeZone: string, adjustmentDays: number = 0): string {
  try {
    const adjustedDate = new Date(date.getTime() + adjustmentDays * 86400000);
    // Use Intl islamic calendar
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      timeZone,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    // Formatting parts to give exact "20 Rabi’ al-Thani 1448 AH"
    const parts = formatter.formatToParts(adjustedDate);
    let day = '';
    let month = '';
    let year = '';

    for (const part of parts) {
      if (part.type === 'day') day = part.value;
      if (part.type === 'month') month = part.value;
      if (part.type === 'year') year = part.value;
    }

    // Clean up month name if needed
    const monthCleaned = month
      .replace(/AH|ERA\d+/gi, '')
      .trim();

    return `${day} ${monthCleaned} ${year} AH`;
  } catch {
    return '20 Rabi’ al-Thani 1448 AH';
  }
}

export interface DayPrayerSchedule {
  fajr: PrayerTimeInfo;
  sunrise: { scheduledTimeStr: string; scheduledDate: Date };
  dhuhr: PrayerTimeInfo;
  asr: PrayerTimeInfo;
  maghrib: PrayerTimeInfo;
  isha: PrayerTimeInfo;
  nextPrayer: {
    name: PrayerName;
    displayName: string;
    scheduledTimeStr: string;
    scheduledDate: Date;
    minutesRemaining: number;
    hoursRemaining: number;
    isPastToday: boolean;
  };
}

/**
 * Calculates all 5 Fard prayers + Sunrise for a given profile and date
 */
export function calculatePrayerTimes(profile: PersonProfile, targetDate?: Date, is24Hour: boolean = false): DayPrayerSchedule {
  const localTarget = targetDate || getCurrentTimeInTimezone(profile.timezone);
  const coordinates = new Coordinates(profile.latitude, profile.longitude);
  const params = getCalculationParameters(profile.calculationMethod, profile.madhab);

  const prayerTimes = new PrayerTimes(coordinates, localTarget, params);
  // Tomorrow's Fajr for Isha window calculation
  const tomorrow = new Date(localTarget.getTime() + 86400000);
  const tomorrowPrayerTimes = new PrayerTimes(coordinates, tomorrow, params);

  const fajrInfo: PrayerTimeInfo = {
    name: 'fajr',
    displayName: 'Fajr',
    scheduledTimeStr: formatTimeInTimezone(prayerTimes.fajr, profile.timezone, is24Hour),
    scheduledDate: prayerTimes.fajr,
    windowEndStr: formatTimeInTimezone(prayerTimes.sunrise, profile.timezone, is24Hour),
    windowEndDate: prayerTimes.sunrise,
  };

  const sunriseInfo = {
    scheduledTimeStr: formatTimeInTimezone(prayerTimes.sunrise, profile.timezone, is24Hour),
    scheduledDate: prayerTimes.sunrise,
  };

  const dhuhrInfo: PrayerTimeInfo = {
    name: 'dhuhr',
    displayName: 'Dhuhr',
    scheduledTimeStr: formatTimeInTimezone(prayerTimes.dhuhr, profile.timezone, is24Hour),
    scheduledDate: prayerTimes.dhuhr,
    windowEndStr: formatTimeInTimezone(prayerTimes.asr, profile.timezone, is24Hour),
    windowEndDate: prayerTimes.asr,
  };

  const asrInfo: PrayerTimeInfo = {
    name: 'asr',
    displayName: 'Asr',
    scheduledTimeStr: formatTimeInTimezone(prayerTimes.asr, profile.timezone, is24Hour),
    scheduledDate: prayerTimes.asr,
    windowEndStr: formatTimeInTimezone(prayerTimes.maghrib, profile.timezone, is24Hour),
    windowEndDate: prayerTimes.maghrib,
  };

  const maghribInfo: PrayerTimeInfo = {
    name: 'maghrib',
    displayName: 'Maghrib',
    scheduledTimeStr: formatTimeInTimezone(prayerTimes.maghrib, profile.timezone, is24Hour),
    scheduledDate: prayerTimes.maghrib,
    windowEndStr: formatTimeInTimezone(prayerTimes.isha, profile.timezone, is24Hour),
    windowEndDate: prayerTimes.isha,
  };

  const ishaInfo: PrayerTimeInfo = {
    name: 'isha',
    displayName: 'Isha',
    scheduledTimeStr: formatTimeInTimezone(prayerTimes.isha, profile.timezone, is24Hour),
    scheduledDate: prayerTimes.isha,
    windowEndStr: formatTimeInTimezone(tomorrowPrayerTimes.fajr, profile.timezone, is24Hour),
    windowEndDate: tomorrowPrayerTimes.fajr,
  };

  // Determine next prayer based on current time
  const now = getCurrentTimeInTimezone(profile.timezone);
  const prayerList: { name: PrayerName; info: PrayerTimeInfo }[] = [
    { name: 'fajr', info: fajrInfo },
    { name: 'dhuhr', info: dhuhrInfo },
    { name: 'asr', info: asrInfo },
    { name: 'maghrib', info: maghribInfo },
    { name: 'isha', info: ishaInfo },
  ];

  let next = prayerList.find(p => p.info.scheduledDate > now);
  let isPastToday = false;
  let targetNextPrayer = next ? next.info : null;

  if (!targetNextPrayer) {
    // Tomorrow Fajr is next
    isPastToday = true;
    targetNextPrayer = {
      name: 'fajr',
      displayName: 'Fajr',
      scheduledTimeStr: formatTimeInTimezone(tomorrowPrayerTimes.fajr, profile.timezone, is24Hour),
      scheduledDate: tomorrowPrayerTimes.fajr,
      windowEndStr: formatTimeInTimezone(tomorrowPrayerTimes.sunrise, profile.timezone, is24Hour),
      windowEndDate: tomorrowPrayerTimes.sunrise,
    };
  }

  const diffMs = Math.max(0, targetNextPrayer.scheduledDate.getTime() - now.getTime());
  const minutesRemaining = Math.floor(diffMs / 60000);
  const hoursRemaining = Math.floor(minutesRemaining / 60);

  return {
    fajr: fajrInfo,
    sunrise: sunriseInfo,
    dhuhr: dhuhrInfo,
    asr: asrInfo,
    maghrib: maghribInfo,
    isha: ishaInfo,
    nextPrayer: {
      name: targetNextPrayer.name,
      displayName: targetNextPrayer.displayName,
      scheduledTimeStr: targetNextPrayer.scheduledTimeStr,
      scheduledDate: targetNextPrayer.scheduledDate,
      minutesRemaining,
      hoursRemaining,
      isPastToday,
    },
  };
}
