// Prediction Markets Engine - Main Entry Point
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import { PolymarketClient } from './polymarket/PolymarketClient';
import { KalshiClient } from './kalshi/KalshiClient';
import { PredictFunClient } from './arbitrage/PredictFunClient';
import { ArbitrageDetector } from './arbitrage/ArbitrageDetector';
import { ProbabilityModel } from './models/ProbabilityModel';
import { PortfolioManager } from './models/PortfolioManager';
import type { PredictionMarket, ArbitrageOpportunity, Position } from './types/PredictionTypes';

const logger = new Logger('PredictionMarkets');
const metrics = new Metrics();

// ============================================================================
// Prediction Markets Engine Class
// ============================================================================

export interface PredictionConfig {
  polymarketKey?: string;
  kalshiKey?: string;
  autoArbThreshold?: number;
  maxPositionSize?: number;
}

export class PredictionMarketsEngine {
  private polymarket: PolymarketClient;
  private kalshi: KalshiClient;
  private predictfun: PredictFunClient;
  private arbDetector: ArbitrageDetector;
  private probModel: ProbabilityModel;
  private portfolio: PortfolioManager;

  constructor(config?: PredictionConfig) {
    this.polymarket = new PolymarketClient(config?.polymarketKey);
    this.kalshi = new KalshiClient(config?.kalshiKey);
    this.predictfun = new PredictFunClient();
    this.arbDetector = new ArbitrageDetector(this.polymarket, this.kalshi, this.predictfun);
    this.probModel = new ProbabilityModel();
    this.portfolio = new PortfolioManager();

    logger.info('PredictionMarketsEngine initialized');
  }

  /**
   * Search markets across all platforms
   */
  async search(keyword: string): Promise<PredictionMarket[]> {
    const [poly, kalshi, predict] = await Promise.allSettled([
      this.polymarket.search(keyword),
      this.kalshi.search(keyword),
      this.predictfun.search(keyword)
    ]);

    const results: PredictionMarket[] = [];

    if (poly.status === 'fulfilled') results.push(...poly.value);
    if (kalshi.status === 'fulfilled') results.push(...kalshi.value);
    if (predict.status === 'fulfilled') results.push(...predict.value);

    metrics.increment('prediction.search', results.length);

    return results;
  }

  /**
   * Check for arbitrage opportunities
   */
  async findArbitrage(symbol?: string): Promise<ArbitrageOpportunity[]> {
    return this.arbDetector.scan(symbol);
  }

  /**
   * Get positions across all platforms
   */
  async getPositions(): Promise<Position[]> {
    const [polyPos, kalshiPos, predictPos] = await Promise.allSettled([
      this.polymarket.getPositions(),
      this.kalshi.getPositions(),
      this.predictfun.getPositions()
    ]);

    const positions: Position[] = [];

    if (polyPos.status === 'fulfilled') positions.push(...polyPos.value);
    if (kalshiPos.status === 'fulfilled') positions.push(...kalshiPos.value);
    if (predictPos.status === 'fulfilled') positions.push(...predictPos.value);

    return positions;
  }

  /**
   * Get P&L across prediction markets
   */
  async getPnL(): Promise<{ realized: number; unrealized: number; total: number }> {
    const positions = await this.getPositions();
    const summary = this.portfolio.calculatePnL(positions);

    return summary;
  }

  /**
   * Place order on platform
   */
  async placeOrder(
    marketId: string,
    side: 'buy' | 'sell',
    outcome: string,
    size: number,
    platform: 'polymarket' | 'kalshi' | 'predictfun'
  ): Promise<string> {
    let orderId: string;

    switch (platform) {
      case 'polymarket':
        orderId = await this.polymarket.placeOrder(marketId, side, outcome, size);
        break;
      case 'kalshi':
        orderId = await this.kalshi.placeOrder(marketId, side, outcome, size);
        break;
      case 'predictfun':
        orderId = await this.predictfun.placeOrder(marketId, side, outcome, size);
        break;
    }

    metrics.increment('prediction.order.placed', 1, { platform });

    return orderId;
  }

  /**
   * Close position
   */
  async closePosition(marketId: string, platform: string): Promise<boolean> {
    let closed = false;

    switch (platform) {
      case 'polymarket':
        closed = await this.polymarket.closePosition(marketId);
        break;
      case 'kalshi':
        closed = await this.kalshi.closePosition(marketId);
        break;
      case 'predictfun':
        closed = await this.predictfun.closePosition(marketId);
        break;
    }

    if (closed) {
      metrics.increment('prediction.position.closed', 1, { platform });
    }

    return closed;
  }

  /**
   * Model probability for an event
   */
  modelProbability(
    question: string,
    polls?: number[],
    odds?: number[],
    marketData?: number[]
  ): number {
    return this.probModel.calculate(question, polls, odds, marketData);
  }

  /**
   * Close all resources
   */
  close(): void {
    this.polymarket.close();
    this.kalshi.close();
    this.predictfun.close();
    this.arbDetector.close();
    this.probModel.close();
    this.portfolio.close();
    logger.info('PredictionMarketsEngine closed');
  }
}

// ============================================================================
// Default Export
// ============================================================================

export * from './types/PredictionTypes';
export { PolymarketClient } from './polymarket/PolymarketClient';
export { KalshiClient } from './kalshi/KalshiClient';
export { ArbitrageDetector } from './arbitrage/ArbitrageDetector';
export { ProbabilityModel } from './models/ProbabilityModel';
export { PortfolioManager } from './models/PortfolioManager';

export function createPredictionMarkets(config?: PredictionConfig): PredictionMarketsEngine {
  return new PredictionMarketsEngine(config);
}