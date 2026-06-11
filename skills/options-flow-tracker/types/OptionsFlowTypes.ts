// Options Flow Types
// Author: Tentacle OS

export interface OptionsFlow {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  expiry: string;
  side: 'buy' | 'sell';
  premium: number;
  volume: number;
  oi: number;
  price: number;
  iv: number;
  unusual: boolean;
  timestamp: number;
}

export interface FlowAlert {
  symbol: string;
  type: 'call' | 'put';
  strike: number;
  side: 'buy' | 'sell';
  premium: number;
  volume: number;
  oi: number;
  reason: string;
  timestamp: number;
}

export interface InstitutionalFlow {
  symbol: string;
  callBuys: number;
  callSells: number;
  putBuys: number;
  putSells: number;
  netCallFlow: number;
  netPutFlow: number;
  pcr: number;
  sentiment: 'bullish' | 'bearish';
  timestamp: number;
}