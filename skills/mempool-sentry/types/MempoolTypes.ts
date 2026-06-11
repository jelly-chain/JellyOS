// Mempool Types
// Author: Tentacle OS

export interface PendingTx {
  hash: string;
  from: string;
  to: string;
  value: number;
  gasPrice: number;
  method: string;
  dex: string;
  timestamp: number;
}

export interface MEVOpportunity {
  type: 'sandwich' | 'arb' | 'liquidation';
  targetTx: string;
  profit: number;
  gasRequired: number;
  confidence: number;
  timestamp: number;
}

export interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
  baseFee: number;
  timestamp: number;
}