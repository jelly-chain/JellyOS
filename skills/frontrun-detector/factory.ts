// Factory
import { FrontrunDetector } from './index';

export function createFrontrunDetector(): FrontrunDetector {
  return new FrontrunDetector();
}
