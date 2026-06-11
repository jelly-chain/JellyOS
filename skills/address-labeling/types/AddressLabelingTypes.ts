// Address Labeling Types
// Author: Tentacle OS

export type LabelCategory = 'cex' | 'dex' | 'whale' | 'protocol' | 'bridge' | 'nft' | 'unknown';

export interface AddressLabel {
  address: string;
  category: LabelCategory;
  label: string;
  source: 'database' | 'user' | 'ens';
  addedAt: number;
}