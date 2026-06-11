// FeeArbitrage Types
// Author: Tentacle OS

export interface FeeArbitrageConfig {
  enabled: boolean;
  threshold: number;
}

export interface FeeArbitrageResult {
  success: boolean;
  data?: any;
}

export interface FeeArbitrageMetrics {
  count: number;
  value: number;
}
