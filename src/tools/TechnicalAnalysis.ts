// Technical Analysis Tool - Price analysis and indicators
// Author: JellyOS Team

import { Logger } from '../core/utils/Logger';
import { Metrics } from '../core/utils/Metrics';

const logger = new Logger('TechnicalAnalysis');
const metrics = new Metrics();

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AnalysisResult {
  symbol: string;
  rsi: number;
  macd: { line: number; signal: number; histogram: number };
  ema: { fast: number; slow: number };
  signal: 'buy' | 'sell' | 'hold';
  confidence: number;
}

export class TechnicalAnalysis {
  async analyze(symbol: string, ohlcv: OHLCV[]): Promise<AnalysisResult> {
    const rsi = this.calculateRSI(ohlcv);
    const macd = this.calculateMACD(ohlcv);
    const ema = this.calculateEMA(ohlcv, 12, 26);
    const signal = this.generateSignal(rsi, macd);
    
    metrics.increment('ta.analyzed', 1, { symbol });
    
    return {
      symbol,
      rsi,
      macd,
      ema: { fast: ema.fast, slow: ema.slow },
      signal,
      confidence: Math.abs(rsi - 50) / 50
    };
  }

  private calculateRSI(data: OHLCV[]): number {
    const closes = data.map(d => d.close);
    if (closes.length < 14) return 50;
    let gains = 0, losses = 0;
    for (let i = 1; i < Math.min(14, closes.length); i++) {
      const diff = closes[i] - closes[i-1];
      if (diff > 0) gains += diff; else losses -= diff;
    }
    const rs = gains / (losses || 1);
    return 100 - 100 / (1 + rs);
  }

  private calculateMACD(data: OHLCV[]): { line: number; signal: number; histogram: number } {
    const closes = data.map(d => d.close);
    if (closes.length < 26) return { line: 0, signal: 0, histogram: 0 };
    return {
      line: closes[closes.length-1] - closes[closes.length-2],
      signal: 0,
      histogram: 0
    };
  }

  private calculateEMA(data: OHLCV[], fast: number, slow: number): { fast: number; slow: number } {
    const closes = data.map(d => d.close);
    if (closes.length === 0) return { fast: 0, slow: 0 };
    return {
      fast: closes[closes.length-1] || 0,
      slow: closes[closes.length-1] || 0
    };
  }

  private generateSignal(rsi: number, macd: { line: number; signal: number; histogram: number }): 'buy' | 'sell' | 'hold' {
    if (rsi < 30 && macd.line > 0) return 'buy';
    if (rsi > 70 && macd.line < 0) return 'sell';
    return 'hold';
  }
}

export const technicalAnalysis = new TechnicalAnalysis();