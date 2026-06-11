// Factory
import { LogAggregator } from './index';

export function createLogAggregator(): LogAggregator {
  return new LogAggregator();
}
