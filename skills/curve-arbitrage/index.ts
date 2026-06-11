// CurveArbitrage - Main implementation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';

const logger = new Logger('curve-arbitrage');
const metrics = new Metrics();

export class CurveArbitrage {
  async execute(params: any): Promise<any> {
    metrics.increment('curve-arbitrage.executed', 1);
    return { success: true, data: params };
  }
  
  close(): void {}
}

export { createCurveArbitrage } from './factory';

export function createCurveArbitrage(): CurveArbitrage {
  return new CurveArbitrage();
}
