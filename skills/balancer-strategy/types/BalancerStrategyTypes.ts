// BalancerStrategy Types
// Author: Tentacle OS

export interface BalancerStrategyConfig {
  enabled: boolean;
  threshold: number;
}

export interface BalancerStrategyResult {
  success: boolean;
  data?: any;
}

export interface BalancerStrategyMetrics {
  count: number;
  value: number;
}
