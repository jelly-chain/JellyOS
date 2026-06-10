// Swing Strategy - Multi-day trading setups
// Author: Tentacle OS

import type { OHLCV, StrategySignal } from '../types/StrategyTypes';
import { IndicatorEngine } from '../indicators/IndicatorEngine';

export class SwingStrategy {
  private readonly _name = 'swing-analyzer';
  private readonly _description = 'Multi-day swing trade identification with support/resistance';
  private readonly _timeframe = '4h';
  private indicatorEngine: IndicatorEngine;

  constructor(indicatorEngine: IndicatorEngine) {
    this.indicatorEngine = indicatorEngine;
  }

  /**
   * Generate swing trading signals
   */
  generate(data: OHLCV[], symbol: string): StrategySignal[] {
    const signals: StrategySignal[] = [];

    if (data.length < 50) return signals;

    const indicators = this.indicatorEngine.calculate(data, symbol);
    const currentPrice = data[data.length - 1].close;

    // EMA trend alignment
    if (indicators.ema) {
      const bullishAlignment = indicators.ema.ema20 > indicators.ema.ema50 &&
                               indicators.ema.ema50 > indicators.ema.ema200;
      const bearishAlignment = indicators.ema.ema20 < indicators.ema.ema50 &&
                               indicators.ema.ema50 < indicators.ema.ema200;

      if (bullishAlignment && currentPrice > indicators.ema.ema20) {
        signals.push(this.createLongSignal(data, symbol, indicators));
      } else if (bearishAlignment && currentPrice < indicators.ema.ema20) {
        signals.push(this.createShortSignal(data, symbol, indicators));
      }
    }

    // MACD signal line crossover
    if (indicators.macd) {
      const macdLine = indicators.macd.macd;
      const signalLine = indicators.macd.signal;
      const prevMacd = indicators.macd.macd - indicators.macd.histogram;
      const prevSignal = signalLine;

      if (prevMacd < prevSignal && macdLine > signalLine) {
        signals.push(this.createLongSignal(data, symbol, indicators, 'macd-bullish-cross'));
      } else if (prevMacd > prevSignal && macdLine < signalLine) {
        signals.push(this.createShortSignal(data, symbol, indicators, 'macd-bearish-cross'));
      }
    }

    // Support/resistance breakouts
    const support = this.findSupport(data);
    const resistance = this.findResistance(data);

    if (currentPrice > resistance * 1.01) {
      signals.push(this.createLongSignal(data, symbol, indicators, 'resistance-breakout'));
    } else if (currentPrice < support * 0.99) {
      signals.push(this.createShortSignal(data, symbol, indicators, 'support-breakdown'));
    }

    return signals;
  }

  private findSupport(data: OHLCV[]): number {
    // Find recent swing low as support
    let swingLow = data[0].low;
    for (let i = 1; i < data.length; i++) {
      if (data[i].low < swingLow) {
        swingLow = data[i].low;
      }
    }
    return swingLow;
  }

  private findResistance(data: OHLCV[]): number {
    // Find recent swing high as resistance
    let swingHigh = data[0].high;
    for (let i = 1; i < data.length; i++) {
      if (data[i].high > swingHigh) {
        swingHigh = data[i].high;
      }
    }
    return swingHigh;
  }

  private createLongSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    reason: string = 'swing-long'
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || (data[0].high - data[0].low) * 0.02;

    return {
      id: `swing-${symbol}-${Date.now()}-long`,
      symbol,
      side: 'long',
      entry,
      stopLoss: entry - (atr * 2.5),
      takeProfit: entry + (atr * 4),
      confidence: this.calculateConfidence(indicators, 'long'),
      timeframe: this._timeframe,
      reason,
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private createShortSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    reason: string = 'swing-short'
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || (data[0].high - data[0].low) * 0.02;

    return {
      id: `swing-${symbol}-${Date.now()}-short`,
      symbol,
      side: 'short',
      entry,
      stopLoss: entry + (atr * 2.5),
      takeProfit: entry - (atr * 4),
      confidence: this.calculateConfidence(indicators, 'short'),
      timeframe: this._timeframe,
      reason,
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private calculateConfidence(indicators: any, side: string): number {
    let confidence = 55;

    if (indicators.ema) {
      const alignment = indicators.ema.ema20 > indicators.ema.ema50 ? 1 : -1;
      if ((side === 'long' && alignment === 1) || (side === 'short' && alignment === -1)) {
        confidence += 25;
      }
    }

    if (indicators.adx && indicators.adx > 25) {
      confidence += 15;
    }

    return Math.min(100, confidence);
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get timeframe(): string { return this._timeframe; }
}