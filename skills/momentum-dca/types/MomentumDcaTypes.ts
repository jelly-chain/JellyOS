// MomentumDca Types
// Author: Tentacle OS

export interface MomentumDcaConfig {
  enabled: boolean;
  threshold: number;
}

export interface MomentumDcaResult {
  success: boolean;
  data?: any;
}

export interface MomentumDcaMetrics {
  count: number;
  value: number;
}
