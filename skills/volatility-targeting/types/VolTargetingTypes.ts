// Volatility Targeting Types
// Author: Tentacle OS

export interface PositionSize {
  symbol: string;
  shares: number;
  value: number;
  percentOfPortfolio: number;
  atr: number;
  stopDistance: number;
  riskPercent: number;
}

export interface StopLevel {
  symbol: string;
  entry: number;
  stop: number;
  side: 'long' | 'short';
  atr: number;
  atrMultiplier: number;
  stopDistance: number;
  riskPercent: number;
}

export interface KellyResult {
  fullKelly: number;
  halfKelly: number;
  quarterKelly: number;
  winRate: number;
  winLossRatio: number;
  recommendation: 'fullKelly' | 'halfKelly' | 'quarterKelly' | 'noTrade';
}