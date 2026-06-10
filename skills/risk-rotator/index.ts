// Risk Rotator - Dynamic risk allocation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { RiskRegime, RiskAllocation, RotationSignal } from './types/RiskRotatorTypes';

const logger = new Logger('RiskRotator');
const metrics = new Metrics();

export class RiskRotator {
  private riskOnAssets = ['BTC', 'ETH', 'SOL', 'ARB', 'OP', 'MATIC'];
  private riskOffAssets = ['USDC', 'USDT', 'DAI', 'BUSD'];

  async detectRegime(): Promise<RiskRegime> {
    const vix = 15 + Math.random() * 35;
    const btcChange7d = -15 + Math.random() * 30;
    const fundingRate = -0.002 + Math.random() * 0.004;
    const fearGreed = Math.floor(Math.random() * 100);

    let score = 50;
    if (vix > 25) score -= 20;
    if (btcChange7d < -5) score -= 15;
    if (fundingRate < -0.001) score -= 10;
    if (fearGreed < 30) score -= 20;
    if (fearGreed > 70) score += 15;

    const regime = score > 60 ? 'risk_on' : score > 40 ? 'neutral' : 'risk_off';

    return {
      regime,
      score,
      vix,
      btcChange7d,
      fundingRate,
      fearGreed,
      timestamp: Date.now()
    };
  }

  async getRecommendedAllocation(): Promise<RiskAllocation> {
    const regime = await this.detectRegime();
    let riskOnWeight: number, riskOffWeight: number;

    switch (regime.regime) {
      case 'risk_on':
        riskOnWeight = 0.8;
        riskOffWeight = 0.2;
        break;
      case 'risk_off':
        riskOnWeight = 0.3;
        riskOffWeight = 0.7;
        break;
      default:
        riskOnWeight = 0.5;
        riskOffWeight = 0.5;
    }

    return {
      riskOn: { weight: riskOnWeight, assets: this.riskOnAssets },
      riskOff: { weight: riskOffWeight, assets: this.riskOffAssets },
      regime: regime.regime,
      timestamp: Date.now()
    };
  }

  async getRotationSignal(): Promise<RotationSignal> {
    const regime = await this.detectRegime();
    const allocation = await this.getRecommendedAllocation();

    return {
      action: regime.regime === 'risk_on' ? 'increase_risk' : regime.regime === 'risk_off' ? 'decrease_risk' : 'hold',
      fromRegime: regime.regime,
      targetAllocation: allocation,
      urgency: Math.abs(regime.score - 50) > 20 ? 'high' : 'medium',
      timestamp: Date.now()
    };
  }

  close(): void {}
}

export * from './types/RiskRotatorTypes';
export { createRiskRotator } from './factory';

export function createRiskRotator(): RiskRotator {
  return new RiskRotator();
}