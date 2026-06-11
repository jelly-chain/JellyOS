// CurveArbitrage Types
// Author: Tentacle OS

export interface CurveArbitrageConfig {
  enabled: boolean;
  threshold: number;
}

export interface CurveArbitrageResult {
  success: boolean;
  data?: any;
}

export interface CurveArbitrageMetrics {
  count: number;
  value: number;
}
