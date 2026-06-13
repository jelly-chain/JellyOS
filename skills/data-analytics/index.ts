// Data Analytics Engine - Main Entry Point
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import { SentimentAnalyzer } from './sentiment/SentimentAnalyzer';
import { PatternRecognizer } from './patterns/PatternRecognizer';
import { ExchangeFlowTracker } from './exchange/ExchangeFlowTracker';
import type { SentimentScore, PatternSignal, ExchangeFlow } from './types/DataAnalyticsTypes';

const logger = new Logger('DataAnalytics');
const metrics = new Metrics();

export interface DataAnalyticsConfig {
  socialTokens?: string[];
  githubTokens?: string[];
  newsFeeds?: string[];
}

export class DataAnalyticsEngine {
  private sentimentAnalyzer: SentimentAnalyzer;
  private patternRecognizer: PatternRecognizer;
  private exchangeTracker: ExchangeFlowTracker;

  constructor(private config: DataAnalyticsConfig = {}) {
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.patternRecognizer = new PatternRecognizer();
    this.exchangeTracker = new ExchangeFlowTracker();
  }

  /**
   * Analyze sentiment for a symbol
   */
  async getSentiment(symbol: string): Promise<SentimentScore> {
    const score = await this.sentimentAnalyzer.analyze(symbol);
    metrics.increment('analytics.sentiment', 1, { symbol });
    return score;
  }

  /**
   * Find patterns for a symbol
   */
  async getPatterns(symbol: string, ohlcv: any[]): Promise<PatternSignal[]> {
    const patterns = this.patternRecognizer.find(ohlcv, symbol);
    metrics.increment('analytics.patterns', patterns.length, { symbol });
    return patterns;
  }

  /**
   * Get exchange flow data
   */
  async getFlow(symbol: string): Promise<ExchangeFlow[]> {
    const flows = await this.exchangeTracker.getFlow(symbol);
    metrics.increment('analytics.flow', flows.length, { symbol });
    return flows;
  }

  /**
   * Run full analytics scan
   */
  async scan(symbol: string, ohlcv: any[]): Promise<{
    sentiment: SentimentScore;
    patterns: PatternSignal[];
    flow: ExchangeFlow[];
  }> {
    const [sentiment, patterns, flow] = await Promise.all([
      this.getSentiment(symbol),
      this.getPatterns(symbol, ohlcv),
      this.getFlow(symbol)
    ]);

    return { sentiment, patterns, flow };
  }

  close(): void {
    this.sentimentAnalyzer.close();
    this.patternRecognizer.close();
    this.exchangeTracker.close();
    logger.info('DataAnalyticsEngine closed');
  }
}

export * from './types/DataAnalyticsTypes';


function createDataAnalyticsEngine(config?: DataAnalyticsConfig): DataAnalyticsEngine {

export { createDataAnalyticsEngine } from './factory';
