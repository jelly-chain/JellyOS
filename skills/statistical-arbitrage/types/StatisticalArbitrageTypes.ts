// StatisticalArbitrage Types
// Author: Tentacle OS

export interface StatisticalArbitrageConfig {
  enabled: boolean;
  threshold: number;
}

export interface StatisticalArbitrageResult {
  success: boolean;
  data?: any;
}

export interface StatisticalArbitrageMetrics {
  count: number;
  value: number;
}
