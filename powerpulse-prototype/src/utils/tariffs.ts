import { minutesSinceMidnight } from './time';

export type TariffPeriod = 'day' | 'night';

export const TARIFFS = {
  day: {
    firstBlockLimitKWh: 800,
    firstBlockEurPerKWh: 0.0905,
    secondBlockEurPerKWh: 0.1543,
    startMinute: 8 * 60, // 08:00
    endMinute: 22 * 60, // 22:00
  },
  night: {
    firstBlockLimitKWh: 800,
    firstBlockEurPerKWh: 0.0388,
    secondBlockEurPerKWh: 0.0728,
  },
} as const;

export function getTariffPeriod(now: Date = new Date()): TariffPeriod {
  const m = minutesSinceMidnight(now);
  const isDay = m >= TARIFFS.day.startMinute && m < TARIFFS.day.endMinute;
  return isDay ? 'day' : 'night';
}

/**
 * Kosovo tariff model (hardcoded).
 * We approximate blocks using this month's kWh.
 */
export function estimateCostEur(params: {
  period: TariffPeriod;
  monthToDateKWh: number;
  addKWh: number;
}) {
  const { period, monthToDateKWh, addKWh } = params;
  const t = period === 'day' ? TARIFFS.day : TARIFFS.night;
  const limit = t.firstBlockLimitKWh;

  const alreadyInBlock1 = Math.max(0, limit - monthToDateKWh);
  const kWhAtRate1 = Math.min(addKWh, alreadyInBlock1);
  const kWhAtRate2 = Math.max(0, addKWh - kWhAtRate1);
  return kWhAtRate1 * t.firstBlockEurPerKWh + kWhAtRate2 * t.secondBlockEurPerKWh;
}

export function bestTimeSuggestion(): string {
  return 'Best time to run heavy appliances: night tariff (22:00–08:00).';
}

