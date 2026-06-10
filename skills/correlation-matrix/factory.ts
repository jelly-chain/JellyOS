// Factory
import { CorrelationMatrixAnalyzer } from './index';

export function createCorrelationMatrixAnalyzer(): CorrelationMatrixAnalyzer {
  return new CorrelationMatrixAnalyzer();
}