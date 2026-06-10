// Wallet Skill - Wallet management
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Wallet');

export class WalletSkill {
  list(): { addresses: string[] } {
    return { addresses: ['0x123...', '0x456...'] };
  }

  close(): void {}
}