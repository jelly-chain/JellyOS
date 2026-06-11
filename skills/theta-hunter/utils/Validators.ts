// Validators - Input validation utilities
// Author: Tentacle OS

export function validateAddress(address: string): boolean {
  if (!address) return false;
  const cleaned = address.toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(cleaned) || /^[a-z0-9]{32,44}$/.test(cleaned);
}

export function validateSymbol(symbol: string): boolean {
  return /^[A-Z]{2,10}$/.test(symbol.toUpperCase());
}

export function validatePositive(value: number): boolean {
  return !isNaN(value) && value > 0;
}
