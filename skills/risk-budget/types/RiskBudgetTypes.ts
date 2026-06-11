// RiskBudget Types
// Author: Tentacle OS

export interface RiskBudgetConfig {
  enabled: boolean;
  threshold: number;
}

export interface RiskBudgetResult {
  success: boolean;
  data?: any;
}

export interface RiskBudgetMetrics {
  count: number;
  value: number;
}
