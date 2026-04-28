import { create } from 'zustand/index.js';
import { persist, createJSONStorage } from 'zustand/middleware.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Appliance } from '../models/appliance';
import type { Challenge } from '../models/challenge';
import type { RewardsState } from '../models/rewards';
import { totalLoadW, todayEnergyKWh, applianceEnergyKWh } from '../utils/energy';
import { estimateCostEur, getTariffPeriod } from '../utils/tariffs';
import { toISODate } from '../utils/time';

type HouseholdProfile = {
  name: string;
  members: number;
};

type DailyPoint = { dateISO: string; kWh: number };

type AppState = {
  household: HouseholdProfile;
  appliances: Appliance[];

  // Usage tracking
  monthToDateKWh: number;
  dailyHistory: DailyPoint[]; // last N days

  // Rewards & challenges
  rewards: RewardsState;
  challenge: Challenge;

  // UI / settings
  notificationsEnabled: boolean;

  // Derived helpers (computed at read-time)
  getTotalLoadW: () => number;
  getTodayKWh: () => number;
  getEstimatedCostEurToday: () => number;
  getTariffPeriod: () => 'day' | 'night';
  getMostConsumingAppliance: () => Appliance | undefined;

  // Actions
  setHousehold: (profile: Partial<HouseholdProfile>) => void;
  toggleAppliance: (id: string) => void;
  tickMinute: () => void;
  addAppliance: (input: { name: string; wattage: number }) => void;
  removeAppliance: (id: string) => void;
  updateAppliance: (id: string, patch: Partial<Pick<Appliance, 'name' | 'wattage'>>) => void;

  startChallenge: () => void;
  completeChallengeIfEligible: () => boolean;

  setNotificationsEnabled: (v: boolean) => void;
  resetAll: () => void;
};

const PRELOAD: Array<{ name: string; wattage: number }> = [
  { name: 'Washing Machine', wattage: 900 },
  { name: 'Dishwasher', wattage: 1800 },
  { name: 'Refrigerator', wattage: 500 },
  { name: 'TV', wattage: 100 },
  { name: 'Kettle', wattage: 1500 },
  { name: 'Lights', wattage: 10 },
  { name: 'Laptop', wattage: 70 },
];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function initialAppliances(): Appliance[] {
  const now = Date.now();
  return PRELOAD.map((p) => ({
    id: uid(),
    name: p.name,
    wattage: p.wattage,
    isOn: p.name === 'Refrigerator', // realistic default
    todayMinutes: 0,
    createdAt: now,
  }));
}

function initialRewards(): RewardsState {
  return {
    points: 0,
    streakDays: 0,
    badges: {
      starter: true,
      saver_100: false,
      streak_3: false,
      streak_7: false,
    },
  };
}

function initialChallenge(): Challenge {
  return {
    id: 'peak-1',
    title: 'Peak Alert: Reduce Load (30 min)',
    description:
      'A grid peak event is happening. Reduce your active load to earn points.',
    status: 'idle',
    baselineLoadW: 0,
    targetReductionW: 300, // reduce at least 300W
    pointsReward: 50,
  };
}

