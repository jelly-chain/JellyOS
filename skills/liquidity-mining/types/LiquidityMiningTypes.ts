// LiquidityMining Types
// Author: Tentacle OS

export interface LiquidityMiningConfig {
  enabled: boolean;
  threshold: number;
}

export interface LiquidityMiningResult {
  success: boolean;
  data?: any;
}

export interface LiquidityMiningMetrics {
  count: number;
  value: number;
}
