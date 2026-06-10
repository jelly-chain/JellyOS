// Whale Momentum Types
// Author: Tentacle OS

export interface WhaleActivity {
  wallet: string;
  action: 'buy' | 'sell';
  token: string;
  amount: number;
  usdValue: number;
  timestamp: number;
}

export interface WhaleMomentum {
  symbol: string;
  score: number;
  accumulation: number;
  distribution: number;
  netFlow: number;
  direction: 'accumulation' | 'distribution';
  activities: WhaleActivity[];
  timestamp: number;
}

export interface ExchangeFlow {
  symbol: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  exchanges: Record<string, { inflow: number; outflow: number }>;
  timestamp: number;
}