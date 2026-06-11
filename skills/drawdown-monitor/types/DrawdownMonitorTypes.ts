// DrawdownMonitor Types
// Author: Tentacle OS

export interface DrawdownMonitorConfig {
  enabled: boolean;
  threshold: number;
}

export interface DrawdownMonitorResult {
  success: boolean;
  data?: any;
}

export interface DrawdownMonitorMetrics {
  count: number;
  value: number;
}
