// ConfigLoader - Main implementation
// Author: Tentacle OS
// Version: 2.0.0

import { Logger } from '../../../src/core/utils/Logger';
import { Metrics } from '../../../src/core/utils/Metrics';

const logger = new Logger('config-loader');
const metrics = new Metrics();

export class ConfigLoader {
  async execute(params: any): Promise<any> {
    metrics.increment('config-loader.executed', 1);
    return { success: true, data: params };
  }
  
  close(): void {}
}

export { createConfigLoader } from './factory';

export function createConfigLoader(): ConfigLoader {
  return new ConfigLoader();
}
