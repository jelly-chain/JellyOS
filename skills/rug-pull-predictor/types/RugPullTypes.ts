// Rug Pull Types
// Author: Tentacle OS

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number;
}

export interface TokenAudit {
  tokenAddress: string;
  chain: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  recommendation: 'OK' | 'CAUTION' | 'AVOID';
  timestamp: number;
}

export interface RugRisk {
  address: string;
  score: number;
  level: string;
}