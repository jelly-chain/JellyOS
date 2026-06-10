// Portfolio Rebalancer - Asset allocation management
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';

const logger = new Logger('PortfolioRebalancer');
const metrics = new Metrics();

export interface TargetAllocation {
  asset: string;
  target: number; // 0-1 percentage
  min: number;
  max: number;
}

export interface Position {
  symbol: string;
  value: number;
  weight: number;
  pnl: number;
}

export interface RebalanceAction {
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  reason: string;
}

export class PortfolioRebalancer {
  private targets: TargetAllocation[] = [];

  constructor() {
    this.setDefaultTargets();
  }

  setDefaultTargets(): void {
    this.targets = [
      { asset: 'BTC', target: 0.30, min: 0.20, max: 0.40 },
      { asset: 'ETH', target: 0.20, min: 0.15, max: 0.30 },
      { asset: 'SOL', target: 0.10, min: 0.05, max: 0.15 },
      { asset: 'USDC', target: 0.20, min: 0.10, max: 0.30 },
      { asset: 'Other', target: 0.20, min: 0.10, max: 0.30 }
    ];
  }

  analyze(positions: Position[]): RebalanceAction[] {
    const actions: RebalanceAction[] = [];
    const totalValue = positions.reduce((sum, p) => sum + p.value, 0);

    for (const pos of positions) {
      const target = this.targets.find(t => t.asset === pos.symbol);

      if (target) {
        const deviation = pos.weight - target.target;

        if (deviation > target.max - target.target) {
          actions.push({
            symbol: pos.symbol,
            side: 'sell',
            amount: pos.value * deviation,
            reason: `Overweight by ${(deviation * 100).toFixed(1)}%`
          });
        } else if (deviation < target.min - target.target) {
          actions.push({
            symbol: pos.symbol,
            side: 'buy',
            amount: pos.value * Math.abs(deviation),
            reason: `Underweight by ${(Math.abs(deviation) * 100).toFixed(1)}%`
          });
        }
      } else if (pos.symbol !== 'USDC' && pos.weight > 0.05) {
        // Non-target asset over 5%
        actions.push({
          symbol: pos.symbol,
          side: 'sell',
          amount: pos.value * 0.5,
          reason: 'Non-target allocation'
        });
      }
    }

    metrics.increment('rebalance.actions', actions.length);

    return actions;
  }

  async taxLossHarvest(positions: Position[]): Promise<RebalanceAction[]> {
    const actions: RebalanceAction[] = [];
    const losingPositions = positions.filter(p => p.pnl < -0.1); // >10% loss

    for (const pos of losingPositions) {
      actions.push({
        symbol: pos.symbol,
        side: 'sell',
        amount: pos.value * 0.5,
        reason: `Tax-loss harvesting (${(pos.pnl * 100).toFixed(1)}% loss)`
      });
    }

    return actions;
  }

  close(): void {
    this.targets = [];
  }
}