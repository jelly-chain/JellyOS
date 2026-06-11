// Social Sentiment Types
// Author: Tentacle OS

export interface SentimentScore {
  symbol: string;
  twitter: number;
  reddit: number;
  telegram: number;
  overall: number;
  bullishPercent: number;
  bearishPercent: number;
  timestamp: number;
}

export type SocialPlatform = 'twitter' | 'reddit' | 'telegram' | 'youtube' | 'tiktok';

export interface NarrativeTrend {
  topic: string;
  sentiment: number;
  tweetVolume: number;
  growth: number;
}

export interface SocialSignal {
  symbol: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  source: SocialPlatform;
  timestamp: number;
}