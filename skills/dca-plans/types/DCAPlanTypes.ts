// DCA Plan Types
// Author: Tentacle OS

export interface DCASchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  nextRun: number;
  remainingBudget: number;
  totalBudget: number;
  completedBuys: number;
}

export interface DCAPlan {
  id: string;
  symbol: string;
  budget: number;
  schedule: DCASchedule;
  targetAllocation: number;
  currentHolding: number;
  createdAt: number;
}

export interface DCAExecution {
  planId: string;
  symbol: string;
  amount: number;
  price: number;
  timestamp: number;
  status: 'executed' | 'pending' | 'failed';
}

export interface PortfolioTarget {
  symbol: string;
  targetWeight: number;
  currentWeight: number;
  difference: number;
}