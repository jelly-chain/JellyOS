// ConfigLoader Types
// Author: Tentacle OS

export interface ConfigLoaderConfig {
  enabled: boolean;
  threshold: number;
}

export interface ConfigLoaderResult {
  success: boolean;
  data?: any;
}

export interface ConfigLoaderMetrics {
  count: number;
  value: number;
}
