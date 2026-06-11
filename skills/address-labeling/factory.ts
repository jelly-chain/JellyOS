// Factory
import { AddressLabeler } from './index';

export function createAddressLabeler(): AddressLabeler {
  return new AddressLabeler();
}