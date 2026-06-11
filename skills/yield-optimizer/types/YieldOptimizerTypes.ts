// YieldOptimizer Types
// Author: Tentacle OS

export interface YieldOptimizerConfig {
  enabled: boolean;
  threshold: number;
}

export interface YieldOptimizerResult {
  success: boolean;
  data?: any;
}

export interface YieldOptimizerMetrics {
  count: number;
  value: number;
}
