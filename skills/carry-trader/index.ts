// Carry Trader - Cross-asset yield and funding rate arbitrage
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { CarryOpportunity, FundingRate, BasisData, CarryPosition } from './types/CarryTypes';

const logger = new Logger('CarryTrader');
const metrics = new Metrics();

export class CarryTrader {
  private positions: Map<string, CarryPosition> = new Map();

  async scan(): Promise<CarryOpportunity[]> {
    const opportunities: CarryOpportunity[] = [];
    const symbols = ['ETH', 'SOL', 'BTC', 'ARB', 'OP', 'MATIC', 'BNB'];

    for (const symbol of symbols) {
      const funding = await this.getFundingRate(symbol);
      const basis = await this.getBasis(symbol);
      const lendingRate = await this.getLendingRate(symbol);

      if (funding.rate > 0.001) {
        opportunities.push({
          symbol,
          type: 'funding_arb',
          apy: funding.rate * 365 * 100,
          direction: 'long_spot_short_perp',
          risk: 'low',
          exchanges: ['Binance', 'Bybit', 'OKEx'],
          confidence: 80
        });
      }

      if (basis.spread > 0.02) {
        opportunities.push({
          symbol,
          type: 'basis_trade',
          apy: basis.spread * 100,
          direction: 'long_spot_short_perp',
          risk: 'medium',
          exchanges: ['Binance'],
          confidence: 70
        });
      }

      if (lendingRate.diff > 2) {
        opportunities.push({
          symbol,
          type: 'yield_carry',
          apy: lendingRate.diff,
          direction: `borrow_${lendingRate.lowExchange}_deposit_${lendingRate.highExchange}`,
          risk: 'medium',
          exchanges: [lendingRate.lowExchange, lendingRate.highExchange],
          confidence: 65
        });
      }
    }

    return opportunities.sort((a, b) => b.apy - a.apy);
  }

  private async getFundingRate(symbol: string): Promise<FundingRate> {
    return {
      symbol,
      rate: -0.001 + Math.random() * 0.004,
      nextFunding: Date.now() + 28800000,
      predicted: -0.001 + Math.random() * 0.003,
      exchanges: { Binance: 0.001, Bybit: 0.0012, OKEx: 0.0008 }
    };
  }

  private async getBasis(symbol: string): Promise<BasisData> {
    const spot = 50000 + Math.random() * 10000;
    const perp = spot * (1 + (Math.random() - 0.5) * 0.02);
    return {
      symbol,
      spot,
      perp,
      spread: (perp - spot) / spot,
      annualized: ((perp - spot) / spot) * 365 * 100,
      daysToExpiry: 15 + Math.floor(Math.random() * 75)
    };
  }

  private async getLendingRate(symbol: string): Promise<any> {
    const rates = { Aave: 2 + Math.random() * 5, Compound: 1.5 + Math.random() * 4, Binance: 3 + Math.random() * 6 };
    const entries = Object.entries(rates);
    const sorted = entries.sort((a, b) => a[1] - b[1]);
    return { diff: sorted[1][1] - sorted[0][1], lowExchange: sorted[0][0], highExchange: sorted[1][1] };
  }

  async openPosition(symbol: string, type: string, amount: number): Promise<CarryPosition> {
    const id = `carry-${Date.now()}`;
    const position: CarryPosition = { id, symbol, type, amount, entryTime: Date.now(), pnl: 0, status: 'open' };
    this.positions.set(id, position);
    metrics.increment('carry.position.opened', 1, { symbol, type });
    return position;
  }

  async closePosition(id: string): Promise<boolean> {
    const pos = this.positions.get(id);
    if (pos) { pos.status = 'closed'; return true; }
    return false;
  }

  close(): void { this.positions.clear(); }
}

export * from './types/CarryTypes';


export { createCarryTrader } from './factory';
