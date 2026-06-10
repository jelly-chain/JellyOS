// Tax Calculator - Crypto tax accounting
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('TaxCalculator');

export interface Trade {
  date: Date;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  fees: number;
  exchange: string;
}

export interface TaxLot {
  date: Date;
  amount: number;
  costBasis: number;
  side: 'buy';
}

export interface TaxReport {
  year: number;
  shortTerm: TaxSummary;
  longTerm: TaxSummary;
  totalTaxable: number;
  totalGains: number;
  totalLosses: number;
}

export interface TaxSummary {
  proceeds: number;
  costBasis: number;
  gains: number;
  losses: number;
}

export class TaxCalculator {
  private trades: Trade[] = [];
  private lots: Map<string, TaxLot[]> = new Map();

  addTrade(trade: Trade): void {
    this.trades.push(trade);

    if (trade.side === 'buy') {
      if (!this.lots.has(trade.symbol)) {
        this.lots.set(trade.symbol, []);
      }
      this.lots.get(trade.symbol)!.push({
        date: trade.date,
        amount: trade.amount,
        costBasis: trade.price,
        side: 'buy'
      });
    }
  }

  calculate(year: number): TaxReport {
    const yearTrades = this.trades.filter(t => t.date.getFullYear() === year);
    const shortTerm: TaxSummary = { proceeds: 0, costBasis: 0, gains: 0, losses: 0 };
    const longTerm: TaxSummary = { proceeds: 0, costBasis: 0, gains: 0, losses: 0 };

    for (const trade of yearTrades) {
      if (trade.side === 'sell') {
        const { proceeds, cost } = this.matchLot(trade);
        const gain = proceeds - cost - trade.fees;

        const heldDays = this.getHeldDays(trade.symbol, trade.date);

        const summary = heldDays < 365 ? shortTerm : longTerm;
        summary.proceeds += proceeds;
        summary.costBasis += cost;

        if (gain > 0) summary.gains += gain;
        else summary.losses += Math.abs(gain);
      }
    }

    return {
      year,
      shortTerm,
      longTerm,
      totalTaxable: shortTerm.gains + longTerm.gains,
      totalGains: shortTerm.gains + longTerm.gains,
      totalLosses: shortTerm.losses + longTerm.losses
    };
  }

  private matchLot(trade: Trade): { proceeds: number; cost: number } {
    // FIFO matching
    const lots = this.lots.get(trade.symbol) || [];
    let remaining = trade.amount;
    let cost = 0;

    for (let i = 0; i < lots.length && remaining > 0; i++) {
      const lot = lots[i];
      if (lot.amount <= remaining) {
        cost += lot.amount * lot.costBasis;
        remaining -= lot.amount;
        lots.splice(i, 1);
        i--;
      } else {
        cost += remaining * lot.costBasis;
        lot.amount -= remaining;
        remaining = 0;
      }
    }

    return {
      proceeds: trade.amount * trade.price,
      cost
    };
  }

  private getHeldDays(symbol: string, sellDate: Date): number {
    const lots = this.lots.get(symbol) || [];
    if (lots.length === 0) return 0;
    const oldestLot = lots.reduce((oldest, lot) =>
      lot.date < oldest.date ? lot : oldest
    );
    return Math.floor((sellDate.getTime() - oldestLot.date.getTime()) / 86400000);
  }

  close(): void {
    this.trades = [];
    this.lots.clear();
  }
}