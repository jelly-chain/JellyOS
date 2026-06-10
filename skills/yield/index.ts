// Yield Skill - Yield farming
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Yield');

export class YieldSkill {
  findBest(asset: string): { apy: number } {
    return { apy: 5 + Math.random() * 20 };
  }

  close(): void {}
}