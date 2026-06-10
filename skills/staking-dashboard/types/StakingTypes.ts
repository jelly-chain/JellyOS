// Staking Types
// Author: Tentacle OS

export interface StakingChain {
  name: string;
  apy: number;
  minStake: number;
  unbondingDays: number;
  validators: Validator[];
}

export interface Validator {
  id: string;
  name: string;
  commission: number;
  uptime: number;
  totalStaked: number;
  mevEnabled: boolean;
  slashed: boolean;
  apy: number;
}

export interface StakingPosition {
  id: string;
  chain: string;
  validator: string;
  amount: number;
  apy: number;
  rewards: number;
  startDate: number;
  status: 'active' | 'unbonding' | 'withdrawn';
}

export interface YieldComparison {
  chain: string;
  validator: string;
  apy: number;
  commission: number;
  netApy: number;
  risk: 'low' | 'medium' | 'high';
}