// Yield Aggregator Types
// Author: Tentacle OS

export interface YieldOpportunity {
  protocol: string;
  asset: string;
  apy: number;
  netApy: number;
  tvl: number;
  risk: number;
  gasCost: number;
  chain: string;
  type: string;
  lastUpdated: number;
}

export interface YieldScanResult {
  asset: string;
  opportunities: YieldOpportunity[];
  best: YieldOpportunity;
  timestamp: number;
}