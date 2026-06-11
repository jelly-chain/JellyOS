// PluginManager Types
// Author: Tentacle OS

export interface PluginManagerConfig {
  enabled: boolean;
  threshold: number;
}

export interface PluginManagerResult {
  success: boolean;
  data?: any;
}

export interface PluginManagerMetrics {
  count: number;
  value: number;
}
