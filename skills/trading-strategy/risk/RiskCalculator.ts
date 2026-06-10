// Risk Calculator - Position sizing and risk management
// Author: Tentacle OS

import type { StrategySignal, StrategyConfig, StrategyContext, RiskCheck } from '../types/StrategyTypes';

/**
 * Risk calculator handles position sizing and risk validation
 */
export class RiskCalculator {
  private warnings: string[] = [];

  /**
   * Filter signals based on risk rules
   */
  filterSignals(signals: StrategySignal[], config: StrategyConfig, context?: StrategyContext): StrategySignal[] {
    const filtered: StrategySignal[] = [];

    for (const signal of signals) {
      const riskCheck = this.validateSignal(signal, config, context);

      if (riskCheck.passed) {
        filtered.push(signal);
      } else {
        this.warnings.push(`Signal rejected: ${signal.symbol} - ${riskCheck.violations.join(', ')}`);
      }
    }

    return filtered;
  }

  /**
   * Validate a signal against risk rules
   */
  validateSignal(
    signal: StrategySignal,
    config: StrategyConfig,
    context?: StrategyContext
  ): RiskCheck {
    const violations: string[] = [];
    const details: Record<string, number> = {};

    // Confidence check
    if (signal.confidence < config.minConfidence) {
      violations.push(`low-confidence:${signal.confidence}<${config.minConfidence}`);
    }
    details.confidence = signal.confidence;

    // Risk-reward ratio check
    const rrr = this.calculateRRR(signal);
    if (rrr < 1.5) {
      violations.push(`poor-rrr:${rrr.toFixed(2)}<1.5`);
    }
    details.rrr = rrr;

    // Portfolio context checks
    if (context) {
      const portfolioValue = context.portfolioValue;

      // Position size check
      const positionValue = signal.size || 0;
      const positionPct = portfolioValue > 0 ? positionValue / portfolioValue : 0;
      if (positionPct > config.riskPerTrade * 2) {
        violations.push(`oversized-position:${(positionPct * 100).toFixed(1)}%`);
      }
      details.positionPct = positionPct;

      // Maximum positions check
      if (context.currentPositions >= config.maxPositions) {
        violations.push(`max-positions:${context.currentPositions}`);
      }
      details.currentPositions = context.currentPositions;

      // Duplicate symbol check
      if (context.openSymbols.includes(signal.symbol)) {
        violations.push(`duplicate-symbol:${signal.symbol}`);
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      details
    };
  }

  /**
   * Calculate risk-reward ratio
   */
  calculateRRR(signal: StrategySignal): number {
    const risk = Math.abs(signal.entry - signal.stopLoss) / signal.entry;
    const reward = Math.abs(signal.takeProfit - signal.entry) / signal.entry;
    return reward > 0 ? risk / reward : 0;
  }

  /**
   * Calculate position size
   */
  calculatePositionSize(
    portfolioValue: number,
    riskPerTrade: number,
    entry: number,
    stopLoss: number,
    leverage: number = 1
  ): number {
    const riskAmount = portfolioValue * riskPerTrade;
    const stopDistance = Math.abs(entry - stopLoss) / entry;
    const size = stopDistance > 0 ? (riskAmount / stopDistance) / entry / leverage : 0;

    return Math.max(0, size);
  }

  /**
   * Check portfolio-level risk
   */
  checkPortfolioRisk(
    openPositions: StrategySignal[],
    portfolioValue: number,
    maxDrawdown: number = 0.1
  ): RiskCheck {
    const violations: string[] = [];
    const details: Record<string, number> = {};

    // Calculate total exposure
    const totalExposure = openPositions.reduce((sum, pos) => {
      return sum + (pos.size || 0) * (pos.leverage || 1);
    }, 0);

    const exposurePct = portfolioValue > 0 ? totalExposure / portfolioValue : 0;
    details.exposurePct = exposurePct;

    // Maximum drawdown check
    const maxLoss = openPositions.reduce((sum, pos) => {
      const pnl = pos.side === 'long'
        ? (pos.entry - pos.stopLoss) / pos.entry
        : (pos.entry - pos.takeProfit) / pos.entry;
      return sum + Math.abs(pnl);
    }, 0);

    details.maxLoss = maxLoss;
    if (maxLoss > maxDrawdown) {
      violations.push(`drawdown-risk:${maxLoss.toFixed(2)}`);
    }

    return {
      passed: violations.length === 0,
      violations,
      details
    };
  }

  /**
   * Get current warnings
   */
  getWarnings(): string[] {
    return [...this.warnings];
  }

  /**
   * Clear warnings
   */
  clearWarnings(): void {
    this.warnings = [];
  }
}