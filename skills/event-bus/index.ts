// EventBus - Main implementation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';

const logger = new Logger('event-bus');
const metrics = new Metrics();

export class EventBus {
  async execute(params: any): Promise<any> {
    metrics.increment('event-bus.executed', 1);
    return { success: true, data: params };
  }
  
  close(): void {}
}

export { createEventBus } from './factory';

export function createEventBus(): EventBus {
  return new EventBus();
}
