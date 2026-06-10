// Strategy Types - Core interfaces and types
// Author: Tentacle OS

/**
 * Strategy signal definition
 */
export interface StrategySignal {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number; // 0-100
  timeframe: string;
  reason: string;
  timestamp: number;
  strategy: string;
  size?: number;
  leverage?: number;
}

/**
 * Strategy configuration
 */
export interface StrategyConfig {
  name: string;
  description: string;
  timeframe: string;
  minConfidence: number;
  maxPositions: number;
  riskPerTrade: number; // Percentage of portfolio
  enabled: boolean;
  parameters?: Record<string, any>;
}

/**
 * Market data input for strategies
 */
export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  high24h: number;
  low24h: number;
  change24h: number;
  ohlcv: OHLCV[];
  orderbook?: Orderbook;
}

/**
 * OHLCV candle data
 */
export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Orderbook data
 */
export interface Orderbook {
  bids: [number, number][];
  asks: [number, number][];
  spread: number;
  depth: number;
}

/**
 * Performance metrics from backtesting
 */
export interface PerformanceMetrics {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  calmarRatio: number;
}

/**
 * Strategy result output
 */
export interface StrategyResult {
  signals: StrategySignal[];
  metrics: PerformanceMetrics;
  warnings: string[];
}

/**
 * Risk check result
 */
export interface RiskCheck {
  passed: boolean;
  violations: string[];
  details: Record<string, number>;
}

/**
 * Trade execution parameters
 */
export interface TradeExecutionParams {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  slippage?: number;
  deadline?: number;
}

/**
 * Strategy context for decision making
 */
export interface StrategyContext {
  portfolioValue: number;
  currentPositions: number;
  openSymbols: string[];
  timestamp: number;
  marketSentiment?: number;
  volatility?: number;
}

// ============================================================================
// Constants and Enums
// ============================================================================

export enum StrategyType {
  SCALPING = 'scalping',
  SWING = 'swing',
  MEAN_REVERSION = 'mean-reversion',
  BREAKOUT = 'breakout',
  TREND_FOLLOWING = 'trend-following',
  MOMENTUM = 'momentum',
  ARBITRAGE = 'arbitrage',
  MACRO = 'macro'
}

export enum Timeframe {
  ONE_MIN = '1m',
  FIVE_MIN = '5m',
  FIFTEEN_MIN = '15m',
  ONE_HOUR = '1h',
  FOUR_HOUR = '4h',
  ONE_DAY = '1d',
  ONE_WEEK = '1w'
}

export const DEFAULT_RISK_LIMITS = {
  maxPositionSize: 0.05,
  maxLeverage: 3,
  minConfidence: 65,
  maxDrawdown: 0.10,
  dailyLossLimit: 0.05
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate risk-reward ratio
 */
export function calculateRRR(entry: number, stopLoss: number, takeProfit: number): number {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  return reward > 0 ? risk / reward : 0;
}

/**
 * Validate signal meets minimum requirements
 */
export function validateSignal(signal: StrategySignal, config: StrategyConfig): RiskCheck {
  const violations: string[] = [];
  const details: Record<string, number> = {};

  if (signal.confidence < config.minConfidence) {
    violations.push(`confidence-low: ${signal.confidence} < ${config.minConfidence}`);
  }

  const rrr = calculateRRR(signal.entry, signal.stopLoss, signal.takeProfit);
  if (rrr < 1.5) {
    violations.push(`rrr-low: ${rrr.toFixed(2)} < 1.5`);
  }

  return {
    passed: violations.length === 0,
    violations,
    details: { ...details, rrr, confidence: signal.confidence }
  };
}

/**
 * Calculate position size based on risk parameters
 */
export function calculatePositionSize(
  portfolioValue: number,
  riskPerTrade: number,
  entry: number,
  stopLoss: number,
  leverage: number = 1
): number {
  const risk = Math.abs(entry - stopLoss) / entry;
  const size = (portfolioValue * riskPerTrade) / (risk * leverage);
  return Math.max(0, size);
}