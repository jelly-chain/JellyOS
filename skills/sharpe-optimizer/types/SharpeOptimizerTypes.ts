// SharpeOptimizer Types
// Author: Tentacle OS

export interface SharpeOptimizerConfig {
  enabled: boolean;
  threshold: number;
}

export interface SharpeOptimizerResult {
  success: boolean;
  data?: any;
}

export interface SharpeOptimizerMetrics {
  count: number;
  value: number;
}
