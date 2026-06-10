// Yield Types
// Author: Tentacle OS

export interface YieldOpportunity {
  protocol: string;
  chain: string;
  asset: string;
  apy: number;
  tvl: number;
  risk: RiskScore;
  ilRisk?: number; // Impermanent loss risk for LP
  lastUpdated: number;
}

export interface YieldPosition {
  id: string;
  protocol: string;
  chain: string;
  asset: string;
  amount: number;
  value: number;
  apy: number;
  rewards: TokenReward[];
  depositTime: number;
}

export interface TokenReward {
  symbol: string;
  amount: number;
  value: number;
  apy: number;
}

export interface RiskScore {
  score: number; // 0-10
  auditStatus: 'audited' | 'unaudited';
  ageDays: number;
  tvl: number;
  tvcRatio?: number; // TVL to token circulating ratio
  notes: string[];
}

export interface ILCalculation {
  il: number;
  range: [number, number];
  prices: { upper: number; lower: number; current: number };
}

export interface YieldConfig {
  autoCompound: boolean;
  compoundingFrequency: 'daily' | 'weekly' | 'monthly';
  maxIlRisk: number;
  minApy: number;
  maxTvlRisk: number;
}