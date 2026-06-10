// Factory - Create DCA executor
// Author: Tentacle OS

import { DCAExecutor } from './index';

export function createDCAExecutor(): DCAExecutor {
  return new DCAExecutor();
}