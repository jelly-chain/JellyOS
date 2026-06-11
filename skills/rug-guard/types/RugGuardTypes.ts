// RugGuard Types
// Author: Tentacle OS

export interface RugGuardConfig {
  enabled: boolean;
  threshold: number;
}

export interface RugGuardResult {
  success: boolean;
  data?: any;
}

export interface RugGuardMetrics {
  count: number;
  value: number;
}
