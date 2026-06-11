// Flash Loan Types
// Author: Tentacle OS

export interface FlashLoan {
  id: string;
  protocol: string;
  token: string;
  amount: number;
  borrower: string;
  fee: number;
  profit: number;
  blockNumber: number;
  txHash: string;
  timestamp: number;
  manipulation: boolean;
}

export interface FlashLoanAnalysis {
  totalLoans: number;
  totalVolume: number;
  avgSize: number;
  profitableLoans: number;
  profitRate: number;
  totalProfit: number;
  manipulationAttempts: number;
  topProtocols: Record<string, number>;
  timestamp: number;
}