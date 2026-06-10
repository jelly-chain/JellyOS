// Correlation Matrix Types
// Author: Tentacle OS

export interface CorrelationMatrix {
  symbols: string[];
  matrix: Record<string, Record<string, number>>;
  timestamp: number;
}

export interface HedgeRatio {
  symbolA: string;
  symbolB: string;
  beta: number;
  method: 'ols' | 'kalman';
  timestamp: number;
}

export interface DiversificationScore {
  score: number;
  avgCorrelation: number;
  portfolioVariance: number;
  effectiveN: number;
  timestamp: number;
}