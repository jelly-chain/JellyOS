// MaxDrawdown - Main implementation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';

const logger = new Logger('max-drawdown');
const metrics = new Metrics();

export class MaxDrawdown {
  async execute(params: any): Promise<any> {
    metrics.increment('max-drawdown.executed', 1);
    return { success: true, data: params };
  }
  
  close(): void {}
}

export { createMaxDrawdown } from './factory';
