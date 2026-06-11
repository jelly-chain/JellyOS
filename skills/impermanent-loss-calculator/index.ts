// Impermanent Loss Calculator
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { ILCalculation, BreakevenAnalysis, HedgeRecommendation } from './types/ILTypes';

const logger = new Logger('ILCalculator');
const metrics = new Metrics();

export class ImpermanentLossCalculator {
  calculateStandardIL(priceRatio: number): number {
    return (2 * Math.sqrt(priceRatio) / (1 + priceRatio) - 1) * 100;
  }

  calculateConcentratedIL(currentPrice: number, lowerPrice: number, upperPrice: number, entryPrice: number): ILCalculation {
    const priceRatio = currentPrice / entryPrice;
    const rangeRatio = upperPrice / lowerPrice;
    const concentratedFactor = Math.sqrt(rangeRatio) / (Math.sqrt(rangeRatio) - 1);

    let il: number;
    if (currentPrice < lowerPrice) {
      il = this.calculateStandardIL(currentPrice / lowerPrice);
    } else if (currentPrice > upperPrice) {
      il = this.calculateStandardIL(upperPrice / currentPrice);
    } else {
      il = this.calculateStandardIL(priceRatio) / concentratedFactor;
    }

    return {
      il: Math.abs(il),
      priceRatio,
      rangeRatio,
      inRange: currentPrice >= lowerPrice && currentPrice <= upperPrice,
      lowerPrice,
      upperPrice,
      currentPrice,
      entryPrice
    };
  }

  breakevenAnalysis(il: number, feeApy: number, daysHeld: number): BreakevenAnalysis {
    const feeEarned = feeApy / 365 * daysHeld;
    const netReturn = feeEarned - il;
    const breakevenDays = il / (feeApy / 365);

    return {
      il,
      feeEarned,
      netReturn,
      breakevenDays: Math.ceil(breakevenDays),
      profitable: netReturn > 0,
      feeApy,
      daysHeld
    };
  }

  recommendHedge(il: number, positionValue: number, symbol: string): HedgeRecommendation {
    if (il < 2) return { hedge: 'none', cost: 0, reason: 'IL too low to hedge' };
    if (il < 5) return { hedge: 'put_option', cost: positionValue * 0.01, reason: 'Light hedge with puts' };
    return { hedge: 'perp_short', cost: positionValue * 0.005, reason: 'Full hedge with perp short' };
  }

  close(): void {}
}

export * from './types/ILTypes';
export { createILCalculator } from './factory';

export function createILCalculator(): ImpermanentLossCalculator {
  return new ImpermanentLossCalculator();
}