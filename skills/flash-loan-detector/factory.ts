// Factory
import { FlashLoanDetector } from './index';

export function createFlashLoanDetector(): FlashLoanDetector {
  return new FlashLoanDetector();
}