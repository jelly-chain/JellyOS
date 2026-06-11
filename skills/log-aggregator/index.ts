// LogAggregator - Main implementation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';

const logger = new Logger('log-aggregator');
const metrics = new Metrics();

export class LogAggregator {
  async execute(params: any): Promise<any> {
    metrics.increment('log-aggregator.executed', 1);
    return { success: true, data: params };
  }
  
  close(): void {}
}

export { createLogAggregator } from './factory';

export function createLogAggregator(): LogAggregator {
  return new LogAggregator();
}
