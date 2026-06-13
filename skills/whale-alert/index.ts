// Whale Alert - Large transaction monitoring
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { WhaleTransaction, WhaleAddress, AlertThreshold, WhaleMetrics } from './types/WhaleAlertTypes';

const logger = new Logger('WhaleAlert');
const metrics = new Metrics();

export class WhaleAlertMonitor {
  private trackedAddresses: Map<string, WhaleAddress> = new Map();
  private thresholds: Map<string, AlertThreshold> = new Map();

  async monitor(tx: { hash: string; from: string; to: string; value: number; token: string }, chain: string = 'ethereum'): Promise<WhaleTransaction | null> {
    const threshold = this.getThreshold(chain);

    if (tx.value >= threshold.minAmount) {
      const isWhaleToExchange = this.isExchange(tx.to);
      const isWhaleFromExchange = this.isExchange(tx.from);

      const whaleTx: WhaleTransaction = {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        token: tx.token,
        chain,
        timestamp: Date.now(),
        type: isWhaleToExchange ? 'buy' : isWhaleFromExchange ? 'sell' : 'transfer',
        sizeRank: this.getSizeRank(tx.value),
        impact: this.getImpact(tx.value)
      };

      metrics.increment('whale.detected', 1, { chain, type: whaleTx.type });
      return whaleTx;
    }

    return null;
  }

  private getThreshold(chain: string): AlertThreshold {
    return { minAmount: 100000, maxAmount: 100000000, minUSD: 1000000 };
  }

  private isExchange(address: string): boolean {
    const exchanges = ['0x3f5CE5', '0xFE8173', '0x564293', '0x71C765'];
    return exchanges.some(ex => address.toLowerCase().startsWith(ex.toLowerCase()));
  }

  private getSizeRank(value: number): 'small' | 'medium' | 'large' | 'mega' | 'kraken' {
    if (value >= 10000000) return 'kraken';
    if (value >= 1000000) return 'mega';
    if (value >= 100000) return 'large';
    if (value >= 10000) return 'medium';
    return 'small';
  }

  private getImpact(value: number): number {
    return Math.min(100, value / 100000);
  }

  async track(address: string, label?: string): Promise<void> {
    this.trackedAddresses.set(address, { address, label, addedAt: Date.now(), txCount: 0, totalValue: 0 });
  }

  async getMetrics(address: string, days: number = 30): Promise<WhaleMetrics> {
    return {
      address,
      avgTxSize: 50000 + Math.random() * 500000,
      txFrequency: 1 + Math.floor(Math.random() * 10),
      buySellRatio: 0.5 + Math.random(),
      netFlow: -1000000 + Math.random() * 2000000,
      lastActive: Date.now() - Math.random() * 86400000
    };
  }

  close(): void { this.trackedAddresses.clear(); this.thresholds.clear(); }
}

export * from './types/WhaleAlertTypes';


export { createWhaleAlertMonitor } from './factory';
