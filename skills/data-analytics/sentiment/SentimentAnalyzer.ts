// Sentiment Analyzer - Multi-source sentiment analysis
// Author: Tentacle OS

import type { SentimentScore, SentimentSource } from '../types/DataAnalyticsTypes';
import { Logger } from '../../../../src/core/utils/Logger';
import { Metrics } from '../../../../src/core/utils/Metrics';

const logger = new Logger('SentimentAnalyzer');
const metrics = new Metrics();

export class SentimentAnalyzer {
  private keywords: Map<string, string[]> = new Map();
  private cache: Map<string, SentimentScore> = new Map();
  private cacheTimeout: number = 3600000; // 1 hour

  constructor() {
    this.initializeKeywords();
  }

  /**
   * Initialize keyword lists
   */
  private initializeKeywords(): void {
    this.keywords.set('bullish', [
      'bull', 'bullish', 'moon', 'pump', 'ath', 'fomo', 'buy', 'accumulation', 'hodl', 'diamond'
    ]);

    this.keywords.set('bearish', [
      'bear', 'bearish', 'dump', 'crash', 'sell', 'distribution', 'rekt', 'rug', 'scam', 'fear'
    ]);
  }

  /**
   * Analyze sentiment for a symbol
   */
  async analyze(symbol: string): Promise<SentimentScore> {
    const cacheKey = symbol.toLowerCase();
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.lastUpdated < this.cacheTimeout) {
      return cached;
    }

    const sources: SentimentSource[] = [];

    // Twitter sentiment
    sources.push(await this.fetchTwitterSentiment(symbol));

    // Reddit sentiment
    sources.push(await this.fetchRedditSentiment(symbol));

    // News sentiment
    sources.push(await this.fetchNewsSentiment(symbol));

    // Calculate aggregate score
    const weightedScore = this.calculateWeightedAverage(sources);
    const confidence = this.calculateConfidence(sources);

    const result: SentimentScore = {
      symbol: cacheKey,
      score: weightedScore,
      sources,
      dominant: this.getDominant(weightedScore),
      confidence,
      lastUpdated: Date.now()
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  private async fetchTwitterSentiment(symbol: string): Promise<SentimentSource> {
    // In production - would call Twitter API or use social listening tool
    const mockScore = -50 + Math.random() * 100;

    return {
      source: 'twitter',
      score: mockScore,
      volume: Math.floor(1000 + Math.random() * 100000),
      timestamp: Date.now()
    };
  }

  private async fetchRedditSentiment(symbol: string): Promise<SentimentSource> {
    // In production - would call Reddit API
    const mockScore = -30 + Math.random() * 60;

    return {
      source: 'reddit',
      score: mockScore,
      volume: Math.floor(100 + Math.random() * 10000),
      timestamp: Date.now()
    };
  }

  private async fetchNewsSentiment(symbol: string): Promise<SentimentSource> {
    // In production - would analyze news headlines
    const mockScore = -20 + Math.random() * 40;

    return {
      source: 'news',
      score: mockScore,
      volume: Math.floor(10 + Math.random() * 100),
      timestamp: Date.now()
    };
  }

  /**
   * Calculate weighted average of sentiment sources
   */
  private calculateWeightedAverage(sources: SentimentSource[]): number {
    const weights: Record<string, number> = {
      'twitter': 0.4,
      'reddit': 0.3,
      'news': 0.2,
      'telegram': 0.1
    };

    let total = 0;
    let weightSum = 0;

    for (const source of sources) {
      const weight = weights[source.source] || 0.1;
      total += source.score * weight * Math.log10(source.volume + 1);
      weightSum += weight * Math.log10(source.volume + 1);
    }

    return weightSum > 0 ? total / weightSum : 0;
  }

  /**
   * Calculate confidence based on volume
   */
  private calculateConfidence(sources: SentimentSource[]): number {
    const totalVolume = sources.reduce((sum, s) => sum + s.volume, 0);
    // More volume = higher confidence, capped at 100
    return Math.min(100, Math.log10(totalVolume / 100) * 10);
  }

  /**
   * Determine dominant sentiment
   */
  private getDominant(score: number): 'bullish' | 'bearish' | 'neutral' {
    if (score > 20) return 'bullish';
    if (score < -20) return 'bearish';
    return 'neutral';
  }

  /**
   * Close analyzer
   */
  close(): void {
    this.keywords.clear();
    this.cache.clear();
  }
}