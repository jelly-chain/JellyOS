// PortfolioStress Types
// Author: Tentacle OS

export interface PortfolioStressConfig {
  enabled: boolean;
  threshold: number;
}

export interface PortfolioStressResult {
  success: boolean;
  data?: any;
}

export interface PortfolioStressMetrics {
  count: number;
  value: number;
}
