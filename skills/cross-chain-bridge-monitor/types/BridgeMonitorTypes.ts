// Bridge Monitor Types
// Author: Tentacle OS

export interface BridgeFlow {
  protocol: string;
  sourceChain: string;
  destChain: string;
  token: string;
  volume: number;
  count: number;
  avgSize: number;
  timestamp: number;
}

export interface BridgeProtocol {
  name: string;
  tvl: number;
  chains: string[];
  avgTime: number;
  avgFee: number;
}

export interface ChainFlow {
  chain: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  direction: 'inflow' | 'outflow';
  change24h: number;
  timestamp: number;
}