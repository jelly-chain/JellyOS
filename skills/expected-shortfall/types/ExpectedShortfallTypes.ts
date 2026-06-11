// ExpectedShortfall Types
// Author: Tentacle OS

export interface ExpectedShortfallConfig {
  enabled: boolean;
  threshold: number;
}

export interface ExpectedShortfallResult {
  success: boolean;
  data?: any;
}

export interface ExpectedShortfallMetrics {
  count: number;
  value: number;
}
