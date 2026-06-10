// Yield Optimization Engine - Main Entry Point
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import { AaveAggregator } from './aggregators/AaveAggregator';
import { CompoundAggregator } from './aggregators/CompoundAggregator';
import { KaminoAggregator } from './aggregators/KaminoAggregator';
import { LuloAggregator } from './aggregators/LuloAggregator';
import { MorphoAggregator } from './aggregators/MorphoAggregator';
import { RiskScorer } from './risk/RiskScorer';
import { ILCalculator } from './analytics/ILCalculator';
import type { YieldOpportunity, YieldPosition, RiskScore } from './types/YieldTypes';

const logger = new Logger('YieldOptimization');
const metrics = new Metrics();

// ============================================================================
// Yield Optimization Engine Class
// ============================================================================

export interface YieldConfig {
  autoCompound?: boolean;
  maxSlippage?: number;
  riskThreshold?: number;
}

export class YieldOptimizationEngine {
  private aave: AaveAggregator;
  private compound: CompoundAggregator;
  private kamino: KaminoAggregator;
  private lulo: LuloAggregator;
  private morpho: MorphoAggregator;
  private riskScorer: RiskScorer;
  private ilCalculator: ILCalculator;

  constructor(private config: YieldConfig = {}) {
    this.aave = new AaveAggregator();
    this.compound = new CompoundAggregator();
    this.kamino = new KaminoAggregator();
    this.lulo = new LuloAggregator();
    this.morpho = new MorphoAggregator();
    this.riskScorer = new RiskScorer();
    this.ilCalculator = new ILCalculator();
  }

  /**
   * Scan for best yield opportunities
   */
  async scan(asset: string): Promise<YieldOpportunity[]> {
    const opportunities: YieldOpportunity[] = [];

    const [aave, compound, kamino, lulo, morpho] = await Promise.allSettled([
      this.aave.getYields(asset),
      this.compound.getYields(asset),
      this.kamino.getYields(asset),
      this.lulo.getYields(asset),
      this.morpho.getYields(asset)
    ]);

    if (aave.status === 'fulfilled') opportunities.push(...aave.value);
    if (compound.status === 'fulfilled') opportunities.push(...compound.value);
    if (kamino.status === 'fulfilled') opportunities.push(...kamino.value);
    if (lulo.status === 'fulfilled') opportunities.push(...lulo.value);
    if (morpho.status === 'fulfilled') opportunities.push(...morpho.value);

    // Add risk scores
    for (const opp of opportunities) {
      opp.risk = await this.riskScorer.score(opp.protocol, opp.chain);
    }

    // Sort by risk-adjusted yield
    opportunities.sort((a, b) => {
      const aScore = a.apy * a.risk.score / 10;
      const bScore = b.apy * b.risk.score / 10;
      return bScore - aScore;
    });

    metrics.increment('yield.scan', opportunities.length, { asset });

    return opportunities;
  }

  /**
   * Deposit to a protocol
   */
  async deposit(protocol: string, asset: string, amount: number, chain: string): Promise<string> {
    let txHash: string;

    switch (protocol.toLowerCase()) {
      case 'aave':
        txHash = await this.aave.deposit(asset, amount, chain);
        break;
      case 'compound':
        txHash = await this.compound.deposit(asset, amount, chain);
        break;
      case 'kamino':
        txHash = await this.kamino.deposit(asset, amount, chain);
        break;
      case 'lulo':
        txHash = await this.lulo.deposit(asset, amount, chain);
        break;
      case 'morpho':
        txHash = await this.morpho.deposit(asset, amount, chain);
        break;
      default:
        throw new Error(`Unknown protocol: ${protocol}`);
    }

    metrics.increment('yield.deposit', 1, { protocol, chain });
    return txHash;
  }

  /**
   * Withdraw from protocol
   */
  async withdraw(position: string, protocol: string, chain: string): Promise<string> {
    let txHash: string;

    switch (protocol.toLowerCase()) {
      case 'aave':
        txHash = await this.aave.withdraw(position, chain);
        break;
      case 'compound':
        txHash = await this.compound.withdraw(position, chain);
        break;
      case 'kamino':
        txHash = await this.kamino.withdraw(position, chain);
        break;
      case 'lulo':
        txHash = await this.lulo.withdraw(position, chain);
        break;
      case 'morpho':
        txHash = await this.morpho.withdraw(position, chain);
        break;
      default:
        throw new Error(`Unknown protocol: ${protocol}`);
    }

    metrics.increment('yield.withdraw', 1, { protocol, chain });
    return txHash;
  }

  /**
   * Get risk score for a protocol
   */
  async getRiskScore(protocol: string, chain: string): Promise<RiskScore> {
    return this.riskScorer.score(protocol, chain);
  }

  /**
   * Calculate impermanent loss for LP position
   */
  calculateIL(currentPrice: number, priceRange: [number, number]): number {
    return this.ilCalculator.calculate(currentPrice, priceRange);
  }

  /**
   * Close all resources
   */
  close(): void {
    this.aave.close();
    this.compound.close();
    this.kamino.close();
    this.lulo.close();
    this.morpho.close();
    this.riskScorer.close();
    this.ilCalculator.close();
    logger.info('YieldOptimizationEngine closed');
  }
}

export * from './types/YieldTypes';
export { createYieldOptimizationEngine } from './factory';

export function createYieldOptimization(config?: YieldConfig): YieldOptimizationEngine {
  return new YieldOptimizationEngine(config);
}