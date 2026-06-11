// Whale Alert Types
// Author: Tentacle OS

export interface WhaleTransaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  token: string;
  chain: string;
  timestamp: number;
  type: 'buy' | 'sell' | 'transfer';
  sizeRank: 'small' | 'medium' | 'large' | 'mega' | 'kraken';
  impact: number;
}

export interface WhaleAddress {
  address: string;
  label?: string;
  addedAt: number;
  txCount: number;
  totalValue: number;
}

export interface AlertThreshold {
  minAmount: number;
  maxAmount: number;
  minUSD: number;
}

export interface WhaleMetrics {
  address: string;
  avgTxSize: number;
  txFrequency: number;
  buySellRatio: number;
  netFlow: number;
  lastActive: number;
}