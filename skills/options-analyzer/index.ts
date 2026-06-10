// Options Analyzer - Full options chain analysis
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { OptionContract, Greeks, OptionsChain, StrategyRecommendation } from './types/OptionsTypes';

const logger = new Logger('OptionsAnalyzer');
const metrics = new Metrics();

export class OptionsAnalyzer {
  private chains: Map<string, OptionsChain> = new Map();

  async getChain(symbol: string): Promise<OptionsChain> {
    const chain = this.buildChain(symbol);
    this.chains.set(symbol, chain);
    return chain;
  }

  private buildChain(symbol: string): OptionsChain {
    const strikes = [40000, 45000, 50000, 55000, 60000, 65000, 70000];
    const expiries = ['2025-07-15', '2025-08-15', '2025-09-15', '2025-12-15'];

    const calls: OptionContract[] = [];
    const puts: OptionContract[] = [];

    for (const strike of strikes) {
      for (const expiry of expiries) {
        calls.push(this.buildContract(symbol, 'call', strike, expiry));
        puts.push(this.buildContract(symbol, 'put', strike, expiry));
      }
    }

    return { symbol, calls, puts, timestamp: Date.now() };
  }

  private buildContract(symbol: string, type: 'call' | 'put', strike: number, expiry: string): OptionContract {
    const spot = 50000;
    const iv = 0.4 + Math.random() * 0.4;
    const daysToExpiry = Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);
    const intrinsic = type === 'call' ? Math.max(0, spot - strike) : Math.max(0, strike - spot);
    const timeValue = spot * iv * Math.sqrt(daysToExpiry / 365) * 0.4;
    const price = intrinsic + timeValue;

    return {
      symbol,
      type,
      strike,
      expiry,
      price,
      iv,
      volume: Math.floor(Math.random() * 10000),
      openInterest: Math.floor(Math.random() * 50000),
      greeks: this.calculateGreeks(spot, strike, daysToExpiry, iv, type)
    };
  }

  calculateGreeks(spot: number, strike: number, dte: number, iv: number, type: 'call' | 'put'): Greeks {
    const sqrtT = Math.sqrt(dte / 365);
    const d1 = (Math.log(spot / strike) + (0.04 + iv * iv / 2) * (dte / 365)) / (iv * sqrtT);
    const d2 = d1 - iv * sqrtT;

    const nd1 = this.normalCDF(d1);
    const nd2 = this.normalCDF(d2);
    const npd1 = this.normalPDF(d1);

    const delta = type === 'call' ? nd1 : nd1 - 1;
    const gamma = npd1 / (spot * iv * sqrtT);
    const theta = type === 'call'
      ? (-spot * npd1 * iv / (2 * sqrtT) - 0.04 * strike * Math.exp(-0.04 * dte / 365) * nd2) / 365
      : (-spot * npd1 * iv / (2 * sqrtT) + 0.04 * strike * Math.exp(-0.04 * dte / 365) * this.normalCDF(-d2)) / 365;
    const vega = spot * npd1 * sqrtT / 100;
    const rho = type === 'call' ? strike * (dte / 365) * Math.exp(-0.04 * dte / 365) * nd2 / 100 : -strike * (dte / 365) * Math.exp(-0.04 * dte / 365) * this.normalCDF(-d2) / 100;

    return { delta, gamma, theta, vega, rho };
  }

  private normalCDF(x: number): number {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.sqrt(2);
    const t = 1 / (1 + p * absX);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return 0.5 * (1 + sign * y);
  }

  private normalPDF(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  async recommendStrategy(symbol: string, outlook: 'bullish' | 'bearish' | 'neutral'): Promise<StrategyRecommendation[]> {
    const chain = await this.getChain(symbol);
    const recommendations: StrategyRecommendation[] = [];

    if (outlook === 'bullish') {
      recommendations.push({ type: 'call_buy', strikes: ['ATM'], expiry: '30D', confidence: 70, maxRisk: 500, maxProfit: 2000 });
      recommendations.push({ type: 'put_spread', strikes: ['OTM', 'further OTM'], expiry: '30D', confidence: 65, maxRisk: 300, maxProfit: 700 });
    } else if (outlook === 'bearish') {
      recommendations.push({ type: 'put_buy', strikes: ['ATM'], expiry: '30D', confidence: 70, maxRisk: 500, maxProfit: 2000 });
      recommendations.push({ type: 'call_spread', strikes: ['OTM', 'further OTM'], expiry: '30D', confidence: 65, maxRisk: 300, maxProfit: 700 });
    } else {
      recommendations.push({ type: 'iron_condor', strikes: ['OTM put', 'further OTM put', 'OTM call', 'further OTM call'], expiry: '30D', confidence: 75, maxRisk: 400, maxProfit: 600 });
      recommendations.push({ type: 'straddle', strikes: ['ATM'], expiry: '15D', confidence: 60, maxRisk: 800, maxProfit: 3000 });
    }

    metrics.increment('options.recommendations', recommendations.length);
    return recommendations;
  }

  async unusualActivity(symbol: string): Promise<{ type: string; description: string }[]> {
    const chain = await this.getChain(symbol);
    const alerts: { type: string; description: string }[] = [];

    for (const opt of [...chain.calls, ...chain.puts]) {
      if (opt.volume > opt.openInterest * 0.5) {
        alerts.push({ type: 'volume_spike', description: `${opt.type} ${opt.strike} ${opt.expiry} volume spike` });
      }
      if (opt.openInterest > 10000 && opt.iv > 0.8) {
        alerts.push({ type: 'high_iv_oi', description: `${opt.type} ${opt.strike} high IV/OI ratio` });
      }
    }

    return alerts;
  }

  close(): void {
    this.chains.clear();
  }
}

export * from './types/OptionsTypes';
export { createOptionsAnalyzer } from './factory';

export function createOptionsAnalyzer(): OptionsAnalyzer {
  return new OptionsAnalyzer();
}