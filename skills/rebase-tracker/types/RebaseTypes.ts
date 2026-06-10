// Rebase Types
// Author: Tentacle OS

export interface RebaseToken {
  symbol: string;
  name: string;
  targetPrice: number;
  currentPrice: number;
  lastRebase: number;
  rebaseInterval: number;
  supply: number;
  yield: number;
}

export interface RebaseEvent {
  timestamp: number;
  supplyChange: number;
  priceImpact: number;
}

export interface PegStatus {
  symbol: string;
  peg: number;
  current: number;
  deviation: number;
  status: 'stable' | 'warning' | 'depeg_risk';
  nextRebase: number;
  timeUntilRebase: number;
  direction: 'expansion' | 'contraction';
}