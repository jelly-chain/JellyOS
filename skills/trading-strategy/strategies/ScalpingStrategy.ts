// Scalping Strategy - High-frequency micro-trading
// Author: Tentacle OS

import type { OHLCV, StrategySignal } from '../types/StrategyTypes';
import { IndicatorEngine } from '../indicators/IndicatorEngine';

export class ScalpingStrategy {
  private readonly _name = 'scalping-sniper';
  private readonly _description = 'Micro-scalping on momentum breakouts with tight stops';
  private readonly _timeframe = '1m';
  private indicatorEngine: IndicatorEngine;

  constructor(indicatorEngine: IndicatorEngine) {
    this.indicatorEngine = indicatorEngine;
  }

  /**
   * Generate scalping signals
   */
  generate(data: OHLCV[], symbol: string): StrategySignal[] {
    const signals: StrategySignal[] = [];

    if (data.length < 21) return signals;

    const indicators = this.indicatorEngine.calculate(data, symbol);
    const currentPrice = data[data.length - 1].close;

    // RSI oversold bounce with Bollinger Bands support
    if (indicators.rsi && indicators.bbands && indicators.rsi < 25) {
      if (currentPrice <= indicators.bbands.lower * 1.03) {
        signals.push(this.createLongSignal(data, symbol, indicators));
      }
    }

    // RSI overbought rejection
    if (indicators.rsi && indicators.bbands && indicators.rsi > 75) {
      if (currentPrice >= indicators.bbands.upper * 0.97) {
        signals.push(this.createShortSignal(data, symbol, indicators));
      }
    }

    // EMA scalping - price returning to EMA
    if (indicators.ema && indicators.bbands) {
      const ema20 = indicators.ema.ema20;
      if (Math.abs(currentPrice - ema20) / ema20 < 0.005) {
        // Price near EMA - potential mean reversion
        if (currentPrice > ema20 && indicators.rsi && indicators.rsi < 50) {
          signals.push(this.createLongSignal(data, symbol, indicators, 70));
        } else if (currentPrice < ema20 && indicators.rsi && indicators.rsi > 50) {
          signals.push(this.createShortSignal(data, symbol, indicators, 70));
        }
      }
    }

    // Volume spike scalping
    const recentVolume = data.slice(-5).reduce((sum, d) => sum + d.volume, 0) / 5;
    const avgVolume = data.slice(-50).reduce((sum, d) => sum + d.volume, 0) / 50;

    if (recentVolume > avgVolume * 3) {
      // High volume - momentum play
      if (data[data.length - 1].close > data[data.length - 2].close) {
        signals.push(this.createLongSignal(data, symbol, indicators, 65));
      } else {
        signals.push(this.createShortSignal(data, symbol, indicators, 65));
      }
    }

    return signals;
  }

  private createLongSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence?: number
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || (data[0].high - data[0].low) * 0.01;

    return {
      id: `scalp-${symbol}-${Date.now()}-long`,
      symbol,
      side: 'long',
      entry,
      stopLoss: entry - (atr * 1.5),
      takeProfit: entry + (atr * 2),
      confidence: confidence || this.calculateConfidence(indicators, 'long'),
      timeframe: this._timeframe,
      reason: 'scalping-rsi-bbands',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 2
    };
  }

  private createShortSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence?: number
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || (data[0].high - data[0].low) * 0.01;

    return {
      id: `scalp-${symbol}-${Date.now()}-short`,
      symbol,
      side: 'short',
      entry,
      stopLoss: entry + (atr * 1.5),
      takeProfit: entry - (atr * 2),
      confidence: confidence || this.calculateConfidence(indicators, 'short'),
      timeframe: this._timeframe,
      reason: 'scalping-rsi-bbands',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 2
    };
  }

  private calculateConfidence(indicators: any, side: string): number {
    let confidence = 60;

    if (indicators.rsi) {
      if (side === 'long' && indicators.rsi < 25) confidence += 20;
      if (side === 'short' && indicators.rsi > 75) confidence += 20;
    }

    if (indicators.bbands) {
      const pb = indicators.bbands.pb;
      if (side === 'long' && pb < 10) confidence += 15;
      if (side === 'short' && pb > 90) confidence += 15;
    }

    return Math.min(100, confidence);
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get timeframe(): string { return this._timeframe; }
}