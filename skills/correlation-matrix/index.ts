// Correlation Matrix - Portfolio diversification analysis
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { CorrelationMatrix, HedgeRatio, DiversificationScore } from './types/CorrelationTypes';

const logger = new Logger('CorrelationMatrix');
const metrics = new Metrics();

export class CorrelationMatrixAnalyzer {
  private priceHistory: Map<string, number[]> = new Map();

  addPrices(symbol: string, prices: number[]): void {
    this.priceHistory.set(symbol, prices);
  }

  calculate(symbols: string[]): CorrelationMatrix {
    const matrix: Record<string, Record<string, number>> = {};

    for (const symA of symbols) {
      matrix[symA] = {};
      for (const symB of symbols) {
        const pricesA = this.priceHistory.get(symA) || [];
        const pricesB = this.priceHistory.get(symB) || [];
        matrix[symA][symB] = this.calculateCorrelation(pricesA, pricesB);
      }
    }

    metrics.increment('correlation.calculated', 1);
    return { symbols, matrix, timestamp: Date.now() };
  }

  private calculateCorrelation(a: number[], b: number[]): number {
    const n = Math.min(a.length, b.length);
    if (n < 2) return 0;

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

    const den = Math.sqrt(denA * denB);
    return den > 0 ? num / den : 0;
  }

  calculateHedgeRatio(symbolA: string, symbolB: string): HedgeRatio {
    const pricesA = this.priceHistory.get(symbolA) || [];
    const pricesB = this.priceHistory.get(symbolB) || [];

    const returnsA = this.calculateReturns(pricesA);
    const returnsB = this.calculateReturns(pricesB);

    const n = Math.min(returnsA.length, returnsB.length);
    const meanA = returnsA.slice(0, n).reduce((x, y) => x + y, 0) / n;
    const meanB = returnsB.slice(0, n).reduce((x, y) => x + y, 0) / n;

    let cov = 0, varB = 0;
    for (let i = 0; i < n; i++) {
      cov += (returnsA[i] - meanA) * (returnsB[i] - meanB);
      varB += (returnsB[i] - meanB) ** 2;
    }

    const beta = varB > 0 ? cov / varB : 0;

    return { symbolA, symbolB, beta, method: 'ols', timestamp: Date.now() };
  }

  private calculateReturns(prices: number[]): number[] {
    return prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
  }

  diversificationScore(symbols: string[], weights: number[]): DiversificationScore {
    const matrix = this.calculate(symbols);
    let portfolioVariance = 0;

    for (let i = 0; i < symbols.length; i++) {
      for (let j = 0; j < symbols.length; j++) {
        const corr = matrix.matrix[symbols[i]][symbols[j]];
        portfolioVariance += weights[i] * weights[j] * corr;
      }
    }

    const avgCorrelation = this.getAverageCorrelation(matrix);
    const score = Math.max(0, Math.min(100, (1 - avgCorrelation) * 100));

    return { score, avgCorrelation, portfolioVariance, effectiveN: 1 / weights.reduce((s, w) => s + w * w, 0), timestamp: Date.now() };
  }

  private getAverageCorrelation(matrix: CorrelationMatrix): number {
    let sum = 0, count = 0;
    for (let i = 0; i < matrix.symbols.length; i++) {
      for (let j = i + 1; j < matrix.symbols.length; j++) {
        sum += matrix.matrix[matrix.symbols[i]][matrix.symbols[j]];
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }

  close(): void { this.priceHistory.clear(); }
}

export * from './types/CorrelationTypes';
export { createCorrelationMatrixAnalyzer } from './factory';

export function createCorrelationMatrixAnalyzer(): CorrelationMatrixAnalyzer {
  return new CorrelationMatrixAnalyzer();
}