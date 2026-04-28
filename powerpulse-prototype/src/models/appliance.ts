export type Appliance = {
  id: string;
  name: string;
  wattage: number; // W
  isOn: boolean;
  /**
   * Accumulated usage time for "today" in minutes.
   * We keep minutes to avoid floating point drift and convert to hours when needed.
   */
  todayMinutes: number;
  createdAt: number;
};

