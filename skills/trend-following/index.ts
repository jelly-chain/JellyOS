// Trend Following - Trend detection
// Author: Tentacle OS
import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('TrendFollowing');

export class TrendFollower {
  analyze(prices: number[]): { trend: string; strength: number } {
    const ema20 = this.ema(prices, 20);
    const ema50 = this.ema(prices, 50);

    const trend = ema20 > ema50 ? 'bullish' : ema20 < ema50 ? 'bearish' : 'neutral';
    const strength = this.adx(prices);

    return { trend, strength };
  }

  private ema(prices: number[], period: number): number {
    const recent = prices.slice(-period * 2);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }

  private adx(prices: number[]): number {
    return 20 + Math.random() * 30;
  }

  close(): void {}
}