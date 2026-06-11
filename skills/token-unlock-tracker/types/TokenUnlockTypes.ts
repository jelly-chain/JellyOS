// Token Unlock Types
// Author: Tentacle OS

export interface VestingSchedule {
  symbol: string;
  totalSupply: number;
  circulating: number;
  nextUnlock: number;
  nextUnlockAmount: number;
  nextUnlockPercent: number;
  recipients: string[];
}

export interface UnlockEvent {
  symbol: string;
  date: number;
  amount: number;
  percent: number;
  recipients: string[];
  impact: UnlockImpact;
}

export interface UnlockImpact {
  sellPressure: number;
  estimatedPriceImpact: number;
  risk: 'low' | 'medium' | 'high';
}