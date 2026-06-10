// Mean Reversion Strategy
// Author: Tentacle OS

import type { OHLCV, StrategySignal } from '../types/StrategyTypes';
import { IndicatorEngine } from '../indicators/IndicatorEngine';

export class MeanReversionStrategy {
  private readonly _name = 'mean-reversion';
  private readonly _description = 'Statistical arbitrage with RSI and Bollinger Bands';
  private readonly _timeframe = '1h';
  private indicatorEngine: IndicatorEngine;

  constructor(indicatorEngine: IndicatorEngine) {
    this.indicatorEngine = indicatorEngine;
  }

  generate(data: OHLCV[], symbol: string): StrategySignal[] {
    const signals: StrategySignal[] = [];

    if (data.length < 25) return signals;

    const indicators = this.indicatorEngine.calculate(data, symbol);
    const currentPrice = data[data.length - 1].close;

    // RSI oversold with BBands lower band touch
    if (indicators.rsi && indicators.bbands) {
      // Extremely oversold - strong buy signal
      if (indicators.rsi < 20 && indicators.bbands.pb < 5) {
        signals.push(this.createLongSignal(data, symbol, indicators, 85));
      }

      // Extremely overbought - strong sell signal
      if (indicators.rsi > 80 && indicators.bbands.pb > 95) {
        signals.push(this.createShortSignal(data, symbol, indicators, 85));
      }

      // Mid-range mean reversion
      if (indicators.rsi < 35 && indicators.bbands.pb < 20) {
        signals.push(this.createLongSignal(data, symbol, indicators, 65));
      }

      if (indicators.rsi > 65 && indicators.bbands.pb > 80) {
        signals.push(this.createShortSignal(data, symbol, indicators, 65));
      }
    }

    // BBands squeeze breakout (volatility contraction)
    if (indicators.bbands && indicators.volatility) {
      const width = (indicators.bbands.upper - indicators.bbands.lower) / indicators.bbands.middle;

      // Squeeze condition - tight bands
      if (width < 0.02) {
        const bbands = indicators.bbands;

        // Breakout play
        if (currentPrice > bbands.upper) {
          signals.push(this.createLongSignal(data, symbol, indicators, 70));
        } else if (currentPrice < bbands.lower) {
          signals.push(this.createShortSignal(data, symbol, indicators, 70));
        }
      }
    }

    // Volume weighted mean reversion
    const vwap = indicators.volume?.vwap;
    if (vwap && Math.abs(currentPrice - vwap) / vwap > 0.03) {
      // Price deviated > 3% from VWAP - mean reversion opportunity
      if (currentPrice < vwap && indicators.rsi && indicators.rsi < 40) {
        signals.push(this.createLongSignal(data, symbol, indicators, 75));
      }
      if (currentPrice > vwap && indicators.rsi && indicators.rsi > 60) {
        signals.push(this.createShortSignal(data, symbol, indicators, 75));
      }
    }

    return signals;
  }

  private createLongSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 60
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.01 * entry;

