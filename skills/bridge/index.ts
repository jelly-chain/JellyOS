// Bridge Skill - Cross-chain bridging
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Bridge');

export class BridgeSkill {
  findRoute(source: string, dest: string): { fee: number; time: number } {
    return { fee: 0.02, time: 10 };
  }

  close(): void {}
}