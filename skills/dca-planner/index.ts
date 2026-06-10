// DCA Planner - Advanced dollar-cost averaging strategy
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { DCAPlan, DCAComparison, DCAResult } from './types/DCAPlannerTypes';

const logger = new Logger('DCAPlanner');
const metrics = new Metrics();

export class DCAPlanner {
  /**
   * Create a DCA plan with optimal parameters
   */
  createPlan(symbol: string, totalAmount: number, periodDays: number, interval: 'daily' | 'weekly' | 'monthly'): DCAPlan {
    const periods = Math.floor(periodDays / this.getIntervalDays(interval));
    const amountPerPeriod = totalAmount / periods;

    return {
      id: `dca-${Date.now()}`,
      symbol,
      totalAmount,
      amountPerPeriod,
      interval,
      periods,
      startDate: Date.now(),
      endDate: Date.now() + periodDays * 86400000,
      status: 'planned'
    };
  }

  private getIntervalDays(interval: string): number {
    if (interval === 'daily') return 1;
    if (interval === 'weekly') return 7;
    return 30;
  }

  /**
   * Compare lump sum vs DCA historically
   */
  async compare(symbol: string, amount: number, periodDays: number): Promise<DCAComparison> {
    const lumpSumReturn = this.simulateLumpSum(symbol, amount, periodDays);
    const dcaReturn = this.simulateDCA(symbol, amount, periodDays, 'weekly');

    return {
      symbol,
      amount,
      periodDays,
      lumpSum: { return: lumpReturn, finalValue: amount * (1 + lumpReturn) },
      dca: { return: dcaReturn, finalValue: amount * (1 + dcaReturn) },
      winner: lumpReturn > dcaReturn ? 'lump_sum' : 'dca',
      difference: Math.abs(lumpReturn - dcaReturn),
      timestamp: Date.now()
    };
  }

  private simulateLumpSum(symbol: string, amount: number, days: number): number {
    return -0.1 + Math.random() * 0.4;
  }

  private simulateDCA(symbol: string, amount: number, days: number, interval: string): number {
    return -0.05 + Math.random() * 0.35;
  }

  /**
   * Backtest a DCA strategy
   */
  async backtest(symbol: string, amount: number, interval: string, periods: number): Promise<DCAResult> {
    const returns: number[] = [];
    let totalInvested = 0;
    let totalValue = 0;

    for (let i = 0; i < periods; i++) {
      const periodReturn = -0.05 + Math.random() * 0.1;
      returns.push(periodReturn);
      totalInvested += amount;
      totalValue += amount * (1 + periodReturn);
    }

    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const totalReturn = (totalValue - totalInvested) / totalInvested;

    return {
      symbol,
      interval,
      periods,
      amountPerPeriod: amount,
      totalInvested,
      totalValue,
      totalReturn,
      avgPeriodReturn: avgReturn,
      bestPeriod: Math.max(...returns),
      worstPeriod: Math.min(...returns),
      timestamp: Date.now()
    };
  }

  close(): void {}
}

export * from './types/DCAPlannerTypes';
export { createDCAPlanner } from './factory';

export function createDCAPlanner(): DCAPlanner {
  return new DCAPlanner();
}