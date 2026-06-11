// Contract Event Types
// Author: Tentacle OS

export interface ContractEvent {
  id: string;
  address: string;
  eventName: string;
  chain: string;
  blockNumber: number;
  txHash: string;
  params: Record<string, string>;
  timestamp: number;
  impact: 'low' | 'medium' | 'high';
}

export interface EventFilter {
  id: string;
  address: string;
  eventNames: string[];
  chains: string[];
  active: boolean;
  addedAt: number;
}

export interface EventAlert {
  filterId: string;
  event: ContractEvent;
  triggeredAt: number;
}