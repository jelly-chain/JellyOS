// Honeypot Types
// Author: Tentacle OS

export interface SellTest {
  sellBlocked: boolean;
  taxPercent: number;
  buySuccess: boolean;
  sellSuccess: boolean;
  simulatedProfit: number;
  passed: boolean;
}

export interface ContractRisk {
  hasBlacklist: boolean;
  hasPause: boolean;
  hasMint: boolean;
  hasFreeze: boolean;
  hasProxy: boolean;
  riskScore: number;
  riskFactors: string[];
}

export interface HoneypotResult {
  contractAddress: string;
  chain: string;
  isHoneypot: boolean;
  sellTest: SellTest;
  contractRisk: ContractRisk;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}