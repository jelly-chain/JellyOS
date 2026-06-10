// Pattern Recognizer - Candlestick and technical patterns
// Author: Tentacle OS

import type { PatternSignal, OHLCV } from '../types/DataAnalyticsTypes';
import { Logger } from '../../../../src/core/utils/Logger';

const logger = new Logger('PatternRecognizer');

export class PatternRecognizer {
  /**
   * Find patterns in OHLCV data
   */
  find(data: OHLCV[], symbol: string): PatternSignal[] {
    const patterns: PatternSignal[] = [];

    if (data.length < 10) return patterns;

    // Candlestick patterns
    patterns.push(...this.findCandlestickPatterns(data));

    // Volume patterns
    patterns.push(...this.findVolumePatterns(data));

    // Price action patterns
    patterns.push(...this.findPriceActionPatterns(data));

    return patterns;
  }

  /**
   * Find candlestick patterns
   */
  private findCandlestickPatterns(data: OHLCV[]): PatternSignal[] {
    const patterns: PatternSignal[] = [];

    if (data.length < 3) return patterns;

    const [prev2, prev1, current] = data.slice(-3);

    // Doji pattern
    if (this.isDoji(current)) {
      patterns.push({
        pattern: 'Doji',
        signal: 'neutral',
        confidence: 60,
        timeframe: '1h',
        description: 'Indecision pattern - potential reversal'
      });
    }

    // Hammer/Hanging Man
    if (this.isHammer(prev1) && prev1.close > prev2.close) {
      patterns.push({
        pattern: 'Hammer',
        signal: 'buy',
        confidence: 70,
        timeframe: '1h',
        description: 'Bullish reversal pattern at support'
      });
    }

    // Shooting Star
    if (this.isShootingStar(prev1) && prev1.close < prev2.close) {
      patterns.push({
        pattern: 'Shooting Star',
        signal: 'sell',
        confidence: 70,
        timeframe: '1h',
        description: 'Bearish reversal pattern at resistance'
      });
    }

    return patterns;
  }

  /**
   * Find volume patterns
   */
  private findVolumePatterns(data: OHLCV[]): PatternSignal[] {
    const patterns: PatternSignal[] = [];

    if (data.length < 20) return patterns;

    const avgVolume = data.slice(-20).reduce((sum, d) => sum + d.volume, 0) / 20;
    const currentVolume = data[data.length - 1].volume;

    // Volume surge
    if (currentVolume > avgVolume * 3) {
      patterns.push({
        pattern: 'Volume Surge',
        signal: 'buy',
        confidence: 65,
        timeframe: '1h',
        description: 'Unusual volume spike - momentum building'
      });
    }

    return patterns;
  }

  /**
   * Find price action patterns
   */
  private findPriceActionPatterns(data: OHLCV[]): PatternSignal[] {
    const patterns: PatternSignal[] = [];

    if (data.length < 10) return patterns;

    const recent = data.slice(-10);

    // Higher highs/lows
    const higherHighs = this.findHigherHighs(recent);
    const higherLows = this.findHigherLows(recent);

    if (higherHighs && higherLows) {
      patterns.push({
        pattern: 'Uptrend',
        signal: 'buy',
        confidence: 75,
        timeframe: '1h',
        description: 'Higher highs and higher lows confirmed'
      });
    }

    const lowerHighs = this.findLowerHighs(recent);
    const lowerLows = this.findLowerLows(recent);

    if (lowerHighs && lowerLows) {
      patterns.push({
        pattern: 'Downtrend',
        signal: 'sell',
        confidence: 75,
        timeframe: '1h',
        description: 'Lower highs and lower lows confirmed'
      });
    }

    return patterns;
  }

  private isDoji(candle: OHLCV): boolean {
    const body = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;
    return body / range < 0.1;
  }

  private isHammer(candle: OHLCV): boolean {
    const lowerWick = candle.low - Math.min(candle.open, candle.close);
    const upperWick = Math.max(candle.open, candle.close) - candle.high;
    const body = Math.abs(candle.open - candle.close);

    return lowerWick > body * 2 && upperWick < body * 0.5;
  }

  private isShootingStar(candle: OHLCV): boolean {
    const upperWick = Math.max(candle.open, candle.close) - candle.high;
    const lowerWick = candle.low - Math.min(candle.open, candle.close);
    const body = Math.abs(candle.open - candle.close);

    return upperWick > body * 2 && lowerWick < body * 0.5;
  }

  private findHigherHighs(data: OHLCV[]): boolean {
    for (let i = 1; i < data.length; i++) {
      if (data[i].high <= data[i - 1].high) return false;
    }
    return true;
  }

  private findHigherLows(data: OHLCV[]): boolean {
    for (let i = 1; i < data.length; i++) {
      if (data[i].low >= data[i - 1].low) return false;
    }
    return true;
  }

  private findLowerHighs(data: OHLCV[]): boolean {
    for (let i = 1; i < data.length; i++) {
      if (data[i].high >= data[i - 1].high) return false;
    }
    return true;
  }

  private findLowerLows(data: OHLCV[]): boolean {
    for (let i = 1; i < data.length; i++) {
      if (data[i].low <= data[i - 1].low) return false;
    }
    return true;
  }

  close(): void {}
}

interface OHLCV {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}