// Pairs Trading - Statistical arbitrage engine
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';
import type { PairSignal, CointegrationResult } from './types/PairsTypes';

const logger = new Logger('PairsTrading');

export class PairsTrader {
  private pairs: Map<string, PairData> = new Map();

  /**
   * Find tradable pairs among symbols
   */
  async findPairs(symbols: string[]): Promise<PairSignal[]> {
    const signals: PairSignal[] = [];

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        const pairSignal = await this.analyzePair(symbols[i], symbols[j]);
        if (pairSignal && Math.abs(pairSignal.zscore) > 2) {
          signals.push(pairSignal);
        }
      }
    }

    return signals;
  }

  /**
   * Analyze a pair for cointegration
   */
  private async analyzePair(symbolA: string, symbolB: string): Promise<PairSignal | null> {
    const key = `${symbolA}-${symbolB}`;
    const pricesA = await this.fetchPrices(symbolA);
    const pricesB = await this.fetchPrices(symbolB);

    if (pricesA.length < 50 || pricesB.length < 50) return null;

    const cointegration = this.testCointegration(pricesA, pricesB);
    const zscore = this.calculateZScore(pricesA, pricesB);

    return {
      pair: key,
      symbolA,
      symbolB,
      correlation: this.calculateCorrelation(pricesA, pricesB),
      cointegration: cointegration.isCointegrated,
      hedgeRatio: cointegration.hedgeRatio,
      zscore,
      signal: zscore < -2 ? 'long' : zscore > 2 ? 'short' : 'neutral',
      confidence: Math.abs(zscore) * 20
    };
  }

  /**
   * Augmented Dickey-Fuller test for cointegration (simplified)
   */
  private testCointegration(pricesA: number[], pricesB: number[]): CointegrationResult {
    const spread = pricesA.map((p, i) => p - pricesB[i]);
    const adfStat = -3.5 + Math.random() * 2; // Mock ADF statistic

    return {
      isCointegrated: adfStat < -2, // Stationary if < -2
      hedgeRatio: 1,
      pValue: Math.random()
    };
  }

  /**
   * Calculate z-score of spread
   */
  private calculateZScore(pricesA: number[], pricesB: number[]): number {
    const spread = pricesA.map((p, i) => p - pricesB[i]);
    const mean = spread.reduce((a, b) => a + b, 0) / spread.length;
    const std = Math.sqrt(spread.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / spread.length);
    const current = spread[spread.length - 1];

    return std > 0 ? (current - mean) / std : 0;
  }

  /**
   * Calculate correlation
   */
  private calculateCorrelation(a: number[], b: number[]): number {
    const n = Math.min(a.length, b.length);
    const meanA = a.slice(0, n).reduce((x, y) => x + y, 0) / n;
    const meanB = b.slice(0, n).reduce((x, y) => x + y, 0) / n;

    let num = 0, denA = 0, denB = 0;
    for (let i = 0; i < n; i++) {
      const diffA = a[i] - meanA;
      const diffB = b[i] - meanB;
      num += diffA * diffB;
      denA += diffA * diffA;
      denB += diffB * diffB;
    }

    return Math.abs(num / Math.sqrt(denA * denB));
  }

  /**
   * Mock price fetch
   */
  private async fetchPrices(symbol: string): Promise<number[]> {
    return Array.from({ length: 100 }, () => 100 + Math.random() * 1000);
  }

  close(): void {
    this.pairs.clear();
  }
}

interface PairData {
  symbolA: string;
  symbolB: string;
  spread: number[];
  hedgeRatio: number;
}

export * from './types/PairsTypes';


export { createPairsTrader } from './factory';
