// TVL Tracker - DeFi TVL monitoring and analytics
// Author: Tentacle OS

import type { OnChainConfig, TVLData, TVLPoint } from '../types/OnChainTypes';
import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';

const logger = new Logger('TVLTracker');
const metrics = new Metrics();

export class TVLTracker {
  private cache: Map<string, TVLPoint[]> = new Map();
  private lastFetch: number = 0;
  private cacheTimeout: number = 300000; // 5 minutes

  constructor(private config: OnChainConfig) {}

  /**
   * Get TVL data
   */
  async get(): Promise<TVLData[]> {
    const now = Date.now();

    if (now - this.lastFetch > this.cacheTimeout || this.cache.size === 0) {
      await this.refresh();
    }

    const results: TVLData[] = [];

    for (const [protocol, chain, tvl, change24h] of this.getAllTVL()) {
      results.push({
        protocol,
        chain,
        tvl,
        change24h,
        change7d: this.get7dChange(protocol, chain)
      });
    }

    return results;
  }

  /**
   * Get TVL for specific protocol
   */
  async getProtocol(protocol: string): Promise<TVLData[]> {
    const all = await this.get();
    return all.filter(d =>
      d.protocol.toLowerCase().includes(protocol.toLowerCase())
    );
  }

  /**
   * Get TVL for specific chain
   */
  async getChain(chain: string): Promise<TVLData[]> {
    const all = await this.get();
    return all.filter(d => d.chain === chain);
  }

  /**
   * Check for significant TVL changes
   */
  async getAlerts(threshold: number = 0.15): Promise<TVLData[]> {
    const all = await this.get();
    return all.filter(d => Math.abs(d.change24h) > threshold);
  }

  /**
   * Refresh TVL data from sources
   */
  private async refresh(): Promise<void> {
    this.lastFetch = Date.now();

    try {
      // In production - call DeFiLlama API
      // Mock data for now
      const protocols = ['aave', 'uniswap', 'compound', 'curve', 'balancer', 'sushi', 'yearn'];
      const chains = ['ethereum', 'arbitrum', 'base', 'polygon'];

      for (const protocol of protocols) {
        for (const chain of chains) {
          const tvl = this.getMockTVL(protocol, chain);
          const key = `${protocol}-${chain}`;

          this.cache.set(key, [
            ...(this.cache.get(key) || []),
            { protocol, chain, tvl, timestamp: Date.now() }
          ]);
        }
      }

      metrics.increment('tvl.refreshed', 1);
    } catch (err) {
      logger.error('TVL refresh failed', err);
    }
  }

  /**
   * Generate mock TVL data
   */
  private getMockTVL(protocol: string, chain: string): number {
    const bases: Record<string, number> = {
      'aave': 5000000000,
      'uniswap': 4000000000,
      'compound': 2000000000,
      'curve': 3000000000,
      'balancer': 1000000000,
      'sushi': 500000000,
      'yearn': 2000000000
    };

    const chainMultipliers: Record<string, number> = {
      'ethereum': 1,
      'arbitrum': 0.3,
      'base': 0.2,
      'polygon': 0.4
    };

    const base = bases[protocol] || 1000000000;
    const multiplier = chainMultipliers[chain] || 0.1;

    return base * multiplier * (0.5 + Math.random() * 0.5);
  }

  /**
   * Get 7-day change
   */
  private get7dChange(protocol: string, chain: string): number {
    // Simulate 7-day change based on 24h change
    const change24h = this.getMockChange();
    const change7d = change24h * (2 + Math.random() * 2); // Typically larger
    return Math.tanh(change7d) * 0.5; // Normalize to -50% to +50%
  }

  private getMockChange(): number {
    // -20% to +20% range
    return -0.2 + Math.random() * 0.4;
  }

  /**
   * Get all TVL data
   */
  private getAllTVL(): IterableIterator<[string, string, number, number]> {
    const results: [string, string, number, number][] = [];

    const protocolTVL: Record<string, Record<string, number>> = {};
    const protocolChanges: Record<string, Record<string, number>> = {};

    for (const [key, points] of this.cache) {
      const [protocol, chain] = key.split('-');
      if (points.length > 0) {
        protocolTVL[protocol] = protocolTVL[protocol] || {};
        protocolTVL[protocol][chain] = points[points.length - 1].tvl;

        protocolChanges[protocol] = protocolChanges[protocol] || {};
        protocolChanges[protocol][chain] = this.getMockChange();
      }
    }

    for (const protocol of Object.keys(protocolTVL)) {
      for (const chain of Object.keys(protocolTVL[protocol])) {
        yield [
          protocol,
          chain,
          protocolTVL[protocol][chain],
          protocolChanges[protocol]?.[chain] || 0
        ];
      }
    }
  }

  /**
   * Close tracker
   */
  close(): void {
    this.cache.clear();
    logger.info('TVLTracker closed');
  }
}