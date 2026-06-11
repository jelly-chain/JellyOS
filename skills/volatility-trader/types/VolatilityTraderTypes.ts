// VolatilityTrader Types
// Author: Tentacle OS

export interface VolatilityTraderConfig {
  enabled: boolean;
  threshold: number;
}

export interface VolatilityTraderResult {
  success: boolean;
  data?: any;
}

export interface VolatilityTraderMetrics {
  count: number;
  value: number;
}
