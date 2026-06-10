// Breakout Detector - Breakout identification
// Author: Tentacle OS
import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('BreakoutDetector');

export class BreakoutDetector {
  detect(prices: number[], volumes: number[]): { breakout: string; confirmed: boolean } {
    const maxHigh = Math.max(...prices.slice(-50));
    const current = prices[prices.length - 1];
    const volAvg = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const volCurrent = volumes[volumes.length - 1];

    const breakout = current > maxHigh * 1.02 ? 'up' : current < maxHigh * 0.98 ? 'down' : 'none';
    const confirmed = volCurrent > volAvg * 1.5;

    return { breakout, confirmed };
  }

  close(): void {}
}