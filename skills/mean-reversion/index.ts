// Mean Reversion - Statistical trading
// Author: Tentacle OS
import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('MeanReversion');

export class MeanReversionTrader {
  analyze(prices: number[]): { signal: string; zscore: number } {
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const std = Math.sqrt(prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length);
    const current = prices[prices.length - 1];
    const zscore = (current - mean) / std;

    const signal = zscore < -2 ? 'long' : zscore > 2 ? 'short' : 'neutral';

    return { signal, zscore };
  }

  close(): void {}
}