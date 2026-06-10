// Backtester - Historical strategy backtesting
// Author: Tentacle OS

import type { PositionManager } from '../../../src/trading/PositionManager';
import type { OHLCV, PerformanceMetrics } from '../types/StrategyTypes';
import { IndicatorEngine } from '../indicators/IndicatorEngine';

/**
 * Backtester runs historical simulations of trading strategies
 */
export class Backtester {
  private results: Map<string, PerformanceMetrics> = new Map();

  constructor(
    private positionManager: PositionManager,
    private indicatorEngine: IndicatorEngine
  ) {}

  /**
   * Run backtest for a strategy
   */
  async run(strategyName: string, days: number = 30): Promise<PerformanceMetrics> {
    // Fetch historical data
    const historicalData = await this.fetchHistoricalData(days);

    const trades: TradeResult[] = [];
    let wins = 0;
    let losses = 0;
    let totalWin = 0;
    let totalLoss = 0;
    let equityCurve: number[] = [10000]; // Starting portfolio

    for (const candle of historicalData) {
      const signal = this.generateHistoricalSignal(strategyName, candle);

      if (signal) {
        const result = this.simulateTrade(signal, candle);
        trades.push(result);

        if (result.pnl > 0) {
          wins++;
          totalWin += result.pnl;
        } else {
          losses++;
          totalLoss += Math.abs(result.pnl);
        }

        const lastEquity = equityCurve[equityCurve.length - 1];
        equityCurve.push(lastEquity + result.pnl);
      }
    }

    // Calculate metrics
    const metrics = this.calculateMetrics(trades, equityCurve);
    this.results.set(strategyName, metrics);

    return metrics;
  }

  /**
   * Fetch historical OHLCV data
   */
  private async fetchHistoricalData(days: number): Promise<OHLCV[]> {
    // Simulated data - in production would call price feed
    const data: OHLCV[] = [];
    const now = Date.now();
    const candleInterval = 3600000; // 1 hour

    for (let i = days * 24; i >= 0; i--) {
      const timestamp = now - (i * candleInterval);
      const open = 50000 + Math.random() * 10000;
      const high = open * (1 + Math.random() * 0.05);
      const low = open * (1 - Math.random() * 0.05);
      const close = low + Math.random() * (high - low);
      const volume = 1000000 + Math.random() * 5000000;

      data.push({ timestamp, open, high, low, close, volume });
    }

    return data;
  }

  /**
   * Generate signal from historical candle
   */
  private generateHistoricalSignal(strategyName: string, candle: OHLCV): any {
    // Simplified - would use actual strategy logic
    const indicators = this.indicatorEngine.calculate([candle], 'TEST');

    if (strategyName === 'mean-reversion' && indicators.rsi) {
      if (indicators.rsi < 30) {
        return { side: 'long', entry: candle.close };
      }
      if (indicators.rsi > 70) {
        return { side: 'short', entry: candle.close };
      }
    }

    return null;
  }

  /**
   * Simulate a trade
   */
  private simulateTrade(signal: any, candle: OHLCV): TradeResult {
    const entry = signal.entry;
    const stopLoss = signal.side === 'long' ? entry * 0.95 : entry * 1.05;
    const takeProfit = signal.side === 'long' ? entry * 1.10 : entry * 0.90;

    // Simplified simulation
    const exitPrice = candle.close;
    const pnl = signal.side === 'long'
      ? (exitPrice - entry) * 100
      : (entry - exitPrice) * 100;

    return {
      entry,
      exit: exitPrice,
      pnl,
      side: signal.side,
      duration: 24 // hours
    };
  }

  /**
   * Calculate performance metrics
   */
  private calculateMetrics(trades: TradeResult[], equityCurve: number[]): PerformanceMetrics {
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const winRate = totalTrades > 0 ? wins / totalTrades : 0;

    const avgWin = trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins || 0;
    const avgLoss = Math.abs(trades.filter(t => t.pnl <= 0).reduce((s, t) => s + t.pnl, 0)) / (totalTrades - wins) || 0;

    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;

    const maxDrawdown = this.calculateMaxDrawdown(equityCurve);
    const sharpeRatio = this.calculateSharpeRatio(equityCurve);

    return {
      winRate,
      profitFactor,
      sharpeRatio,
      maxDrawdown,
      totalTrades,
      avgWin,
      avgLoss,
      expectancy: (winRate * avgWin) - ((1 - winRate) * avgLoss),
      calmarRatio: maxDrawdown > 0 ? (equityCurve[equityCurve.length - 1] - 10000) / maxDrawdown : 0
    };
  }

  /**
   * Calculate maximum drawdown
   */
  private calculateMaxDrawdown(equityCurve: number[]): number {
    let peak = equityCurve[0];
    let maxDrawdown = 0;

    for (const equity of equityCurve) {
      if (equity > peak) peak = equity;
      const drawdown = (peak - equity) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    return maxDrawdown;
  }

  /**
   * Calculate Sharpe ratio
   */
  private calculateSharpeRatio(equityCurve: number[]): number {
    if (equityCurve.length < 2) return 0;

    const returns: number[] = [];
    for (let i = 1; i < equityCurve.length; i++) {
      returns.push((equityCurve[i] - equityCurve[i - 1]) / equityCurve[i - 1]);
    }

    const avgReturn = returns.reduce((s, r) => s + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((s, r) => s + Math.pow(r - avgReturn, 2), 0) / returns.length);

    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  /**
   * Get cached results
   */
  getCachedResults(): Map<string, PerformanceMetrics> {
    return this.results;
  }

  /**
   * Clear results cache
   */
  clearCache(): void {
    this.results.clear();
  }

  /**
   * Close all resources
   */
  close(): void {
    this.results.clear();
  }
}

interface TradeResult {
  entry: number;
  exit: number;
  pnl: number;
  side: string;
  duration: number;
}