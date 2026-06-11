// Factory
import { ApiGateway } from './index';

export function createApiGateway(): ApiGateway {
  return new ApiGateway();
}
