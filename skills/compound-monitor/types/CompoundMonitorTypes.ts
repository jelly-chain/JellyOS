// CompoundMonitor Types
// Author: Tentacle OS

export interface CompoundMonitorConfig {
  enabled: boolean;
  threshold: number;
}

export interface CompoundMonitorResult {
  success: boolean;
  data?: any;
}

export interface CompoundMonitorMetrics {
  count: number;
  value: number;
}
