// Data Skill - Market data fetching
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Data');

export class DataSkill {
  async getPrice(symbol: string): Promise<number> {
    return 50000 + Math.random() * 1000;
  }

  close(): void {}
}