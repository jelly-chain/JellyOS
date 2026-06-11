// AavePosition Types
// Author: Tentacle OS

export interface AavePositionConfig {
  enabled: boolean;
  threshold: number;
}

export interface AavePositionResult {
  success: boolean;
  data?: any;
}

export interface AavePositionMetrics {
  count: number;
  value: number;
}
