// DCA Executor - Dollar-cost averaging automation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { DCASchedule, DCAStatus } from './types/DCATypes';

const logger = new Logger('DCAExecutor');
const metrics = new Metrics();

export class DCAExecutor {
  private schedules: Map<string, DCASchedule> = new Map();
  private nextId: number = 1;

  /**
   * Add a DCA schedule
   */
  add(symbol: string, amount: number, interval: string, startTime?: Date): DCASchedule {
    const id = `dca-${this.nextId++}`;
    const schedule: DCASchedule = {
      id,
      symbol,
      amount,
      interval,
      nextRun: this.calculateNextRun(interval, startTime),
      totalRuns: 0,
      status: 'active'
    };

    this.schedules.set(id, schedule);
    metrics.increment('dca.added', 1, { symbol, interval });
    logger.info(`Added DCA schedule ${id} for ${symbol}`);

    return schedule;
  }

  /**
   * Calculate next run time
   */
  private calculateNextRun(interval: string, startTime?: Date): number {
    const now = startTime?.getTime() || Date.now();
    
    if (interval === 'daily') return now + 86400000;
    if (interval === 'weekly') return now + 7 * 86400000;
    if (interval === 'monthly') return now + 30 * 86400000;
    
    return now + 86400000; // Default daily
  }

  /**
   * Execute pending DCA orders
   */
  async executePending(): Promise<string[]> {
    const executed: string[] = [];
    const now = Date.now();

    for (const [id, schedule] of this.schedules) {
      if (schedule.status === 'active' && schedule.nextRun <= now) {
        const orderId = await this.placeOrder(schedule);
        executed.push(orderId);
        
        schedule.totalRuns++;
        schedule.nextRun = this.calculateNextRun(schedule.interval, new Date(now));
        metrics.increment('dca.executed', 1, { symbol: schedule.symbol });
      }
    }

    return executed;
  }

  /**
   * Place DCA order (mock)
   */
  private async placeOrder(schedule: DCASchedule): Promise<string> {
    // In production - would call DEX aggregator
    return `tx-${Date.now()}-${schedule.symbol}`;
  }

  /**
   * Cancel a schedule
   */
  cancel(id: string): boolean {
    const schedule = this.schedules.get(id);
    if (schedule) {
      schedule.status = 'cancelled';
      metrics.increment('dca.cancelled', 1);
      return true;
    }
    return false;
  }

  /**
   * Get all schedules
   */
  list(): DCASchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Get next scheduled buys
   */
  getNext(limit: number = 10): DCASchedule[] {
    return this.list()
      .filter(s => s.status === 'active')
      .sort((a, b) => a.nextRun - b.nextRun)
      .slice(0, limit);
  }

  /**
   * Close executor
   */
  close(): void {
    this.schedules.clear();
    logger.info('DCAExecutor closed');
  }
}

export * from './types/DCATypes';
export { createDCAExecutor } from './factory';

export function createDCAExecutor(): DCAExecutor {
  return new DCAExecutor();
}