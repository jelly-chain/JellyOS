// MaxDrawdown Types
// Author: Tentacle OS

export interface MaxDrawdownConfig {
  enabled: boolean;
  threshold: number;
}

export interface MaxDrawdownResult {
  success: boolean;
  data?: any;
}

export interface MaxDrawdownMetrics {
  count: number;
  value: number;
}
