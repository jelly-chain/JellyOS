// Probability Model - Event probability modeling
// Author: Tentacle OS

import type { PredictionMarket } from '../types/PredictionTypes';
import { Logger } from '../../../../../src/core/utils/Logger';

const logger = new Logger('ProbabilityModel');

export class ProbabilityModel {
  private models: Map<string, ModelResult> = new Map();

  /**
   * Calculate probability for an event
   */
  calculate(
    question: string,
    polls?: number[],
    odds?: number[],
    marketData?: number[]
  ): number {
    const key = this.hashQuestion(question);

    // Weighted average of sources
    let probability = 0.5; // Default neutral
    let weights = { polls: 0, odds: 0, market: 0 };

    if (polls && polls.length > 0) {
      probability += polls.reduce((sum, p) => sum + p, 0) / polls.length * 0.3;
      weights.polls = 0.3;
    }

    if (odds && odds.length > 0) {
      probability += odds.reduce((sum, o) => sum + o, 0) / odds.length * 0.3;
      weights.odds = 0.3;
    }

    if (marketData && marketData.length > 0) {
      probability += marketData.reduce((sum, m) => sum + m, 0) / marketData.length * 0.4;
      weights.market = 0.4;
    }

    const result: ModelResult = {
      question,
      probability: Math.max(0, Math.min(1, probability)),
      confidence: Math.min(100, (weights.polls + weights.odds + weights.market) * 100 * 2),
      sourcesUsed: Object.keys(weights).filter(k => weights[k as keyof typeof weights] > 0)
    };

    this.models.set(key, result);

    return result.probability;
  }

  /**
   * Compare market price vs model probability
   */
  findMispricings(markets: PredictionMarket[]): Mispricing[] {
    const mispricings: Mispricing[] = [];

    for (const market of markets) {
      const key = this.hashQuestion(market.question);
      const model = this.models.get(key);

      if (model && market.outcomes.length > 0) {
        const yesPrice = market.outcomes[0].price;
        const edge = Math.abs(yesPrice - model.probability);

        if (edge > 0.05) { // 5% edge threshold
          mispricings.push({
            market: market.id,
            platform: market.platform,
            marketPrice: yesPrice,
            modelPrice: model.probability,
            edge: edge,
            recommendation: yesPrice > model.probability ? 'sell' : 'buy'
          });
        }
      }
    }

    return mispricings.sort((a, b) => b.edge - a.edge);
  }

  /**
   * Hash question for storage
   */
  private hashQuestion(question: string): string {
    return question.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Close model
   */
  close(): void {
    this.models.clear();
  }
}

interface ModelResult {
  question: string;
  probability: number;
  confidence: number;
  sourcesUsed: string[];
}

export interface Mispricing {
  market: string;
  platform: string;
  marketPrice: number;
  modelPrice: number;
  edge: number;
  recommendation: 'buy' | 'sell';
}