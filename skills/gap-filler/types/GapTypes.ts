// Gap Types
// Author: Tentacle OS

export interface PriceGap {
  symbol: string;
  type: 'gap_up' | 'gap_down';
  size: number;
  percent: number;
  openPrice: number;
  closePrice: number;
  timestamp: number;
  filled: boolean;
  fillTime: number | null;
}

export interface GapAnalysis {
  symbol: string;
  totalGaps: number;
  unfilled: number;
  filled: number;
  fillRate: number;
  avgFillTime: number;
  avgGapSize: number;
  largestUnfilled: number;
  gaps: PriceGap[];
}

export interface GapFillStats {
  symbol: string;
  totalGaps: number;
  fillRate: number;
  avgFillHours: number;
  profitFactor: number;
  winRate: number;
  avgReturn: number;
}