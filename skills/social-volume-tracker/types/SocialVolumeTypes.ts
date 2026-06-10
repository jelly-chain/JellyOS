// Social Volume Types
// Author: Tentacle OS

export interface PlatformVolume {
  platform: string;
  volume: number;
  sentiment: number;
  mentions: string[];
  trending: boolean;
}

export interface SocialVolumeReport {
  symbol: string;
  platforms: PlatformVolume[];
  totalVolume: number;
  avgSentiment: number;
  spike: boolean;
  timestamp: number;
}

export interface InfluencerAlert {
  symbol: string;
  influencer: string;
  platform: string;
  sentiment: 'bullish' | 'bearish';
  followers: number;
  timestamp: number;
}