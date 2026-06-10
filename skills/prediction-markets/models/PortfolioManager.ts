// Portfolio Manager - Prediction market portfolio tracking
// Author: Tentacle OS

import type { Position, PortfolioSummary } from '../types/PredictionTypes';
import { Logger } from '../../../../../src/core/utils/Logger';

const logger = new Logger('PredictionPortfolio');

export class PortfolioManager {
  private positions: Position[] = [];

  /**
   * Add position to tracking
   */
  addPosition(position: Position): void {
    this.positions.push(position);
  }

  /**
   * Calculate P&L summary
   */
  calculatePnL(positions: Position[]): PortfolioSummary {
    const realized = positions
      .filter(p => p.status === 'closed')
      .reduce((sum, p) => sum + p.pnl, 0);

    const unrealized = positions
      .filter(p => p.status === 'open')
      .reduce((sum, p) => sum + (p.currentPrice - p.entryPrice) * p.size, 0);

    const totalValue = positions.reduce((sum, p) => sum + p.size * p.currentPrice, 0);

    // Group by platform
    const platforms: Record<string, number> = {};
    for (const pos of positions) {
      platforms[pos.platform] = (platforms[pos.platform] || 0) + pos.size;
    }

    return {
      totalValue,
      realized,
      unrealized,
      positions: positions.length,
      platforms
    };
  }

  /**
   * Get platform exposure
   */
  getPlatformExposure(positions: Position[]): Record<string, number> {
    const exposure: Record<string, number> = {};

    for (const pos of positions) {
      const value = pos.size * pos.currentPrice;
      exposure[pos.platform] = (exposure[pos.platform] || 0) + value;
    }

    const total = Object.values(exposure).reduce((sum, v) => sum + v, 0);

    // Convert to percentages
    for (const platform of Object.keys(exposure)) {
      exposure[platform] = total > 0 ? exposure[platform] / total : 0;
    }

    return exposure;
  }

  /**
   * Get diversification score
   */
  getDiversification(positions: Position[]): number {
    const uniqueMarkets = new Set(positions.map(p => p.market)).size;
    const totalPositions = positions.length;

    return totalPositions > 0 ? uniqueMarkets / totalPositions : 0;
  }

  /**
   * Get correlated positions
   */
  getCorrelated(positions: Position[], correlationThreshold: number = 0.7): Position[][] {
    // In production - would use actual correlation data
    // For now, just return empty
    return [];
  }

  /**
   * Risk check - max positions per platform
   */
  checkPositionLimits(
    positions: Position[],
    maxPerPlatform: number = 10
  ): { passed: boolean; violations: string[] } {
    const violations: string[] = [];
    const platformCounts: Record<string, number> = {};

    for (const pos of positions) {
      platformCounts[pos.platform] = (platformCounts[pos.platform] || 0) + 1;
    }

    for (const [platform, count] of Object.entries(platformCounts)) {
      if (count > maxPerPlatform) {
        violations.push(`${platform}: ${count} positions > ${maxPerPlatform}`);
      }
    }

    return {
      passed: violations.length === 0,
      violations
    };
  }

  /**
   * Close portfolio manager
   */
  close(): void {
    this.positions = [];
  }
}