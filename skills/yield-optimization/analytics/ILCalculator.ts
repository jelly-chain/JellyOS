// Impermanent Loss Calculator - LP position IL calculation
// Author: Tentacle OS

import type { ILCalculation } from '../types/YieldTypes';
import { Logger } from '../../../../src/core/utils/Logger';

const logger = new Logger('ILCalculator');

export class ILCalculator {
  /**
   * Calculate impermanent loss for concentrated liquidity
   */
  calculate(
    currentPrice: number,
    priceRange: [number, number]
  ): number {
    const lower = priceRange[0];
    const upper = priceRange[1];

    if (currentPrice < lower) {
      // Below range - HODL would be better
      return Math.abs(currentPrice - lower) / (upper - lower);
    }

    if (currentPrice > upper) {
      // Above range - HODL would be better
      return Math.abs(currentPrice - upper) / (upper - lower);
    }

    // Within range - some IL but earning fees
    // IL is minimized near the middle of the range
    const position = (currentPrice - lower) / (upper - lower);
    return Math.sin(Math.PI * position) * 0.02; // Max 2% IL in range
  }

  /**
   * Calculate IL for uniswap v3 position
   */
  calculateUniV3(
    currentPrice: number,
    lowerPrice: number,
    upperPrice: number,
    amount0: number,
    amount1: number
  ): ILCalculation {
    const lower = lowerPrice;
    const upper = upperPrice;
    const current = currentPrice;

    let il = 0;

    if (current < lower) {
      // All in token1
      const token0Value = amount0 * current;
      const token1Value = amount1;
      const hodlValue = amount0 * lower + amount1;
      il = (hodlValue - token1Value) / hodlValue;
    } else if (current > upper) {
      // All in token0
      const token0Value = amount0;
      const token1Value = amount1 * current;
      const hodlValue = amount0 + amount1 * upper;
      il = (hodlValue - token0Value) / hodlValue;
    } else {
      // In range - use concentrated formula
      const ratio = (current - lower) / (upper - lower);
      il = Math.sin(Math.PI * ratio) * 0.03 * Math.abs(amount0 - amount1) / (amount0 + amount1);
    }

    return {
      il: Math.abs(il),
      range: [lower, upper],
      prices: { upper, lower, current }
    };
  }

  /**
   * Estimate breakeven fees for IL
   */
  breakevenFees(il: number, feeApy: number): number {
    // APY needed to break even on IL
    return (il / 365) * 100; // Daily fee percentage
  }

  /**
   * Close calculator
   */
  close(): void {}
}