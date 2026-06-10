// Max Pain Types
// Author: Tentacle OS

export interface StrikePain {
  strike: number;
  pain: number;
}

export interface MaxPainResult {
  maxPainPrice: number;
  spotPrice: number;
  deviation: number;
  painDistribution: StrikePain[];
  expiryGravity: number;
  timestamp: number;
}

export interface GammaExposure {
  strike: number;
  callGEX: number;
  putGEX: number;
  netGEX: number;
}