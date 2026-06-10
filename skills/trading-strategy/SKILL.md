---
name: trading-strategy
description: Advanced trading strategies with technical indicators, backtesting, and signal generation for multi-chain markets
author: Tentacle OS
version: 2.0.0
category: trading
---

# Trading Strategy Engine

Advanced trading strategy implementation with technical indicators, backtesting capabilities, and signal generation across multi-chain markets.

## Capabilities

- **Strategy Types**: Scalping, swing, mean-reversion, breakout, trend-following
- **Indicators**: RSI, ADX, Bollinger Bands, Fibonacci, MACD, Volume Profile
- **Backtesting**: Historical strategy testing with performance metrics
- **Risk Management**: Position sizing, stop-loss, take-profit automation
- **Multi-Chain**: Supports EVM chains, Solana, and Cosmos

## Strategy Framework

Each strategy implements the `TradingStrategy` interface:

```typescript
interface StrategySignal {
  symbol: string;
  side: 'long' | 'short';
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number; // 0-100
  timeframe: string;
  reason: string;
}

interface StrategyResult {
  signals: StrategySignal[];
  metrics: PerformanceMetrics;
  warnings: string[];
}

interface PerformanceMetrics {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
}
```

## Commands

- `/strategy run <strategy_name>` — Execute a specific strategy
- `/strategy backtest <strategy_name> [days]` — Backtest strategy
- `/strategy signals` — List current active signals
- `/strategy list` — Show available strategies
- `/strategy config <strategy_name>` — Configure strategy parameters

## Risk Controls

- Max position size: 5% of portfolio per trade
- Minimum R/R ratio: 1.5:1 before entry
- Daily max drawdown: 10% of portfolio
- Auto-stop on consecutive losses (3 strikes)