// Sniper Types
// Author: Tentacle OS

export interface SniperSignal {
  symbol: string;
  direction: 'long' | 'short';
  entry: number;
  stop: number;
  target: number;
  confidence: number;
  reasons: string[];
  timestamp: number;
}

export interface ConfluenceCheck {
  score: number;
  direction: 'long' | 'short';
  price: number;
  stop: number;
  target: number;
  reasons: string[];
}