export type ChallengeStatus = 'idle' | 'active' | 'success' | 'failed';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  status: ChallengeStatus;
  startedAt?: number;
  endsAt?: number;
  baselineLoadW: number;
  targetReductionW: number; // success if currentLoad <= baselineLoad - targetReductionW
  pointsReward: number;
  
  // Energy tracking during active challenge
  challengeKWh?: number; // accumulated kWh since challenge started
  challengeCostEur?: number; // accumulated cost with tariff switching
};


