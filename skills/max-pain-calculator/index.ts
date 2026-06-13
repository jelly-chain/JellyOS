// Max Pain Calculator - Options expiry price targeting
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { MaxPainResult, StrikePain, GammaExposure } from './types/MaxPainTypes';

const logger = new Logger('MaxPainCalculator');
const metrics = new Metrics();

export class MaxPainCalculator {
  /**
   * Calculate max pain price for a given options chain
   */
  calculate(
    strikes: number[],
    callOI: number[],
    putOI: number[],
    spotPrice: number
  ): MaxPainResult {
    const painByStrike: StrikePain[] = [];

    for (let i = 0; i < strikes.length; i++) {
      const strike = strikes[i];
      let totalPain = 0;

      for (let j = 0; j < strikes.length; j++) {
        const callStrike = strikes[j];
        const putStrike = strikes[j];

        // Call pain: if strike > callStrike, call buyers lose
        if (strike > callStrike) {
          totalPain += callOI[j] * (strike - callStrike);
        }
        // Put pain: if strike < putStrike, put buyers lose
        if (strike < putStrike) {
          totalPain += putOI[j] * (putStrike - strike);
        }
      }

      painByStrike.push({ strike, pain: totalPain });
    }

    // Find the strike with minimum total pain (max pain for buyers = min pain for sellers)
    const minPain = painByStrike.reduce((min, p) => p.pain < min.pain ? p : min);
    const maxPainPrice = minPain.strike;

    metrics.increment('maxpain.calculated', 1);

    return {
      maxPainPrice,
      spotPrice,
      deviation: (maxPainPrice - spotPrice) / spotPrice,
      painDistribution: painByStrike,
      expiryGravity: this.calculateExpiryGravity(maxPainPrice, spotPrice, 7),
      timestamp: Date.now()
    };
  }

  /**
   * Calculate how strongly price is pulled toward max pain
   */
  private calculateExpiryGravity(maxPain: number, spot: number, daysToExpiry: number): number {
    const distance = Math.abs(maxPain - spot) / spot;
    const timeDecay = Math.max(0, 1 - daysToExpiry / 30);
    return Math.min(1, distance * timeDecay * 10);
  }

  /**
   * Calculate gamma exposure by strike
   */
  calculateGEX(
    strikes: number[],
    callGamma: number[],
    callOI: number[],
    putGamma: number[],
    putOI: number[],
    spotPrice: number
  ): GammaExposure[] {
    return strikes.map((strike, i) => {
      const callGEX = callGamma[i] * callOI[i] * 100 * spotPrice;
      const putGEX = -putGamma[i] * putOI[i] * 100 * spotPrice;
      return { strike, callGEX, putGEX, netGEX: callGEX + putGEX };
    });
  }

  close(): void {}
}

export * from './types/MaxPainTypes';


export { createMaxPainCalculator } from './factory';
