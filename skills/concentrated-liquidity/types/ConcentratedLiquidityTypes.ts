// ConcentratedLiquidity Types
// Author: Tentacle OS

export interface ConcentratedLiquidityConfig {
  enabled: boolean;
  threshold: number;
}

export interface ConcentratedLiquidityResult {
  success: boolean;
  data?: any;
}

export interface ConcentratedLiquidityMetrics {
  count: number;
  value: number;
}
