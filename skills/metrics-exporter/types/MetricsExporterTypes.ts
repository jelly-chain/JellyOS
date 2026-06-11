// MetricsExporter Types
// Author: Tentacle OS

export interface MetricsExporterConfig {
  enabled: boolean;
  threshold: number;
}

export interface MetricsExporterResult {
  success: boolean;
  data?: any;
}

export interface MetricsExporterMetrics {
  count: number;
  value: number;
}
