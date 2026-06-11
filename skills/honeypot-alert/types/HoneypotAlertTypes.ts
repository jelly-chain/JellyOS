// HoneypotAlert Types
// Author: Tentacle OS

export interface HoneypotAlertConfig {
  enabled: boolean;
  threshold: number;
}

export interface HoneypotAlertResult {
  success: boolean;
  data?: any;
}

export interface HoneypotAlertMetrics {
  count: number;
  value: number;
}
