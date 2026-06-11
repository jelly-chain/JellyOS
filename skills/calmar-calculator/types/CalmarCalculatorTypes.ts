// CalmarCalculator Types
// Author: Tentacle OS

export interface CalmarCalculatorConfig {
  enabled: boolean;
  threshold: number;
}

export interface CalmarCalculatorResult {
  success: boolean;
  data?: any;
}

export interface CalmarCalculatorMetrics {
  count: number;
  value: number;
}
