// Risk Rotator Types
// Author: Tentacle OS

export interface RiskRegime {
  regime: 'risk_on' | 'neutral' | 'risk_off';
  score: number;
  vix: number;
  btcChange7d: number;
  fundingRate: number;
  fearGreed: number;
  timestamp: number;
}

export interface RiskAllocation {
  riskOn: { weight: number; assets: string[] };
  riskOff: { weight: number; assets: string[] };
  regime: string;
  timestamp: number;
}

export interface RotationSignal {
  action: 'increase_risk' | 'decrease_risk' | 'hold';
  fromRegime: string;
  targetAllocation: RiskAllocation;
  urgency: 'low' | 'medium' | 'high';
  timestamp: number;
}