// Smart Money Types
// Author: Tentacle OS

export type WalletCategory = 'VC/Fund' | 'DEX Whale' | 'MEV Bot' | 'Protocol Treasury' | 'Insider' | 'Unknown';

export interface TrackedWallet {
  address: string;
  label: string;
  category: WalletCategory;
  addedAt: number;
  totalTrades: number;
  winRate: number;
  pnl: number;
  status: 'active' | 'paused' | 'removed';
}

export interface SmartMoneySignal {
  wallet: string;
  walletLabel: string;
  category: WalletCategory;
  action: 'buy' | 'sell';
  token: string;
  amount: number;
  usdValue: number;
  timestamp: number;
  confidence: number;
}