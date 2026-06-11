// Blacklist Types
// Author: Tentacle OS

export interface SanctionEntry {
  address: string;
  type: 'ofac' | 'scam' | 'hack' | 'darknet' | 'terrorism';
  reason: string;
  source: 'database' | 'user';
  addedAt: number;
}

export interface BlacklistResult {
  address: string;
  flagged: boolean;
  entry: SanctionEntry | null;
  risk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}