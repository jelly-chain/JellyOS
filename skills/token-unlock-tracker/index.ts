// Token Unlock Tracker
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { UnlockEvent, VestingSchedule, UnlockImpact } from './types/TokenUnlockTypes';

const logger = new Logger('TokenUnlockTracker');
const metrics = new Metrics();

export class TokenUnlockTracker {
  private tokens: Map<string, VestingSchedule> = new Map();

  constructor() {
    this.initializeTokens();
  }

  private initializeTokens(): void {
    this.tokens.set('ARB', { symbol: 'ARB', totalSupply: 10000000000, circulating: 3500000000, nextUnlock: Date.now() + 86400000 * 7, nextUnlockAmount: 100000000, nextUnlockPercent: 2.86, recipients: ['Team', 'Investors'] });
    this.tokens.set('OP', { symbol: 'OP', totalSupply: 4294967296, circulating: 1200000000, nextUnlock: Date.now() + 86400000 * 14, nextUnlockAmount: 50000000, nextUnlockPercent: 4.17, recipients: ['Core Contributors'] });
    this.tokens.set('APT', { symbol: 'APT', totalSupply: 10000000000, circulating: 4000000000, nextUnlock: Date.now() + 86400000 * 30, nextUnlockAmount: 200000000, nextUnlockPercent: 5.0, recipients: ['Foundation', 'Staking'] });
  }

  async getUpcoming(days: number = 30): Promise<UnlockEvent[]> {
    const events: UnlockEvent[] = [];
    const cutoff = Date.now() + days * 86400000;

    for (const [symbol, schedule] of this.tokens) {
      if (schedule.nextUnlock <= cutoff) {
        events.push({
          symbol,
          date: schedule.nextUnlock,
          amount: schedule.nextUnlockAmount,
          percent: schedule.nextUnlockPercent,
          recipients: schedule.recipients,
          impact: this.estimateImpact(schedule)
        });
      }
    }

    return events.sort((a, b) => a.date - b.date);
  }

  private estimateImpact(schedule: VestingSchedule): UnlockImpact {
    const sellPressure = schedule.nextUnlockPercent * 0.3;
    const priceImpact = -sellPressure * 0.5;

    return {
      sellPressure,
      estimatedPriceImpact: priceImpact,
      risk: schedule.nextUnlockPercent > 5 ? 'high' : schedule.nextUnlockPercent > 2 ? 'medium' : 'low'
    };
  }

  async addToken(symbol: string, totalSupply: number, circulating: number): Promise<void> {
    this.tokens.set(symbol, { symbol, totalSupply, circulating, nextUnlock: 0, nextUnlockAmount: 0, nextUnlockPercent: 0, recipients: [] });
    metrics.increment('unlock.added', 1, { symbol });
  }

  close(): void { this.tokens.clear(); }
}

export * from './types/TokenUnlockTypes';


export { createTokenUnlockTracker } from './factory';
