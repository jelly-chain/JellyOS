// Vault Skill - Profit vault management
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Vault');

export class VaultSkill {
  sweep(amount: number, passphrase: string): boolean {
    logger.info(`Sweep ${amount} to vault`);
    return true;
  }

  close(): void {}
}