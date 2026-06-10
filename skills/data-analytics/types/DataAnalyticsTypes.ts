// Data Analytics Types
// Author: Tentacle OS

export interface SentimentScore {
  symbol: string;
  score: number; // -100 to +100
  sources: SentimentSource[];
  dominant: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0-100
}

export interface SentimentSource {
  source: string;
  score: number;
  volume: number;
  timestamp: number;
}

export interface PatternSignal {
  pattern: string;
  signal: 'buy' | 'sell' | 'neutral';
  confidence: number;
  timeframe: string;
  description: string;
}

export interface ExchangeFlow {
  exchange: string;
  symbol: string;
  flow: number; // positive = inflow, negative = outflow
  usdValue: number;
  timestamp: number;
}

export interface SocialVolume {
  symbol: string;
  platform: string;
  volume: number;
  change24h: number;
  timestamp: number;
}