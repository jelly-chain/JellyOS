// Hedge Types
// Author: Tentacle OS

export interface PortfolioMetrics {
  totalExposure: number;
  netBeta: number;
  concentration: number;
  correlationToMarket: number;
}

export interface HedgeRecommendation {
  action: string;
  side: 'long' | 'short';
  size: number;
  targetAsset: string;
  expectedReduction: number;
  costPerMonth: number;
  confidence: number;
  timestamp: number;
}

export interface CorrelationHedge {
  assetA: string;
  assetB: string;
  correlation: number;
  hedgeRatio: number;
}