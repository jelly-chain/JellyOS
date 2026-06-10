// Volatility Surfer Types
// Author: Tentacle OS

export interface IVData {
  symbol: string;
  currentIV: number;
  historicalIV: number[];
  ivRank: number;
  ivPercentile: number;
  termStructure: number[];
  skew: number;
  timestamp: number;
}

export type VolatilityState = 'low' | 'normal' | 'elevated' | 'high';

export interface VolatilityRegime {
  state: VolatilityState;
  iv: number;
  rank: number;
  timestamp: number;
}

export interface OptionsStrategy {
  type: 'long_straddle' | 'long_strangle' | 'short_straddle' | 'short_strangle' | 'calendar_spread' | 'iron_condor';
  strikes: string[];
  expiry: string;
  confidence: number;
  rationale: string;
}