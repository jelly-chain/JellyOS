// Trading Strategy Engine - Main Entry Point
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { PositionManager } from '../../../src/trading/PositionManager';
import { StrategyRegistry } from './registry/StrategyRegistry';
import { IndicatorEngine } from './indicators/IndicatorEngine';
import { RiskCalculator } from './risk/RiskCalculator';
import { SignalGenerator } from './signals/SignalGenerator';
import { Backtester } from './backtesting/Backtester';
import { ScalpingStrategy } from './strategies/ScalpingStrategy';
import { SwingStrategy } from './strategies/SwingStrategy';
import { MeanReversionStrategy } from './strategies/MeanReversionStrategy';
import { BreakoutStrategy } from './strategies/BreakoutStrategy';
import { TrendStrategy } from './strategies/TrendStrategy';
import { MomentumStrategy } from './strategies/MomentumStrategy';
import type { StrategySignal, StrategyResult, PerformanceMetrics, StrategyConfig, StrategyContext, OHLCV } from './types/StrategyTypes';

const logger = new Logger('TradingStrategy');
const metrics = new Metrics();

// ============================================================================
// Trading Strategy Engine Class
// ============================================================================

export class TradingStrategyEngine {
  private registry: StrategyRegistry;
  private indicatorEngine: IndicatorEngine;
  private riskCalculator: RiskCalculator;
  private signalGenerator: SignalGenerator;
  private backtester: Backtester;

  constructor(private positionManager: PositionManager) {
    this.registry = new StrategyRegistry();
    this.indicatorEngine = new IndicatorEngine();
    this.riskCalculator = new RiskCalculator();
    this.signalGenerator = new SignalGenerator(this.indicatorEngine, this.riskCalculator);
    this.backtester = new Backtester(this.positionManager, this.indicatorEngine);

    this.initializeDefaultStrategies();
    logger.info('TradingStrategyEngine initialized');
  }

  /**
   * Initialize built-in strategies
   * Each strategy is loaded from its implementation file
   */
  private initializeDefaultStrategies(): void {
    // Scalping strategy - 1-5 minute timeframes
    this.registerStrategy('scalping-sniper', {
      name: 'scalping-sniper',
      description: 'Micro-scalping on momentum breakouts',
      timeframe: '1m',
      minConfidence: 75,
      maxPositions: 10,
      riskPerTrade: 0.02,
      enabled: true
    });

    // Swing trading strategy - 4h-1d timeframes
    this.registerStrategy('swing-analyzer', {
      name: 'swing-analyzer',
      description: 'Multi-day swing trade identification',
      timeframe: '4h',
      minConfidence: 65,
      maxPositions: 5,
      riskPerTrade: 0.05,
      enabled: true
    });

    // Mean reversion strategy
    this.registerStrategy('mean-reversion', {
      name: 'mean-reversion',
      description: 'Statistical arbitrage with RSI and Bollinger Bands',
      timeframe: '1h',
      minConfidence: 70,
      maxPositions: 8,
      riskPerTrade: 0.03,
      enabled: true
    });

    // Breakout detection strategy
    this.registerStrategy('breakout-detector', {
      name: 'breakout-detector',
      description: 'Price breakout with volume confirmation',
      timeframe: '15m',
      minConfidence: 70,
      maxPositions: 6,
      riskPerTrade: 0.04,
      enabled: true
    });

    // Trend following strategy
    this.registerStrategy('trend-filter', {
      name: 'trend-filter',
      description: 'ADX-based trend strength filtering',
      timeframe: '1h',
      minConfidence: 60,
      maxPositions: 5,
      riskPerTrade: 0.05,
      enabled: true
    });

    // Momentum screener
    this.registerStrategy('momentum-screener', {
      name: 'momentum-screener',
      description: 'Abnormal momentum detection',
      timeframe: '5m',
      minConfidence: 80,
      maxPositions: 12,
      riskPerTrade: 0.015,
      enabled: true
    });

    logger.info(`Registered ${this.registry.getStrategyCount()} default strategies`);
  }

  /**
   * Register a strategy configuration
   */
  registerStrategy(name: string, config: StrategyConfig): void {
    this.registry.register(name, config);
    metrics.increment('strategy.registered', 1, { strategy: name });
  }

  /**
   * Execute a specific strategy
   */
  async executeStrategy(strategyName: string, marketData: any): Promise<StrategyResult> {
    const strategy = this.registry.get(strategyName);
    if (!strategy?.enabled) {
      logger.warn(`Strategy ${strategyName} not found or disabled`);
      return { signals: [], metrics: this.getDefaultMetrics(), warnings: ['Strategy not available'] };
    }

    const signals = await this.signalGenerator.generate(strategyName, marketData);
    const filteredSignals = this.riskCalculator.filterSignals(signals, strategy);

    metrics.increment('strategy.executed', 1, { strategy: strategyName });

    return {
      signals: filteredSignals,
      metrics: this.getDefaultMetrics(),
      warnings: filteredSignals.length < signals.length ? ['Some signals filtered by risk rules'] : []
    };
  }

  /**
   * Backtest a strategy with historical data
   */
  async backtest(strategyName: string, days: number = 30): Promise<PerformanceMetrics> {
    const strategy = this.registry.get(strategyName);
    if (!strategy) {
      throw new Error(`Strategy ${strategyName} not found`);
    }

    const metrics_result = await this.backtester.run(strategyName, days);
    logger.info(`Backtest completed for ${strategyName}: ${metrics_result.totalTrades} trades, ${(metrics_result.winRate * 100).toFixed(1)}% win rate`);

    return metrics_result;
  }

  /**
   * Get current active signals across all strategies
   */
  getActiveSignals(): StrategySignal[] {
    return this.registry.listEnabled()
      .flatMap(name => this.signalGenerator.getCachedSignals(name));
  }

  /**
   * List all available strategies
   */
  listStrategies(): StrategyConfig[] {
    return this.registry.list();
  }

  /**
   * Update strategy configuration
   */
  updateConfig(strategyName: string, updates: Partial<StrategyConfig>): void {
    this.registry.update(strategyName, updates);
    metrics.increment('strategy.config.updated', 1, { strategy: strategyName });
  }

  /**
   * Get strategy by name
   */
  getStrategy(name: string): StrategyConfig | null {
    return this.registry.get(name);
  }

  /**
   * Enable/disable a strategy
   */
  setEnabled(strategyName: string, enabled: boolean): void {
    this.registry.setEnabled(strategyName, enabled);
    const action = enabled ? 'enabled' : 'disabled';
    logger.info(`Strategy ${strategyName} ${action}`);
  }

  /**
   * Get default performance metrics
   */
  private getDefaultMetrics(): PerformanceMetrics {
    return {
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      totalTrades: 0
    };
  }

  /**
   * Close all strategy resources
   */
  close(): void {
    this.registry.close();
    this.indicatorEngine.close();
    this.signalGenerator.close();
    this.backtester.close();
    logger.info('TradingStrategyEngine closed');
  }
}

// ============================================================================
// Default Export
// ============================================================================

export * from './types/StrategyTypes';
export * from './registry/StrategyRegistry';
export * from './indicators/IndicatorEngine';
export * from './risk/RiskCalculator';
export * from './signals/SignalGenerator';
export * from './backtesting/Backtester';

// Export singleton factory
export function createTradingStrategyEngine(positionManager: PositionManager): TradingStrategyEngine {
  return new TradingStrategyEngine(positionManager);
}