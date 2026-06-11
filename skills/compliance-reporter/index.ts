// Compliance Reporter - Tax and audit reports
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';
import type { ComplianceReport, TaxSummary, TradeRecord } from './types/ComplianceTypes';

const logger = new Logger('ComplianceReporter');
const metrics = new Metrics();

export class ComplianceReporter {
  async generateTaxReport(trades: TradeRecord[], year: number): Promise<TaxSummary> {
    const realized = trades.filter(t => t.closed && t.realizedPnL && t.realizedPnL !== 0);
    const shortTerm = realized.filter(t => this.isShortTerm(t));
    const longTerm = realized.filter(t => !this.isShortTerm(t));

    const shortTermGains = shortTerm.filter(t => t.realizedPnL && t.realizedPnL > 0).reduce((s, t) => s + (t.realizedPnL || 0), 0);
    const shortTermLosses = Math.abs(shortTerm.filter(t => t.realizedPnL && t.realizedPnL < 0).reduce((s, t) => s + (t.realizedPnL || 0), 0));
    const longTermGains = longTerm.filter(t => t.realizedPnL && t.realizedPnL > 0).reduce((s, t) => s + (t.realizedPnL || 0), 0);
    const longTermLosses = Math.abs(longTerm.filter(t => t.realizedPnL && t.realizedPnL < 0).reduce((s, t) => s + (t.realizedPnL || 0), 0));

    return {
      year,
      totalTrades: trades.length,
      realized: { shortTermGains, shortTermLosses, longTermGains, longTermLosses },
      taxableIncome: shortTermGains + longTermGains,
      estimatedTax: (shortTermGains + longTermGains) * 0.25,
      timestamp: Date.now()
    };
  }

  private isShortTerm(trade: TradeRecord): boolean {
    return trade.holdingDays !== undefined && trade.holdingDays < 365;
  }

  async exportCsv(trades: TradeRecord[]): Promise<string> {
    return trades.map(t => `${t.date},${t.symbol},${t.side},${t.amount},${t.price},${t.fees || 0}`).join('\n');
  }

  close(): void {}
}

export * from './types/ComplianceTypes';
export { createComplianceReporter } from './factory';

export function createComplianceReporter(): ComplianceReporter {
  return new ComplianceReporter();
}