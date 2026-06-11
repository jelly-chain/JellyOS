// Sandwich Types
// Author: Tentacle OS

export interface SandwichAlert {
  victimTx: string;
  frontTx: string;
  backTx: string;
  attacker: string;
  profit: number;
  token: string;
  dex: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
}

export interface SandwichPattern {
  type: 'sandwich' | 'frontrun' | 'backrun';
  confidence: number;
  estimatedProfit: number;
}

export interface AttackerProfile {
  address: string;
  totalSandwiches: number;
  totalProfit: number;
  avgProfit: number;
  favoriteDex: string;
  firstSeen: number;
  lastActive: number;
}