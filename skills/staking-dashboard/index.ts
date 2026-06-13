// Staking Dashboard - Multi-chain staking analytics
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { StakingChain, Validator, StakingPosition, YieldComparison } from './types/StakingTypes';

const logger = new Logger('StakingDashboard');
const metrics = new Metrics();

export class StakingDashboard {
  private chains: Map<string, StakingChain> = new Map();
  private positions: Map<string, StakingPosition> = new Map();

  constructor() {
    this.initializeChains();
  }

  private initializeChains(): void {
    this.chains.set('ethereum', { name: 'Ethereum', apy: 3.5, minStake: 32, unbondingDays: 2, validators: this.generateValidators('ethereum', 50) });
    this.chains.set('solana', { name: 'Solana', apy: 6.5, minStake: 0.1, unbondingDays: 2, validators: this.generateValidators('solana', 30) });
    this.chains.set('cosmos', { name: 'Cosmos', apy: 12, minStake: 1, unbondingDays: 21, validators: this.generateValidators('cosmos', 20) });
    this.chains.set('polkadot', { name: 'Polkadot', apy: 14, minStake: 10, unbondingDays: 28, validators: this.generateValidators('polkadot', 15) });
    this.chains.set('avalanche', { name: 'Avalanche', apy: 8, minStake: 25, unbondingDays: 14, validators: this.generateValidators('avalanche', 15) });
  }

  private generateValidators(chain: string, count: number): Validator[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `${chain}-val-${i}`,
      name: `Validator ${i + 1}`,
      commission: 3 + Math.random() * 7,
      uptime: 95 + Math.random() * 5,
      totalStaked: 100000 + Math.random() * 1000000,
      mevEnabled: Math.random() > 0.5,
      slashed: Math.random() > 0.95,
      apy: 3 + Math.random() * 12
    }));
  }

  async getBestYield(asset: string): Promise<YieldComparison[]> {
    const comparisons: YieldComparison[] = [];

    for (const [chainName, chain] of this.chains) {
      const bestValidator = chain.validators
        .filter(v => !v.slashed && v.uptime > 98)
        .sort((a, b) => b.apy - a.apy)[0];

      if (bestValidator) {
        comparisons.push({
          chain: chainName,
          validator: bestValidator.name,
          apy: bestValidator.apy,
          commission: bestValidator.commission,
          netApy: bestValidator.apy * (1 - bestValidator.commission / 100),
          risk: bestValidator.uptime > 99 ? 'low' : bestValidator.uptime > 97 ? 'medium' : 'high'
        });
      }
    }

    return comparisons.sort((a, b) => b.netApy - a.netApy);
  }

  async getValidators(chain: string, sortBy: string = 'apy'): Promise<Validator[]> {
    const chainData = this.chains.get(chain);
    if (!chainData) return [];

    const sorted = [...chainData.validators].sort((a, b) => {
      if (sortBy === 'apy') return b.apy - a.apy;
      if (sortBy === 'uptime') return b.uptime - a.uptime;
      if (sortBy === 'commission') return a.commission - b.commission;
      return 0;
    });

    return sorted;
  }

  async addPosition(chain: string, validator: string, amount: number): Promise<StakingPosition> {
    const id = `stake-${Date.now()}`;
    const chainData = this.chains.get(chain);
    if (!chainData) throw new Error(`Chain ${chain} not supported`);

    const position: StakingPosition = {
      id,
      chain,
      validator,
      amount,
      apy: chainData.apy,
      rewards: 0,
      startDate: Date.now(),
      status: 'active'
    };

    this.positions.set(id, position);
    metrics.increment('stake.position.added', 1, { chain });
    return position;
  }

  async getPositions(): Promise<StakingPosition[]> {
    return Array.from(this.positions.values());
  }

  async estimateRewards(positionId: string, days: number): Promise<number> {
    const position = this.positions.get(positionId);
    if (!position) return 0;
    return (position.amount * position.apy / 100 / 365) * days;
  }

  close(): void {
    this.chains.clear();
    this.positions.clear();
  }
}

export * from './types/StakingTypes';


export { createStakingDashboard } from './factory';
