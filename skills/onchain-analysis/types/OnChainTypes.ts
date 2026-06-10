// OnChain Types
// Author: Tentacle OS

export interface OnChainAddress {
  address: string;
  chain: string;
  label?: string;
  knownType?: 'cex' | 'dex' | 'whale' | 'protocol';
  addedAt: number;
}

export interface Transaction {
  hash: string;
  chain: string;
  from: string;
  to: string;
  value: number;
  tokenSymbol?: string;
  tokenAmount?: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
  gasPrice?: number;
}

export interface WhaleTransaction {
  address: string;
  chain: string;
  symbol: string;
  amount: number;
  usdValue: number;
  direction: 'in' | 'out';
  timestamp: number;
  txHash: string;
}

export interface ContractEvent {
  contract: string;
  chain: string;
  eventName: string;
  params: Record<string, any>;
  impact: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface WhaleConfig {
  threshold: number;
  minConfidence: number;
  checkInterval: number;
  chains: string[];
}

export interface TVLPoint {
  protocol: string;
  chain: string;
  tvl: number;
  timestamp: number;
}