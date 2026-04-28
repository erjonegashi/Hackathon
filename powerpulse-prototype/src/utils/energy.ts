import type { Appliance } from '../models/appliance';

export function totalLoadW(appliances: Appliance[]) {
  return appliances.reduce((sum, a) => sum + (a.isOn ? a.wattage : 0), 0);
}

/**
 * Convert W and minutes to kWh.
 * kWh = (W * hours) / 1000 = (W * minutes) / (1000 * 60)
 */
export function energyKWhFromWattsMinutes(watts: number, minutes: number) {
  return (watts * minutes) / (1000 * 60);
}

export function todayEnergyKWh(appliances: Appliance[]) {
  return appliances.reduce((sum, a) => sum + energyKWhFromWattsMinutes(a.wattage, a.todayMinutes), 0);
}

export function applianceEnergyKWh(a: Appliance) {
  return energyKWhFromWattsMinutes(a.wattage, a.todayMinutes);
}

