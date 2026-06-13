// Volatility Surfer - Advanced Volatility Trading
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { VolatilityRegime, IVData, OptionsStrategy } from './types/VolatilityTypes';

const logger = new Logger('VolatilitySurfer');
const metrics = new Metrics();

export class VolatilitySurfer {
  private ivHistory: Map<string, number[]> = new Map();
  private regimeCache: Map<string, VolatilityRegime> = new Map();

  /**
   * Analyze volatility regime for a symbol
   */
  async analyze(symbol: string): Promise<VolatilityRegime> {
    const cached = this.regimeCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached;
    }

    const ivData = await this.fetchIVData(symbol);
    const regime = this.classifyRegime(ivData);
    const history = this.getIVHistory(symbol);

    this.ivHistory.set(symbol, [...(history || []), ivData.currentIV]);
    this.regimeCache.set(symbol, regime);

    metrics.increment('volatility.analyze', 1, { symbol, regime: regime.state });

    return regime;
  }

  /**
   * Fetch IV data from options markets
   */
  private async fetchIVData(symbol: string): Promise<IVData> {
    // In production - would call Deribit, Orbiter, or exchange APIs
    const mockIV = 40 + Math.random() * 60; // 40-100 IV range
    const historicalIV = Array.from({ length: 250 }, () => 30 + Math.random() * 70);

    return {
      symbol,
      currentIV: mockIV,
      historicalIV,
      ivRank: this.calculateIVRank(mockIV, historicalIV),
      ivPercentile: 0,
      termStructure: this.generateTermStructure(),
      skew: -10 + Math.random() * 20,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate IV rank (0-100)
   */
  private calculateIVRank(current: number, historical: number[]): number {
    const min = Math.min(...historical);
    const max = Math.max(...historical);
    return max > min ? ((current - min) / (max - min)) * 100 : 50;
  }

  /**
   * Classify volatility regime
   */
  private classifyRegime(ivData: IVData): VolatilityRegime {
    const rank = ivData.ivRank;

    if (rank < 20) return { state: 'low', iv: ivData.currentIV, rank, timestamp: Date.now() };
    if (rank < 50) return { state: 'normal', iv: ivData.currentIV, rank, timestamp: Date.now() };
    if (rank < 80) return { state: 'elevated', iv: ivData.currentIV, rank, timestamp: Date.now() };
    return { state: 'high', iv: ivData.currentIV, rank, timestamp: Date.now() };
  }

  /**
   * Generate options term structure
   */
  private generateTermStructure(): number[] {
    return Array.from({ length: 12 }, (_, i) => 30 + Math.random() * 40 + i * 2);
  }

  /**
   * Generate options strategy recommendation
   */
  generateStrategy(regime: VolatilityRegime, symbol: string): OptionsStrategy {
    let strategy: OptionsStrategy;

    switch (regime.state) {
      case 'low':
        strategy = {
          type: 'long_straddle',
          strikes: ['ATM'],
          expiry: '30D',
          confidence: 75,
          rationale: 'Low IV - expect expansion'
        };
        break;
      case 'high':
        strategy = {
          type: 'short_strangle',
          strikes: ['OTM'],
          expiry: '15D',
          confidence: 80,
          rationale: 'High IV - fade the move'
        };
        break;
      default:
        strategy = {
          type: 'calendar_spread',
          strikes: ['ATM'],
          expiry: 'short',
          confidence: 60,
          rationale: 'Normal IV - wait for setup'
        };
    }

    return strategy;
  }

  /**
   * Get IV history for a symbol
   */
  private getIVHistory(symbol: string): number[] | undefined {
    return this.ivHistory.get(symbol);
  }

  /**
   * Close and cleanup
   */
  close(): void {
    this.ivHistory.clear();
    this.regimeCache.clear();
    logger.info('VolatilitySurfer closed');
  }
}

export * from './types/VolatilityTypes';


export { createVolatilitySurfer } from './factory';
