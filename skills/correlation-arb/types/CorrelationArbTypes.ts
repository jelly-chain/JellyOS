// CorrelationArb Types
// Author: Tentacle OS

export interface CorrelationArbConfig {
  enabled: boolean;
  threshold: number;
}

export interface CorrelationArbResult {
  success: boolean;
  data?: any;
}

export interface CorrelationArbMetrics {
  count: number;
  value: number;
}
