// Signal Generator - Generate trading signals from strategies
// Author: Tentacle OS

import type { StrategySignal, MarketData, StrategyContext } from '../types/StrategyTypes';
import { IndicatorEngine } from '../indicators/IndicatorEngine';
import { RiskCalculator } from '../risk/RiskCalculator';

/**
 * Signal generator creates trading signals based on strategy rules
 */
export class SignalGenerator {
  private cachedSignals: Map<string, StrategySignal[]> = new Map();

  constructor(
    private indicatorEngine: IndicatorEngine,
    private riskCalculator: RiskCalculator
  ) {}

  /**
   * Generate signals for a specific strategy
   */
  async generate(strategyName: string, marketData: MarketData): Promise<StrategySignal[]> {
    const signals: StrategySignal[] = [];

    switch (strategyName) {
      case 'scalping-sniper':
        signals.push(...this.generateScalpingSignals(marketData));
        break;
      case 'swing-analyzer':
        signals.push(...this.generateSwingSignals(marketData));
        break;
      case 'mean-reversion':
        signals.push(...this.generateMeanReversionSignals(marketData));
        break;
      case 'breakout-detector':
        signals.push(...this.generateBreakoutSignals(marketData));
        break;
      case 'trend-filter':
        signals.push(...this.generateTrendSignals(marketData));
        break;
      case 'momentum-screener':
        signals.push(...this.generateMomentumSignals(marketData));
        break;
      default:
        // Fallback to generic signal generation
        signals.push(...this.generateGenericSignals(marketData));
    }

    // Cache signals
    this.cachedSignals.set(strategyName, signals);
    return signals;
  }

  // ============================================================================
  // Scalping Sniper Strategy
  // ============================================================================

  private generateScalpingSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

    if (!indicators.rsi || !indicators.bbands) return signals;

    // RSI oversold bounce with Bollinger Bands support
    if (indicators.rsi < 30 && data.price <= indicators.bbands.lower * 1.02) {
      signals.push(this.createSignal(data, 'long', indicators));
    }

    // RSI overbought rejection
    if (indicators.rsi > 70 && data.price >= indicators.bbands.upper * 0.98) {
      signals.push(this.createSignal(data, 'short', indicators));
    }

