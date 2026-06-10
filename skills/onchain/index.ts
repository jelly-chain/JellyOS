// OnChain Skill - Blockchain analytics
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('OnChain');

export class OnChainSkill {
  scan(address: string): { transactions: number } {
    return { transactions: 100 + Math.floor(Math.random() * 1000) };
  }

  close(): void {}
}