    return {
      id: `mr-${symbol}-${Date.now()}-long`,
      symbol,
      side: 'long',
      entry,
      stopLoss: indicators.bbands?.lower || entry * 0.95,
      takeProfit: indicators.bbands?.middle || entry * 1.03,
      confidence,
      timeframe: this._timeframe,
      reason: 'mean-reversion-rsi-bbands',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private createShortSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 60
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.01 * entry;

    return {
      id: `mr-${symbol}-${Date.now()}-short`,
      symbol,
      side: 'short',
      entry,
      stopLoss: indicators.bbands?.upper || entry * 1.05,
      takeProfit: indicators.bbands?.middle || entry * 0.97,
      confidence,
      timeframe: this._timeframe,
      reason: 'mean-reversion-rsi-bbands',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get timeframe(): string { return this._timeframe; }
}

// Breakout Strategy
export class BreakoutStrategy {
  private readonly _name = 'breakout-detector';
  private readonly _description = 'Price breakout with volume confirmation';
  private readonly _timeframe = '15m';
  private indicatorEngine: IndicatorEngine;

  constructor(indicatorEngine: IndicatorEngine) {
    this.indicatorEngine = indicatorEngine;
  }

  generate(data: OHLCV[], symbol: string): StrategySignal[] {
    const signals: StrategySignal[] = [];

    if (data.length < 30) return signals;

    const indicators = this.indicatorEngine.calculate(data, symbol);
    const currentPrice = data[data.length - 1].close;
    const currentVolume = data[data.length - 1].volume;

    // Volume surge detection
    const avgVolume = data.slice(-30).reduce((sum, d) => sum + d.volume, 0) / 30;

    if (currentVolume > avgVolume * 2.5) {
      // High volume breakout
      if (currentPrice > data.slice(-30).reduce((max, d) => Math.max(max, d.high), 0)) {
        signals.push(this.createLongSignal(data, symbol, indicators, 80));
      } else if (currentPrice < data.slice(-30).reduce((min, d) => Math.min(min, d.low), Infinity)) {
        signals.push(this.createShortSignal(data, symbol, indicators, 80));
      }
    }

    // Range breakout
    const rangeHigh = data.slice(-50).reduce((max, d) => Math.max(max, d.high), 0);
    const rangeLow = data.slice(-50).reduce((min, d) => Math.min(min, d.low), Infinity);

    if (currentPrice > rangeHigh * 1.02) {
      signals.push(this.createLongSignal(data, symbol, indicators, 75));
    }

    if (currentPrice < rangeLow * 0.98) {
      signals.push(this.createShortSignal(data, symbol, indicators, 75));
    }

    return signals;
  }

  private createLongSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 70
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.015 * entry;

    return {
      id: `bo-${symbol}-${Date.now()}-long`,
      symbol,
      side: 'long',
      entry,
      stopLoss: entry - (atr * 2),
      takeProfit: entry + (atr * 3),
      confidence,
      timeframe: this._timeframe,
      reason: 'breakout-volume',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private createShortSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 70
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.015 * entry;

    return {
      id: `bo-${symbol}-${Date.now()}-short`,
      symbol,
      side: 'short',
      entry,
      stopLoss: entry + (atr * 2),
      takeProfit: entry - (atr * 3),
      confidence,
      timeframe: this._timeframe,
      reason: 'breakdown-volume',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get timeframe(): string { return this._timeframe; }
}

// Trend Strategy
export class TrendStrategy {
  private readonly _name = 'trend-filter';
  private readonly _description = 'ADX-based trend strength filtering';
  private readonly _timeframe = '1h';
  private indicatorEngine: IndicatorEngine;

  constructor(indicatorEngine: IndicatorEngine) {
    this.indicatorEngine = indicatorEngine;
  }

  generate(data: OHLCV[], symbol: string): StrategySignal[] {
    const signals: StrategySignal[] = [];

    if (data.length < 30) return signals;

    const indicators = this.indicatorEngine.calculate(data, symbol);
    const currentPrice = data[data.length - 1].close;

    // ADX trend strength
    if (indicators.adx && indicators.adx > 25) {
      // Strong trend confirmed
      const ema20 = indicators.ema?.ema20;
      const ema50 = indicators.ema?.ema50;

      if (ema20 && ema50) {
        const bullishTrend = ema20 > ema50 && currentPrice > ema20;
        const bearishTrend = ema20 < ema50 && currentPrice < ema20;

        if (bullishTrend) {
          signals.push(this.createLongSignal(data, symbol, indicators, 70));
        } else if (bearishTrend) {
          signals.push(this.createShortSignal(data, symbol, indicators, 70));
        }
      }
    }

    // Parabolic SAR-like trend following
    const recentLows = data.slice(-10).map(d => d.low);
    const recentHighs = data.slice(-10).map(d => d.high);
    const ascending = recentLows.every((low, i) => i === 0 || low >= recentLows[i - 1]);
    const descending = recentHighs.every((high, i) => i === 0 || high <= recentHighs[i - 1]);

    if (ascending && indicators.rsi && indicators.rsi > 50 && indicators.rsi < 70) {
      signals.push(this.createLongSignal(data, symbol, indicators, 65));
    }

    if (descending && indicators.rsi && indicators.rsi < 50 && indicators.rsi > 30) {
      signals.push(this.createShortSignal(data, symbol, indicators, 65));
    }

    return signals;
  }

  private createLongSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 65
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.02 * entry;

    return {
      id: `trend-${symbol}-${Date.now()}-long`,
      symbol,
      side: 'long',
      entry,
      stopLoss: entry - (atr * 2.5),
      takeProfit: entry + (atr * 3.5),
      confidence,
      timeframe: this._timeframe,
      reason: 'trend-adx-follow',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private createShortSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 65
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.02 * entry;

    return {
      id: `trend-${symbol}-${Date.now()}-short`,
      symbol,
      side: 'short',
      entry,
      stopLoss: entry + (atr * 2.5),
      takeProfit: entry - (atr * 3.5),
      confidence,
      timeframe: this._timeframe,
      reason: 'trend-adx-follow',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get timeframe(): string { return this._timeframe; }
}

// Momentum Strategy
export class MomentumStrategy {
  private readonly _name = 'momentum-screener';
  private readonly _description = 'Abnormal momentum detection';
  private readonly _timeframe = '5m';
  private indicatorEngine: IndicatorEngine;

  constructor(indicatorEngine: IndicatorEngine) {
    this.indicatorEngine = indicatorEngine;
  }

  generate(data: OHLCV[], symbol: string): StrategySignal[] {
    const signals: StrategySignal[] = [];

    if (data.length < 20) return signals;

    const currentPrice = data[data.length - 1].close;
    const prevPrice = data[data.length - 2].close;
    const change = ((currentPrice - prevPrice) / prevPrice) * 100;

    // Strong momentum detection
    if (Math.abs(change) > 5) {
      const indicators = this.indicatorEngine.calculate(data, symbol);

      if (change > 0) {
        signals.push(this.createLongSignal(data, symbol, indicators, Math.min(95, 60 + Math.abs(change))));
      } else {
        signals.push(this.createShortSignal(data, symbol, indicators, Math.min(95, 60 + Math.abs(change))));
      }
    }

    // Volume momentum surge
    const recentVolume = data.slice(-5).reduce((sum, d) => sum + d.volume, 0) / 5;
    const avgVolume = data.slice(-50).reduce((sum, d) => sum + d.volume, 0) / 50;

    if (recentVolume > avgVolume * 5) {
      signals.push(this.createMomentumSignal(data, symbol, indicators, change > 0 ? 'long' : 'short'));
    }

    return signals;
  }

  private createMomentumSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    side: 'long' | 'short'
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators?.volatility?.atr || 0.01 * entry;

    return {
      id: `mom-${symbol}-${Date.now()}-${side}`,
      symbol,
      side,
      entry,
      stopLoss: side === 'long' ? entry - (atr * 1.5) : entry + (atr * 1.5),
      takeProfit: side === 'long' ? entry + (atr * 2.5) : entry - (atr * 2.5),
      confidence: 75,
      timeframe: this._timeframe,
      reason: 'momentum-volume-surge',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private createLongSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 65
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.015 * entry;

    return {
      id: `mom-${symbol}-${Date.now()}-long`,
      symbol,
      side: 'long',
      entry,
      stopLoss: entry - (atr * 2),
      takeProfit: entry + (atr * 2.5),
      confidence,
      timeframe: this._timeframe,
      reason: 'momentum-positive',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  private createShortSignal(
    data: OHLCV[],
    symbol: string,
    indicators: any,
    confidence: number = 65
  ): StrategySignal {
    const entry = data[data.length - 1].close;
    const atr = indicators.volatility?.atr || 0.015 * entry;

    return {
      id: `mom-${symbol}-${Date.now()}-short`,
      symbol,
      side: 'short',
      entry,
      stopLoss: entry + (atr * 2),
      takeProfit: entry - (atr * 2.5),
      confidence,
      timeframe: this._timeframe,
      reason: 'momentum-negative',
      timestamp: Date.now(),
      strategy: this._name,
      leverage: 1
    };
  }

  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get timeframe(): string { return this._timeframe; }
}