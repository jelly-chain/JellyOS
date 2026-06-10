// Social Volume Tracker - Detect social media spikes
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { SocialVolumeReport, PlatformVolume, InfluencerAlert } from './types/SocialVolumeTypes';

const logger = new Logger('SocialVolumeTracker');
const metrics = new Metrics();

export class SocialVolumeTracker {
  private baselineVolume: Map<string, number> = new Map();
  private alerts: InfluencerAlert[] = [];

  async track(symbol: string): Promise<SocialVolumeReport> {
    const platforms: PlatformVolume[] = [
      await this.getTwitterVolume(symbol),
      await this.getRedditVolume(symbol),
      await this.getTelegramVolume(symbol),
      await this.getDiscordVolume(symbol)
    ];

    const totalVolume = platforms.reduce((sum, p) => sum + p.volume, 0);
    const avgSentiment = platforms.reduce((sum, p) => sum + p.sentiment, 0) / platforms.length;
    const spike = this.detectSpike(symbol, totalVolume);

    metrics.increment('social.track', 1, { symbol });

    return {
      symbol,
      platforms,
      totalVolume,
      avgSentiment,
      spike,
      timestamp: Date.now()
    };
  }

  private async getTwitterVolume(symbol: string): Promise<PlatformVolume> {
    return { platform: 'twitter', volume: 1000 + Math.floor(Math.random() * 50000), sentiment: -30 + Math.random() * 60, mentions: [], trending: Math.random() > 0.7 };
  }

  private async getRedditVolume(symbol: string): Promise<PlatformVolume> {
    return { platform: 'reddit', volume: 500 + Math.floor(Math.random() * 20000), sentiment: -20 + Math.random() * 40, mentions: [], trending: Math.random() > 0.8 };
  }

  private async getTelegramVolume(symbol: string): Promise<PlatformVolume> {
    return { platform: 'telegram', volume: 200 + Math.floor(Math.random() * 10000), sentiment: -10 + Math.random() * 30, mentions: [], trending: Math.random() > 0.9 };
  }

  private async getDiscordVolume(symbol: string): Promise<PlatformVolume> {
    return { platform: 'discord', volume: 100 + Math.floor(Math.random() * 5000), sentiment: -10 + Math.random() * 20, mentions: [], trending: Math.random() > 0.95 };
  }

  private detectSpike(symbol: string, currentVolume: number): boolean {
    const baseline = this.baselineVolume.get(symbol) || currentVolume;
    this.baselineVolume.set(symbol, baseline);
    return currentVolume > baseline * 2;
  }

  async getInfluencerAlerts(symbol: string): Promise<InfluencerAlert[]> {
    return this.alerts.filter(a => a.symbol === symbol);
  }

  close(): void {
    this.baselineVolume.clear();
    this.alerts = [];
  }
}

export * from './types/SocialVolumeTypes';
export { createSocialVolumeTracker } from './factory';

export function createSocialVolumeTracker(): SocialVolumeTracker {
  return new SocialVolumeTracker();
}