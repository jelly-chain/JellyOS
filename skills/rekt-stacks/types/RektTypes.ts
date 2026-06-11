// Rekt Types
// Author: Tentacle OS

export interface ExploitRecord {
  type: 'rug_pull' | 'hack' | 'exploit' | 'exit_scam';
  amount: number;
  date: number;
  protocol: string;
  txHash: string;
}

export interface RektCheck {
  address: string;
  flagged: boolean;
  exploit: ExploitRecord | null;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

export interface RiskScore {
  symbol: string;
  score: number;
  factors: string[];
  recommendation: string;
}