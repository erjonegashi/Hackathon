import { getTariffPeriod, estimateCostEur } from './tariffs';

/**
 * Calculate kWh accumulated during a time period for a given power level.
 * 
 * kWh = (power_in_watts / 1000) * time_in_hours
 * 
 * For example: 1000W for 1 hour = 1 kWh
 */
function calculateKWhFromPower(watts: number, elapsedMs: number): number {
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  const kW = watts / 1000;
  return kW * elapsedHours;
}

/**
 * Calculate cost with dynamic tariff switching.
 * 
 * This function handles the case where a challenge spans across day/night boundaries.
 * It calculates cost in two parts:
 * 1. Remaining time in current period at current rate
 * 2. Time in next period at next rate (if period changes)
 * 
 * For simplicity, we calculate based on the CURRENT tariff only,
 * assuming the challenge period is usually short (30 min).
 * If you need precise multi-period accounting, expand this function.
 */
function getChallengeElapsedMs(startedAt: number | undefined): number {
  if (!startedAt) return 0;
  return Date.now() - startedAt;
}

export function calculateChallengeEnergy(params: {
  startedAt: number | undefined;
  currentLoadW: number;
  monthToDateKWh?: number;
}): {
  kWh: number;
  costEur: number;
  currentTariff: 'day' | 'night';
} {
  const { startedAt, currentLoadW, monthToDateKWh = 0 } = params;

  const elapsedMs = getChallengeElapsedMs(startedAt);
  const kWh = calculateKWhFromPower(currentLoadW, elapsedMs);
  const currentTariff = getTariffPeriod();
  
  const costEur = estimateCostEur({
    period: currentTariff,
    monthToDateKWh,
    addKWh: kWh,
  });

  return {
    kWh,
    costEur,
    currentTariff,
  };
}
