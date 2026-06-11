// StateSync Types
// Author: Tentacle OS

export interface StateSyncConfig {
  enabled: boolean;
  threshold: number;
}

export interface StateSyncResult {
  success: boolean;
  data?: any;
}

export interface StateSyncMetrics {
  count: number;
  value: number;
}
