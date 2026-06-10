// Arbitrage Detector - Cross-platform prediction market arbitrage
// Author: Tentacle OS

import type { PolymarketClient } from '../polymarket/PolymarketClient';
import type { KalshiClient } from '../kalshi/KalshiClient';
import { PredictFunClient } from './PredictFunClient';
import type { ArbitrageOpportunity, PredictionMarket } from '../types/PredictionTypes';
import { Logger } from '../../../../../src/core/utils/Logger';

const logger = new Logger('ArbitrageDetector');

export type MarketClient = PolymarketClient | KalshiClient | PredictFunClient;

export class ArbitrageDetector {
  private clients: Map<string, MarketClient>;

  constructor(
    private polymarket: PolymarketClient,
    private kalshi: KalshiClient,
    private predictfun: PredictFunClient
  ) {
    this.clients = new Map([
      ['polymarket', polymarket],
      ['kalshi', kalshi],
      ['predictfun', predictfun]
    ]);
  }

  /**
   * Scan for arbitrage opportunities
   */
  async scan(symbol?: string): Promise<ArbitrageOpportunity[]> {
    const opportunities: ArbitrageOpportunity[] = [];

    // Get all markets
    const [polyMarkets, kalshiMarkets, predictMarkets] = await Promise.allSettled([
      this.polymarket.search(symbol || ''),
      this.kalshi.search(symbol || ''),
      this.predictfun.search(symbol || '')
    ]);

    // Compare Polymarket vs Kalshi
    if (polyMarkets.status === 'fulfilled' && kalshiMarkets.status === 'fulfilled') {
      const polyArbs = this.findCrossPlatformArbs(
        polyMarkets.value,
        kalshiMarkets.value,
        'polymarket',
        'kalshi'
      );
      opportunities.push(...polyArbs);
    }

    // Compare Polymarket vs PredictFun
    if (polyMarkets.status === 'fulfilled' && predictMarkets.status === 'fulfilled') {
      const predictArbs = this.findCrossPlatformArbs(
        polyMarkets.value,
        predictMarkets.value,
        'polymarket',
        'predictfun'
      );
      opportunities.push(...predictArbs);
    }

    // Compare Kalshi vs PredictFun
    if (kalshiMarkets.status === 'fulfilled' && predictMarkets.status === 'fulfilled') {
      const kalshiPredictArbs = this.findCrossPlatformArbs(
        kalshiMarkets.value,
        predictMarkets.value,
        'kalshi',
        'predictfun'
      );
      opportunities.push(...kalshiPredictArbs);
    }

    // Sort by spread size
    opportunities.sort((a, b) => b.spread - a.spread);

    logger.info(`Found ${opportunities.length} arbitrage opportunities`);

    return opportunities;
  }

  /**
   * Find arbitrage opportunities between two platforms
   */
  private findCrossPlatformArbs(
    marketsA: PredictionMarket[],
    marketsB: PredictionMarket[],
    platformA: string,
    platformB: string
  ): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    for (const marketA of marketsA) {
      for (const marketB of marketsB) {
        // Check if markets are related (same topic)
        if (this.areRelated(marketA.question, marketB.question)) {
          const yesA = marketA.outcomes.find(o => o.id === 'yes');
          const yesB = marketB.outcomes.find(o => o.id === 'yes');

          if (yesA && yesB) {
            const spread = Math.abs(yesA.price - yesB.price);

            if (spread > 0.02) { // 2% spread threshold
              const netProfit = this.calculateNetProfit(spread, platformA, platformB);

              opportunities.push({
                platformA,
                marketA: marketA.id,
                priceA: yesA.price,
                platformB,
                marketB: marketB.id,
                priceB: yesB.price,
                spread,
                netProfit,
                direction: yesA.price > yesB.price ? 'longA-shortB' : 'longB-shortA'
              });
            }
          }
        }
      }
    }

    return opportunities;
  }

  /**
   * Check if two markets are related
   */
  private areRelated(questionA: string, questionB: string): boolean {
    // Simple keyword matching - in production use NLP/semantic similarity
    const normalize = (q: string) => q.toLowerCase().replace(/[^a-z0-9]/g, '');
    const qA = normalize(questionA);
    const qB = normalize(questionB);

    const wordsA = qA.split(' ');
    const wordsB = qB.split(' ');

    // Count matching words
    const matches = wordsA.filter(w => wordsB.includes(w)).length;

    return matches >= 2; // At least 2 matching words
  }

  /**
   * Calculate net profit after fees
   */
  private calculateNetProfit(
    spread: number,
    platformA: string,
    platformB: string
  ): number {
    // Fee structure per platform
    const fees: Record<string, number> = {
      'polymarket': 0.00, // 0% fees
      'kalshi': 0.03, // ~3% fees
      'predictfun': 0.02 // 2% fees
    };

    const feeA = fees[platformA] || 0;
    const feeB = fees[platformB] || 0;

    return spread - feeA - feeB;
  }

  /**
   * Get best arbitrage for symbol
   */
  async getBest(symbol: string): Promise<ArbitrageOpportunity | null> {
    const opportunities = await this.scan(symbol);
    return opportunities.length > 0 ? opportunities[0] : null;
  }

  /**
   * Close detector
   */
  close(): void {
    this.clients.clear();
  }
}