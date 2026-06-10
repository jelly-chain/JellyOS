// Social Skill - Social integration
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Social');

export class SocialSkill {
  send(message: string): void {
    logger.info(`Send: ${message}`);
  }

  close(): void {}
}