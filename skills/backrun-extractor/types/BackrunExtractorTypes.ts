// BackrunExtractor Types
// Author: Tentacle OS

export interface BackrunExtractorConfig {
  enabled: boolean;
  threshold: number;
}

export interface BackrunExtractorResult {
  success: boolean;
  data?: any;
}

export interface BackrunExtractorMetrics {
  count: number;
  value: number;
}
