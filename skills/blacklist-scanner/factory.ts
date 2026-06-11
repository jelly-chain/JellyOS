// Factory
import { BlacklistScanner } from './index';

export function createBlacklistScanner(): BlacklistScanner {
  return new BlacklistScanner();
}