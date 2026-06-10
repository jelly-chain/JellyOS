// DCA Types
// Author: Tentacle OS

export interface DCASchedule {
  id: string;
  symbol: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly';
  nextRun: number;
  totalRuns: number;
  status: 'active' | 'paused' | 'cancelled';
}

export interface DCAStatus {
  totalActive: number;
  totalAmount: number;
  nextExecution: number;
}