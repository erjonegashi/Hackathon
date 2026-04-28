export type BadgeId = 'starter' | 'saver_100' | 'streak_3' | 'streak_7';

export type RewardsState = {
  points: number;
  streakDays: number;
  lastSuccessDateISO?: string; // YYYY-MM-DD
  badges: Record<BadgeId, boolean>;
};

