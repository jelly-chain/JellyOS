// Yield Aggregator - Multi-protocol yield scanner
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { YieldOpportunity, YieldScanResult } from './types/YieldAggregatorTypes';

const logger = new Logger('YieldAggregator');
const metrics = new Metrics();

export class YieldAggregator {
  private protocols = ['Aave', 'Compound', 'Kamino', 'Lulo', 'Morpho', 'Yearn', 'Curve', 'Convex', 'Pendle', 'Ethena'];

  async scanAll(asset: string): Promise<YieldScanResult> {
    const opportunities: YieldOpportunity[] = [];

    for (const protocol of this.protocols) {
      const apy = this.getProtocolAPY(protocol, asset);
      const tvl = this.getProtocolTVL(protocol);
      const risk = this.getProtocolRisk(protocol);
      const gasCost = this.estimateGas(protocol);

      opportunities.push({
        protocol,
        asset,
        apy,
        netApy: apy - gasCost,
        tvl,
        risk,
        gasCost,
        chain: this.getProtocolChain(protocol),
        type: this.getProtocolType(protocol),
        lastUpdated: Date.now()
      });
    }

    opportunities.sort((a, b) => b.netApy - a.netApy);

    metrics.increment('yield.scan', opportunities.length, { asset });

    return {
      asset,
      opportunities,
      best: opportunities[0],
      timestamp: Date.now()
    };
  }

  private getProtocolAPY(protocol: string, asset: string): number {
    const baseRates: Record<string, number> = {
      'Aave': 4, 'Compound': 3.5, 'Kamino': 12, 'Lulo': 8, 'Morpho': 6,
      'Yearn': 10, 'Curve': 7, 'Convex': 9, 'Pendle': 15, 'Ethena': 20
    };
    return (baseRates[protocol] || 5) * (0.5 + Math.random());
  }

  private getProtocolTVL(protocol: string): number {
    const tvlMap: Record<string, number> = {
      'Aave': 5000000000, 'Compound': 3000000000, 'Kamino': 1500000000, 'Lulo': 800000000,
      'Morpho': 2000000000, 'Yearn': 1000000000, 'Curve': 2500000000, 'Convex': 1200000000,
      'Pendle': 500000000, 'Ethena': 3000000000
    };
    return tvlMap[protocol] || 100000000;
  }

  private getProtocolRisk(protocol: string): number {
    const riskMap: Record<string, number> = {
      'Aave': 9, 'Compound': 9, 'Kamino': 7, 'Lulo': 7, 'Morpho': 8,
      'Yearn': 7, 'Curve': 8, 'Convex': 7, 'Pendle': 6, 'Ethena': 6
    };
    return riskMap[protocol] || 5;
  }

  private estimateGas(protocol: string): number {
    const gasMap: Record<string, number> = {
      'Aave': 0.05, 'Compound': 0.04, 'Kamino': 0.01, 'Lulo': 0.01, 'Morpho': 0.05,
      'Yearn': 0.08, 'Curve': 0.06, 'Convex': 0.07, 'Pendle': 0.06, 'Ethena': 0.03
    };
    return gasMap[protocol] || 0.05;
  }

  private getProtocolChain(protocol: string): string {
    const chainMap: Record<string, string> = {
      'Aave': 'Multi', 'Compound': 'Multi', 'Kamino': 'Solana', 'Lulo': 'Solana',
      'Morpho': 'Ethereum/Base', 'Yearn': 'Multi', 'Curve': 'Ethereum', 'Convex': 'Ethereum',
      'Pendle': 'Ethereum/Arbitrum', 'Ethena': 'Ethereum'
    };
    return chainMap[protocol] || 'Ethereum';
  }

  private getProtocolType(protocol: string): string {
    const typeMap: Record<string, string> = {
      'Aave': 'lending', 'Compound': 'lending', 'Kamino': 'lending', 'Lulo': 'aggregator',
      'Morpho': 'lending', 'Yearn': 'vault', 'Curve': 'lp', 'Convex': 'lp',
      'Pendle': 'yield-trading', 'Ethena': 'basis'
    };
    return typeMap[protocol] || 'other';
  }

  close(): void {}
}

export * from './types/YieldAggregatorTypes';
export { createYieldAggregator } from './factory';

export function createYieldAggregator(): YieldAggregator {
  return new YieldAggregator();
}