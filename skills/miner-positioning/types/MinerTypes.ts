// Miner Types
// Author: Tentacle OS

export interface MinerMetrics {
  hashRate: number;
  difficulty: number;
  blockTime: number;
  avgFee: number;
  minerRevenue: number;
  nextDifficulty: number;
  nextDifficultyChange: number;
  timestamp: number;
}

export interface HashRibbon {
  hashRate30d: number;
  hashRate60d: number;
  signal: 'buy' | 'capitulation' | 'neutral';
  crossover: boolean;
  timestamp: number;
}

export interface HODLWave {
  age: string;
  supply: number;
  percentage: number;
}

export interface CapitulationSignal {
  score: number;
  level: 'low' | 'moderate' | 'high';
  signals: string[];
  timestamp: number;
}