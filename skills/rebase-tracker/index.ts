// Rebase Tracker - Monitor elastic supply tokens
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { RebaseToken, RebaseEvent, PegStatus } from './types/RebaseTypes';

const logger = new Logger('RebaseTracker');
const metrics = new Metrics();

export class RebaseTracker {
  private tokens: Map<string, RebaseToken> = new Map();

  constructor() {
    this.initializeKnownTokens();
  }

  private initializeKnownTokens(): void {
    this.tokens.set('AMPL', { symbol: 'AMPL', name: 'Ampleforth', targetPrice: 1.0, currentPrice: 0.95 + Math.random() * 0.1, lastRebase: Date.now() - 86400000, rebaseInterval: 86400000, supply: 100000000, yield: 0.05 });
    this.tokens.set('OHM', { symbol: 'OHM', name: 'Olympus DAO', targetPrice: 10.0, currentPrice: 9 + Math.random() * 2, lastRebase: Date.now() - 28800000, rebaseInterval: 28800000, supply: 50000000, yield: 0.15 });
    this.tokens.set('KLIMA', { symbol: 'KLIMA', name: 'KlimaDAO', targetPrice: 1000.0, currentPrice: 900 + Math.random() * 200, lastRebase: Date.now() - 86400000, rebaseInterval: 86400000, supply: 20000000, yield: 0.20 });
  }

  async addToken(symbol: string): Promise<void> {
    if (!this.tokens.has(symbol)) {
      this.tokens.set(symbol, { symbol, name: symbol, targetPrice: 1.0, currentPrice: 1.0, lastRebase: Date.now(), rebaseInterval: 86400000, supply: 0, yield: 0 });
      metrics.increment('rebase.added', 1, { symbol });
    }
  }

  async getPegStatus(symbol: string): Promise<PegStatus> {
    const token = this.tokens.get(symbol);
    if (!token) throw new Error(`Token ${symbol} not tracked`);

    const deviation = Math.abs(token.currentPrice - token.targetPrice) / token.targetPrice;
    const nextRebase = token.lastRebase + token.rebaseInterval;
    const timeUntilRebase = Math.max(0, nextRebase - Date.now());

    return {
      symbol,
      peg: token.targetPrice,
      current: token.currentPrice,
      deviation,
      status: deviation < 0.05 ? 'stable' : deviation < 0.15 ? 'warning' : 'depeg_risk',
      nextRebase,
      timeUntilRebase,
      direction: token.currentPrice < token.targetPrice ? 'expansion' : 'contraction'
    };
  }

  async getRebaseHistory(symbol: string, limit: number = 30): Promise<RebaseEvent[]> {
    const token = this.tokens.get(symbol);
    if (!token) return [];

    const events: RebaseEvent[] = [];
    for (let i = 0; i < limit; i++) {
      events.push({
        timestamp: token.lastRebase - (i * token.rebaseInterval),
        supplyChange: -5 + Math.random() * 10,
        priceImpact: -2 + Math.random() * 4
      });
    }
    return events;
  }

  async getYield(symbol: string): Promise<number> {
    const token = this.tokens.get(symbol);
    return token?.yield || 0;
  }

  close(): void {
    this.tokens.clear();
  }
}

export * from './types/RebaseTypes';
export { createRebaseTracker } from './factory';

export function createRebaseTracker(): RebaseTracker {
  return new RebaseTracker();
}