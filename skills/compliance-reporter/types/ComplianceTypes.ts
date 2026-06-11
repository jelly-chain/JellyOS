// Compliance Types
// Author: Tentacle OS

export interface TradeRecord {
  date: string;
  symbol: string;
  side: string;
  amount: number;
  price: number;
  fees?: number;
  closed?: boolean;
  realizedPnL?: number;
  holdingDays?: number;
}

export interface TaxSummary {
  year: number;
  totalTrades: number;
  realized: { shortTermGains: number; shortTermLosses: number; longTermGains: number; longTermLosses: number };
  taxableIncome: number;
  estimatedTax: number;
  timestamp: number;
}

export interface ComplianceReport {
  period: string;
  summary: TaxSummary;
  trades: TradeRecord[];
}