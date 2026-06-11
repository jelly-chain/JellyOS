// Factory
import { EventBus } from './index';

export function createEventBus(): EventBus {
  return new EventBus();
}
