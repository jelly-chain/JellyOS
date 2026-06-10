// Pairs Trading Types
// Author: Tentacle OS

export interface PairSignal {
  pair: string;
  symbolA: string;
  symbolB: string;
  correlation: number;
  cointegration: boolean;
  hedgeRatio: number;
  zscore: number;
  signal: 'long' | 'short' | 'neutral';
  confidence: number;
}

export interface CointegrationResult {
  isCointegrated: boolean;
  hedgeRatio: number;
  pValue: number;
}

export interface PairPosition {
  pair: string;
  entryZscore: number;
  exitZscore: number;
  side: 'long' | 'short';
  size: number;
  status: 'open' | 'closed';
}