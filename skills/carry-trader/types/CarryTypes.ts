// Carry Types
// Author: Tentacle OS

export interface FundingRate {
  symbol: string;
  rate: number;
  nextFunding: number;
  predicted: number;
  exchanges: Record<string, number>;
}

export interface BasisData {
  symbol: string;
  spot: number;
  perp: number;
  spread: number;
  annualized: number;
  daysToExpiry: number;
}

export interface CarryOpportunity {
  symbol: string;
  type: 'funding_arb' | 'basis_trade' | 'yield_carry';
  apy: number;
  direction: string;
  risk: 'low' | 'medium' | 'high';
  exchanges: string[];
  confidence: number;
}

export interface CarryPosition {
  id: string;
  symbol: string;
  type: string;
  amount: number;
  entryTime: number;
  pnl: number;
  status: 'open' | 'closed';
}