    return signals;
  }

  // ============================================================================
  // Swing Analyzer Strategy
  // ============================================================================

  private generateSwingSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

    if (!indicators.ema) return signals;

    const currentPrice = data.price;
    const ema20 = indicators.ema.ema20;
    const ema50 = indicators.ema.ema50;
    const ema200 = indicators.ema.ema200;

    // Bullish EMA alignment
    if (ema20 > ema50 && ema50 > ema200 && currentPrice > ema20) {
      signals.push(this.createSignal(data, 'long', indicators));
    }

    // Bearish EMA alignment
    if (ema20 < ema50 && ema50 < ema200 && currentPrice < ema20) {
      signals.push(this.createSignal(data, 'short', indicators));
    }

    return signals;
  }

  // ============================================================================
  // Mean Reversion Strategy
  // ============================================================================

  private generateMeanReversionSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

    if (!indicators.rsi || !indicators.bbands) return signals;

    // Bollinger Bands %B strategy
    if (indicators.bbands.pb < 10 && indicators.rsi < 35) {
      signals.push(this.createSignal(data, 'long', indicators));
    }

    if (indicators.bbands.pb > 90 && indicators.rsi > 65) {
      signals.push(this.createSignal(data, 'short', indicators));
    }

    return signals;
  }

  // ============================================================================
  // Breakout Detector Strategy
  // ============================================================================

  private generateBreakoutSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];

    // Volume surge detection
    if (data.volume > data.high24h * 2) {
      const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

      // Bullish breakout
      if (data.price > data.high24h) {
        signals.push(this.createSignal(data, 'long', indicators));
      }

      // Bearish breakdown
      if (data.price < data.low24h) {
        signals.push(this.createSignal(data, 'short', indicators));
      }
    }

    return signals;
  }

  // ============================================================================
  // Trend Filter Strategy
  // ============================================================================

  private generateTrendSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

    if (!indicators.adx) return signals;

    // Strong trend with ADX > 25
    if (indicators.adx > 25) {
      if (data.change24h > 5) {
        signals.push(this.createSignal(data, 'long', indicators));
      } else if (data.change24h < -5) {
        signals.push(this.createSignal(data, 'short', indicators));
      }
    }

    return signals;
  }

  // ============================================================================
  // Momentum Screener Strategy
  // ============================================================================

  private generateMomentumSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

    // Unusual momentum detection
    if (data.change24h > 30 && data.volume > 1000000) {
      signals.push(this.createSignal(data, 'long', indicators, 85));
    }

    if (data.change24h < -30 && data.volume > 1000000) {
      signals.push(this.createSignal(data, 'short', indicators, 80));
    }

    return signals;
  }

  // ============================================================================
  // Generic Signal Generation
  // ============================================================================

  private generateGenericSignals(data: MarketData): StrategySignal[] {
    const signals: StrategySignal[] = [];
    const indicators = this.indicatorEngine.calculate(data.ohlcv, data.symbol);

    // Basic momentum signal
    if (data.change24h > 10) {
      signals.push(this.createSignal(data, 'long', indicators, 50));
    } else if (data.change24h < -10) {
      signals.push(this.createSignal(data, 'short', indicators, 50));
    }

    return signals;
  }

  // ============================================================================
  // Signal Creation Helper
  // ============================================================================

  private createSignal(
    data: MarketData,
    side: 'long' | 'short',
    indicators: any,
    confidence?: number
  ): StrategySignal {
    const atr = indicators.volatility?.atr || (data.high24h - data.low24h) * 0.02;
    const entry = data.price;

    // Calculate stop loss and take profit based on side
    const stopLoss = side === 'long'
      ? entry - (atr * 2)
      : entry + (atr * 2);

    const takeProfit = side === 'long'
      ? entry + (atr * 3)
      : entry - (atr * 3);

    // Confidence based on indicator strength
    const calculatedConfidence = confidence || this.calculateConfidence(indicators, side);

    return {
      id: `${data.symbol}-${side}-${Date.now()}`,
      symbol: data.symbol,
      side,
      entry,
      stopLoss,
      takeProfit,
      confidence: calculatedConfidence,
      timeframe: '1h',
      reason: this.generateReason(side, indicators),
      timestamp: Date.now(),
      strategy: 'auto-generated',
      size: 0, // Will be calculated by risk manager
      leverage: 1
    };
  }

  private calculateConfidence(indicators: any, side: string): number {
    let confidence = 50; // Base confidence

    if (indicators.rsi) {
      if (side === 'long' && indicators.rsi < 30) confidence += 20;
      if (side === 'short' && indicators.rsi > 70) confidence += 20;
    }

    if (indicators.adx && indicators.adx > 25) confidence += 15;
    if (indicators.macd && indicators.macd.histogram > 0) confidence += 10;

    return Math.min(100, confidence);
  }

  private generateReason(side: string, indicators: any): string {
    const reasons: string[] = [];

    if (indicators.rsi) {
      if (indicators.rsi < 30) reasons.push('oversold-rsi');
      if (indicators.rsi > 70) reasons.push('overbought-rsi');
    }

    if (indicators.adx) {
      if (indicators.adx > 25) reasons.push('strong-trend');
    }

    if (indicators.macd) {
      if (indicators.macd.histogram > 0) reasons.push('positive-macd');
    }

    return side + '-' + (reasons.length > 0 ? reasons.join('-') : 'momentum');
  }

  // ============================================================================
  // Public Methods
  // ============================================================================

  /**
   * Get cached signals
   */
  getCachedSignals(strategyName: string): StrategySignal[] {
    return this.cachedSignals.get(strategyName) || [];
  }

  /**
   * Clear signal cache
   */
  clearCache(): void {
    this.cachedSignals.clear();
  }

  /**
   * Close all resources
   */
  close(): void {
    this.cachedSignals.clear();
  }
}