// Formatters - Data formatting utilities
// Author: Tentacle OS

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function formatPercent(value: number): string {
  return \`\${(value * 100).toFixed(2)}%\`;
}

export function formatAddress(address: string): string {
  if (address.length < 10) return address;
  return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
}  




