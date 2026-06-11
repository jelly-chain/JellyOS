// HealthChecker Types
// Author: Tentacle OS

export interface HealthCheckerConfig {
  enabled: boolean;
  threshold: number;
}

export interface HealthCheckerResult {
  success: boolean;
  data?: any;
}

export interface HealthCheckerMetrics {
  count: number;
  value: number;
}
