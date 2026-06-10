// DCA Planner Types
// Author: Tentacle OS

export interface DCAPlan {
  id: string;
  symbol: string;
  totalAmount: number;
  amountPerPeriod: number;
  interval: 'daily' | 'weekly' | 'monthly';
  periods: number;
  startDate: number;
  endDate: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface DCAComparison {
  symbol: string;
  amount: number;
  periodDays: number;
  lumpSum: { return: number; finalValue: number };
  dca: { return: number; finalValue: number };
  winner: 'lump_sum' | 'dca';
  difference: number;
  timestamp: number;
}

export interface DCAResult {
  symbol: string;
  interval: string;
  periods: number;
  amountPerPeriod: number;
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  avgPeriodReturn: number;
  bestPeriod: number;
  worstPeriod: number;
  timestamp: number;
}