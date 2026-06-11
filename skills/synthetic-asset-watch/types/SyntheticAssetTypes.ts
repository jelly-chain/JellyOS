// Synthetic Asset Types
// Author: Tentacle OS

export interface SyntheticAsset {
  symbol: string;
  name: string;
  underlying: string;
  peg: number;
  currentPrice: number;
  collateralRatio: number;
  depegThreshold: number;
}

export interface PegStatus {
  symbol: string;
  name: string;
  underlying: string;
  peg: number;
  currentPrice: number;
  deviation: number;
  status: 'stable' | 'warning' | 'depeg';
  collateralRatio: number;
  timestamp: number;
}

export interface ArbitrageSignal {
  symbol: string;
  type: string;
  spread: number;
  estimatedProfit: number;
  confidence: number;
  timestamp: number;
}