// MevExplorer Types
// Author: Tentacle OS

export interface MevExplorerConfig {
  enabled: boolean;
  threshold: number;
}

export interface MevExplorerResult {
  success: boolean;
  data?: any;
}

export interface MevExplorerMetrics {
  count: number;
  value: number;
}
