// IL Types
// Author: Tentacle OS

export interface ILCalculation {
  il: number;
  priceRatio: number;
  rangeRatio: number;
  inRange: boolean;
  lowerPrice: number;
  upperPrice: number;
  currentPrice: number;
  entryPrice: number;
}

export interface BreakevenAnalysis {
  il: number;
  feeEarned: number;
  netReturn: number;
  breakevenDays: number;
  profitable: boolean;
  feeApy: number;
  daysHeld: number;
}

export interface HedgeRecommendation {
  hedge: 'none' | 'put_option' | 'call_option' | 'perp_short' | 'options_spread';
  cost: number;
  reason: string;
}