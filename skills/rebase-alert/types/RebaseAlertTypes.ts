// Rebase Alert Types
// Author: Tentacle OS

export interface RebaseEvent {
  symbol: string;
  timestamp: number;
  oldSupply: number;
  newSupply: number;
  supplyChange: number;
  priceAdjustment: number;
  holdersAffected: number;
}

export interface RebaseToken {
  symbol: string;
  name: string;
  index: string;
  supply: number;
  lastRebase: number;
  rebaseRate: number;
  tracked: boolean;
}

export interface RebaseMetrics {
  symbol: string;
  apy: number;
  dailyYield: number;
  annualized: number;
  volatility: number;
  holderCount: number;
}