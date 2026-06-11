// LogAggregator Types
// Author: Tentacle OS

export interface LogAggregatorConfig {
  enabled: boolean;
  threshold: number;
}

export interface LogAggregatorResult {
  success: boolean;
  data?: any;
}

export interface LogAggregatorMetrics {
  count: number;
  value: number;
}
