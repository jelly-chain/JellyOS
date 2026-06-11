// Rebase Alert - Monitor supply changes
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { RebaseEvent, RebaseToken, RebaseMetrics } from './types/RebaseAlertTypes';

const logger = new Logger('RebaseAlert');
const metrics = new Metrics();

export class RebaseAlert {
  private tokens: Map<string, RebaseToken> = new Map();
  private alerts: RebaseEvent[] = [];

  constructor() {
    this.initializeTokens();
  }

  private initializeTokens(): void {
    this.tokens.set('OHM', { symbol: 'OHM', name: 'OlympusDAO', index: 'INDEX', supply: 1000000, lastRebase: 0, rebaseRate: 0.004, tracked: true });
    this.tokens.set('stETH', { symbol: 'stETH', name: 'Lido staked ETH', index: 'ETH', supply: 5000000, lastRebase: 0, rebaseRate: 0.0001, tracked: true });
    this.tokens.set('sUSDS', { symbol: 'sUSDS', name: 'Synthetix USDS', index: 'USDS', supply: 100000000, lastRebase: 0, rebaseRate: 0.003, tracked: true });
  }

  async monitor(symbol: string): Promise<RebaseEvent | null> {
    const token = this.tokens.get(symbol);
    if (!token || !token.tracked) return null;

    const rebaseOccurred = Math.random() > 0.8;
    if (rebaseOccurred) {
      const event: RebaseEvent = {
        symbol,
        timestamp: Date.now(),
        oldSupply: token.supply,
        newSupply: token.supply * (1 + token.rebaseRate),
        supplyChange: token.rebaseRate,
        priceAdjustment: -token.rebaseRate,
        holdersAffected: 5000 + Math.floor(Math.random() * 50000)
      };

      this.alerts.push(event);
      token.lastRebase = Date.now();
      metrics.increment('rebase.detected', 1, { symbol });

      return event;
    }
    return null;
  }

  async track(symbol: string): void {
    let token = this.tokens.get(symbol);
    if (!token) {
      token = { symbol, name: symbol, index: 'INDEX', supply: 1000000, lastRebase: Date.now(), rebaseRate: 0.002, tracked: true } as RebaseToken;
      this.tokens.set(symbol, token);
    } else {
      token.tracked = true;
    }
    metrics.increment('rebase.tracked', 1, { symbol });
  }

  async untrack(symbol: string): void {
    const token = this.tokens.get(symbol);
    if (token) token.tracked = false;
  }

  async getMetrics(symbol: string): Promise<RebaseMetrics> {
    const token = this.tokens.get(symbol);
    if (!token) throw new Error('Token not found');

    return {
      symbol,
      apy: token.rebaseRate * 365 * 100,
      dailyYield: token.rebaseRate * 100,
      annualized: token.rebaseRate * 365,
      volatility: 0.1 + Math.random() * 0.2,
      holderCount: 10000 + Math.floor(Math.random() * 100000)
    };
  }

  close(): void { this.tokens.clear(); this.alerts = []; }
}

export * from './types/RebaseAlertTypes';
export { createRebaseAlert } from './factory';

export function createRebaseAlert(): RebaseAlert {
  return new RebaseAlert();
}