const STORAGE_KEY = 'powerpulse_kosovo_v1';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      household: { name: 'My Home', members: 3 },
      appliances: initialAppliances(),
      monthToDateKWh: 0,
      dailyHistory: [],
      rewards: initialRewards(),
      challenge: initialChallenge(),
      notificationsEnabled: true,

      getTotalLoadW: () => totalLoadW(get().appliances),
      getTodayKWh: () => todayEnergyKWh(get().appliances),
      getTariffPeriod: () => getTariffPeriod(),
      getEstimatedCostEurToday: () => {
        const kWh = get().getTodayKWh();
        const period = get().getTariffPeriod();
        return estimateCostEur({
          period,
          monthToDateKWh: get().monthToDateKWh,
          addKWh: kWh,
        });
      },
      getMostConsumingAppliance: () => {
        const aps = get().appliances;
        if (aps.length === 0) return undefined;
        return aps
          .slice()
          .sort((a, b) => applianceEnergyKWh(b) - applianceEnergyKWh(a))[0];
      },

      setHousehold: (profile) =>
        set((s) => ({ household: { ...s.household, ...profile } })),

      toggleAppliance: (id) =>
        set((s) => ({
          appliances: s.appliances.map((a) =>
            a.id === id ? { ...a, isOn: !a.isOn } : a
          ),
        })),

      /**
       * Simulate real-time usage: every minute, active appliances accumulate 1 minute.
       * This keeps the prototype "alive" without needing background services.
       */
      tickMinute: () =>
        set((s) => ({
          appliances: s.appliances.map((a) =>
            a.isOn ? { ...a, todayMinutes: a.todayMinutes + 1 } : a
          ),
        })),

      addAppliance: (input) =>
        set((s) => ({
          appliances: [
            {
              id: uid(),
              name: input.name.trim() || 'New Appliance',
              wattage: Math.max(1, Math.round(input.wattage)),
              isOn: false,
              todayMinutes: 0,
              createdAt: Date.now(),
            },
            ...s.appliances,
          ],
        })),

      removeAppliance: (id) =>
        set((s) => ({ appliances: s.appliances.filter((a) => a.id !== id) })),

      updateAppliance: (id, patch) =>
        set((s) => ({
          appliances: s.appliances.map((a) =>
            a.id !== id
              ? a
              : {
                  ...a,
                  name:
                    patch.name !== undefined ? patch.name.trim() || a.name : a.name,
                  wattage:
                    patch.wattage !== undefined
                      ? Math.max(1, Math.round(patch.wattage))
                      : a.wattage,
                }
          ),
        })),

      startChallenge: () =>
        set((s) => {
          const baseline = totalLoadW(s.appliances);
          const now = Date.now();
          return {
            challenge: {
              ...s.challenge,
              status: 'active',
              baselineLoadW: baseline,
              startedAt: now,
              endsAt: now + 30 * 60 * 1000, // 30 minutes
            },
          };
        }),

      /**
       * Success when current load <= baseline - targetReductionW before end time.
       * Returns true if it transitions to success and grants reward.
       */
      completeChallengeIfEligible: () => {
        const s = get();
        const c = s.challenge;
        if (c.status !== 'active') return false;
        const now = Date.now();
        if (c.endsAt && now > c.endsAt) {
          set({ challenge: { ...c, status: 'failed' } });
          return false;
        }

        const current = s.getTotalLoadW();
        const success = current <= c.baselineLoadW - c.targetReductionW;
        if (!success) return false;

        const todayISO = toISODate(new Date());
        set((prev) => {
          const prevISO = prev.rewards.lastSuccessDateISO;
          let streak = prev.rewards.streakDays;
          if (!prevISO) {
            streak = 1;
          } else {
            const prevDate = new Date(prevISO + 'T00:00:00');
            const todayDate = new Date(todayISO + 'T00:00:00');
            const diffDays = Math.round(
              (todayDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
            );
            if (diffDays === 0) {
              // same day, keep streak
            } else if (diffDays === 1) {
              streak = streak + 1;
            } else {
              streak = 1;
            }
          }

          const points = prev.rewards.points + c.pointsReward;
          const badges = { ...prev.rewards.badges };
          if (points >= 100) badges.saver_100 = true;
          if (streak >= 3) badges.streak_3 = true;
          if (streak >= 7) badges.streak_7 = true;

          return {
            challenge: { ...prev.challenge, status: 'success' },
            rewards: {
              ...prev.rewards,
              points,
              streakDays: streak,
              lastSuccessDateISO: todayISO,
              badges,
            },
          };
        });
        return true;
      },

      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),

      resetAll: () =>
        set(() => ({
          household: { name: 'My Home', members: 3 },
          appliances: initialAppliances(),
          monthToDateKWh: 0,
          dailyHistory: [],
          rewards: initialRewards(),
          challenge: initialChallenge(),
          notificationsEnabled: true,
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        household: s.household,
        appliances: s.appliances,
        monthToDateKWh: s.monthToDateKWh,
        dailyHistory: s.dailyHistory,
        rewards: s.rewards,
        challenge: s.challenge,
        notificationsEnabled: s.notificationsEnabled,
      }),
    }
  )
);

