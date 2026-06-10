// Gas Optimizer - Multi-chain gas price monitoring
// Author: Tentacle OS

import type { OnChainConfig, GasData } from '../types/OnChainTypes';
import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';

const logger = new Logger('GasOptimizer');
const metrics = new Metrics();

export class GasOptimizer {
  private chainConfigs: Map<string, ChainGasConfig> = new Map();
  private lastFetch: number = 0;
  private cacheTimeout: number = 60000; // 1 minute
  private prices: GasData[] = [];

  constructor(private config: OnChainConfig) {
    this.initializeChainConfigs();
  }

  /**
   * Initialize chain configurations
   */
  private initializeChainConfigs(): void {
    const chains = ['ethereum', 'arbitrum', 'base', 'optimism', 'polygon', 'bsc', 'solana'];

    for (const chain of chains) {
      this.chainConfigs.set(chain, {
        chain,
        rpcEndpoint: this.config.rpcEndpoints[chain] || '',
        lastBlock: 0,
        priority: chains.indexOf(chain)
      });
    }
  }

  /**
   * Get current gas prices across chains
   */
  async getPrices(force: boolean = false): Promise<GasData[]> {
    const now = Date.now();

    if (!force && now - this.lastFetch < this.cacheTimeout && this.prices.length > 0) {
      return this.prices;
    }

    this.lastFetch = now;

    try {
      this.prices = await this.fetchPrices();
      return this.prices;
    } catch (err) {
      logger.error('Gas price fetch failed', err);
      return this.prices;
    }
  }

  /**
   * Fetch gas prices from various sources
   */
  private async fetchPrices(): Promise<GasData[]> {
    const results: GasData[] = [];

    for (const chain of Object.keys(this.chainConfigs)) {
      let fast: number, standard: number, slow: number, baseFee: number;

      if (chain === 'solana') {
        // Solana doesn't use gas like EVM
        fast = 0.000005;
        standard = 0.000005;
        slow = 0.000005;
        baseFee = 0;
      } else {
        // EVM chains - gwei prices
        // In production - query actual RPC
        baseFee = this.getMockBaseFee(chain);
        fast = baseFee + 2 + Math.random() * 10;
        standard = baseFee + 1 + Math.random() * 5;
        slow = baseFee + Math.random() * 2;
      }

      results.push({
        chain,
        fast,
        standard,
        slow,
        baseFee
      });
    }

    return results;
  }

  /**
   * Find optimal chain for transaction
   */
  async findOptimalChain(symbol: string, amount: number): Promise<string> {
    const prices = await this.getPrices();
    const tokenPrice = this.getTokenPrice(symbol);
    const usdAmount = amount * tokenPrice;

    // Score each chain based on gas cost and speed
    const scores = prices.map(p => ({
      chain: p.chain,
      score: this.calculateChainScore(p, usdAmount)
    }));

    scores.sort((a, b) => b.score - a.score);

    return scores[0].chain;
  }

  /**
   * Calculate chain score
   */
  private calculateChainScore(gas: GasData, usdAmount: number): number {
    // Higher score = better
    const gasCost = gas.standard * this.getGasUnits();
    const gasUsd = gasCost * this.getEthPrice() / 1e9; // Convert gwei to USD

    // Score based on cost ratio to transaction
    const costRatio = gasUsd / usdAmount;
    return 1 / (1 + costRatio); // Higher when gas is lower % of transaction
  }

  /**
   * Get mock base fee
   */
  private getMockBaseFee(chain: string): number {
    const fees: Record<string, number> = {
      'ethereum': 15 + Math.random() * 10,
      'arbitrum': 0.1 + Math.random() * 0.2,
      'base': 0.05 + Math.random() * 0.1,
      'optimism': 0.1 + Math.random() * 0.15,
      'polygon': 50 + Math.random() * 100,
      'bsc': 5 + Math.random() * 5
    };
    return fees[chain] || 10;
  }

  /**
   * Check for gas alerts
   */
  async getAlerts(threshold: number = 50): Promise<GasData[]> {
    const prices = await this.getPrices();
    return prices.filter(p => p.standard > threshold);
  }

  /**
   * Get best time to transact
   */
  async getTimingRecommendation(symbol: string): Promise<{
    chain: string;
    gas: number;
    recommended: boolean;
  }[]> {
    const prices = await this.getPrices();

    return prices.map(p => ({
      chain: p.chain,
      gas: p.standard,
      recommended: p.standard < this.config.gasAlertThreshold
    }));
  }

  /**
   * Close optimizer
   */
  close(): void {
    this.chainConfigs.clear();
    this.prices = [];
    logger.info('GasOptimizer closed');
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  private getGasUnits(): number {
    // Standard gas units for swap
    return 150000;
  }

  private getEthPrice(): number {
    return 3000; // Mock
  }

  private getTokenPrice(symbol: string): number {
    const prices: Record<string, number> = {
      'ETH': 3000, 'BTC': 60000, 'SOL': 150,
      'USDC': 1, 'USDT': 1
    };
    return prices[symbol.toUpperCase()] || 1;
  }
}

interface ChainGasConfig {
  chain: string;
  rpcEndpoint: string;
  lastBlock: number;
  priority: number;
}