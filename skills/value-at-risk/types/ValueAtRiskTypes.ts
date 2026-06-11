// ValueAtRisk Types
// Author: Tentacle OS

export interface ValueAtRiskConfig {
  enabled: boolean;
  threshold: number;
}

export interface ValueAtRiskResult {
  success: boolean;
  data?: any;
}

export interface ValueAtRiskMetrics {
  count: number;
  value: number;
}
