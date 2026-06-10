// Options Analyzer Types
// Author: Tentacle OS

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionContract {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiry: string;
  price: number;
  iv: number;
  volume: number;
  openInterest: number;
  greeks: Greeks;
}

export interface OptionsChain {
  symbol: string;
  calls: OptionContract[];
  puts: OptionContract[];
  timestamp: number;
}

export interface StrategyRecommendation {
  type: string;
  strikes: string[];
  expiry: string;
  confidence: number;
  maxRisk: number;
  maxProfit: number;
}