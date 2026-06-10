// Security Types
// Author: Tentacle OS

export interface SecurityReport {
  address: string;
  chain: string;
  risk: RiskScore;
  honeypot: boolean;
  ownershipRenounced: boolean;
  liquidityLocked: boolean;
  audits: string[];
  sanctionsFlag: boolean;
  timestamp: number;
}

export interface RiskScore {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  notes: string[];
}

export interface HoneypotCheck {
  isHoneypot: boolean;
  testTx: string;
  reason?: string;
}