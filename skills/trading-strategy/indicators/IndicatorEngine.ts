// Indicator Engine - Technical indicator calculations
// Author: Tentacle OS

import type { OHLCV } from '../types/StrategyTypes';

/**
 * Technical indicator results
 */
export interface IndicatorResult {
  rsi?: number;
  adx?: number;
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bbands?: {
    upper: number;
    middle: number;
    lower: number;
    pb: number; // %B indicator
  };
  ema?: {
    ema20: number;
    ema50: number;
    ema200: number;
  };
  volume?: {
    vwap: number;
    obv: number;
    voldelta: number;
  };
  volatility?: {
    atr: number;
    bollingerWidth: number;
  };
}

/**
 * Indicator engine provides technical analysis calculations
 */
export class IndicatorEngine {
  private cache: Map<string, IndicatorResult> = new Map();
  private cacheTimeout: number = 60000; // 1 minute cache

  /**
   * Calculate all indicators for a symbol
   */
  calculate(ohlcv: OHLCV[], symbol: string): IndicatorResult {
    const cacheKey = `${symbol}-${ohlcv[ohlcv.length - 1]?.timestamp}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - (cached as any)._timestamp < this.cacheTimeout) {
      return cached;
    }

    const result = this.computeIndicators(ohlcv);
    (result as any)._timestamp = Date.now();
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Compute indicators from OHLCV data
   */
  private computeIndicators(data: OHLCV[]): IndicatorResult {
    if (data.length < 20) {
      return {};
    }

    const closes = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);

    return {
      rsi: this.rsi(closes, 14),
      adx: this.adx(highs, lows, closes, 14),
      macd: this.macd(closes),
      bbands: this.bollingerBands(closes, 20, 2),
      ema: this.ema(closes),
      volume: this.volumeIndicators(data),
      volatility: this.volatilityIndicators(highs, lows, closes)
    };
  }

  // ============================================================================
  // RSI - Relative Strength Index
  // ============================================================================

  private rsi(prices: number[], period: number = 14): number | undefined {
    if (prices.length < period + 1) return undefined;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss > 0 ? avgGain / avgLoss : 100;

    return 100 - (100 / (1 + rs));
  }

  // ============================================================================
  // ADX - Average Directional Index
  // ============================================================================

  private adx(highs: number[], lows: number[], closes: number[], period: number = 14): number | undefined {
    if (highs.length < period + 1) return undefined;

    const tr: number[] = [];
    const pdm: number[] = [];
    const ndm: number[] = [];

    for (let i = 1; i < highs.length; i++) {
      const tr1 = highs[i] - lows[i];
      const tr2 = Math.abs(highs[i] - closes[i - 1]);
      const tr3 = Math.abs(lows[i] - closes[i - 1]);
      tr.push(Math.max(tr1, tr2, tr3));

      const pdmVal = highs[i] - highs[i - 1];
      const ndmVal = lows[i - 1] - lows[i];

      pdm.push(pdmVal > ndmVal && pdmVal > 0 ? pdmVal : 0);
      ndm.push(ndmVal > pdmVal && ndmVal > 0 ? ndmVal : 0);
    }

    // Simplified ADX calculation
    const atr = tr.slice(-period).reduce((a, b) => a + b, 0) / period;
    const sumPDM = pdm.slice(-period).reduce((a, b) => a + b, 0);
    const sumNDM = ndm.slice(-period).reduce((a, b) => a + b, 0);

    const diP = sumPDM > 0 ? (sumPDM / atr) * 100 : 0;
    const diM = sumNDM > 0 ? (sumNDM / atr) * 100 : 0;

    return (diP + diM) / 2;
  }

  // ============================================================================
  // MACD - Moving Average Convergence Divergence
  // ============================================================================

  private macd(prices: number[]): { macd: number; signal: number; histogram: number } | undefined {
    if (prices.length < 26) return undefined;

    const ema12 = this.exponentialMovingAverage(prices, 12);
    const ema26 = this.exponentialMovingAverage(prices, 26);
    const macdLine = ema12 - ema26;

    // Signal line (9-period EMA of MACD)
    const signalLine = this.simpleMovingAverage([macdLine], 9);

    return {
      macd: macdLine,
      signal: signalLine,
      histogram: macdLine - signalLine
    };
  }

  // ============================================================================
  // Bollinger Bands
  // ============================================================================

  private bollingerBands(
    prices: number[],
    period: number = 20,
    stdDev: number = 2
  ): { upper: number; middle: number; lower: number; pb: number } | undefined {
    if (prices.length < period) return undefined;

    const recent = prices.slice(-period);
    const sma = this.simpleMovingAverage(recent, period);
    const std = this.standardDeviation(recent, sma);

    const upper = sma + (stdDev * std);
    const lower = sma - (stdDev * std);
    const currentPrice = prices[prices.length - 1];
    const pb = (currentPrice - lower) / (upper - lower) * 100;

    return { upper, middle: sma, lower, pb };
  }

  // ============================================================================
  // EMA - Exponential Moving Average
  // ============================================================================

  private ema(prices: number[], period: number): { ema20: number; ema50: number; ema200: number } {
    return {
      ema20: this.exponentialMovingAverage(prices, 20),
      ema50: this.exponentialMovingAverage(prices, 50),
      ema200: this.exponentialMovingAverage(prices, 200)
    };
  }

  private exponentialMovingAverage(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];

    const recent = prices.slice(-period * 2);
    const sma = this.simpleMovingAverage(recent.slice(0, period), period);
    const multiplier = 2 / (period + 1);

    let ema = sma;
    for (let i = period; i < recent.length; i++) {
      ema = (recent[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  // ============================================================================
  // Volume Indicators
  // ============================================================================

  private volumeIndicators(data: OHLCV[]): { vwap: number; obv: number; voldelta: number } {
    const vwap = this.volumeWeightedAveragePrice(data);
    const obv = this.onBalanceVolume(data);
    const voldelta = this.volumeDelta(data);

    return { vwap, obv, voldelta };
  }

  private volumeWeightedAveragePrice(data: OHLCV[]): number {
    let totalVwp = 0;
    let totalVolume = 0;

    for (const candle of data) {
      const typical = (candle.high + candle.low + candle.close) / 3;
      totalVwp += typical * candle.volume;
      totalVolume += candle.volume;
    }

    return totalVolume > 0 ? totalVwp / totalVolume : 0;
  }

  private onBalanceVolume(data: OHLCV[]): number {
    if (data.length < 2) return 0;

    let obv = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i].close > data[i - 1].close) {
        obv += data[i].volume;
      } else if (data[i].close < data[i - 1].close) {
        obv -= data[i].volume;
      }
    }

    return obv;
  }

  private volumeDelta(data: OHLCV[]): number {
    if (data.length < 2) return 0;
    return data[data.length - 1].volume - data[data.length - 2].volume;
  }

  // ============================================================================
  // Volatility Indicators
  // ============================================================================

  private volatilityIndicators(
    highs: number[],
    lows: number[],
    closes: number[]
  ): { atr: number; bollingerWidth: number } {
    const atr = this.averageTrueRange(highs, lows, closes);
    const bbands = this.bollingerBands(closes, 20, 2);
    const bollingerWidth = bbands ? (bbands.upper - bbands.lower) / bbands.middle : 0;

    return { atr, bollingerWidth };
  }

  private averageTrueRange(highs: number[], lows: number[], closes: number[]): number {
    if (highs.length < 14) return 0;

    const tr = highs.slice(-14).map((h, i) => {
      const idx = highs.length - 14 + i;
      return i === 0
        ? h - lows[idx]
        : Math.max(h - lows[idx], Math.abs(h - closes[idx - 1]), Math.abs(lows[idx] - closes[idx - 1]));
    });

    return tr.reduce((a, b) => a + b, 0) / tr.length;
  }

  // ============================================================================
  // Utility Functions
  // ============================================================================

  private simpleMovingAverage(values: number[], period: number): number {
    const relevant = values.slice(-period);
    return relevant.reduce((a, b) => a + b, 0) / relevant.length;
  }

  private standardDeviation(values: number[], mean: number): number {
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Clear the indicator cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Close all resources
   */
  close(): void {
    this.cache.clear();
  }
}