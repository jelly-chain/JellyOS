// Risk Skill - Position and portfolio risk
// Author: Tentacle OS

import { Logger } from '../../../src/core/utils/Logger';

const logger = new Logger('Risk');

export class RiskSkill {
  check(positionSize: number, portfolio: number): { approved: boolean; reason: string } {
    const ratio = positionSize / portfolio;
    return ratio > 0.05 ? { approved: false, reason: 'Too large' } : { approved: true, reason: '' };
  }

  close(): void {}
}