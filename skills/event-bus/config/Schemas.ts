// Schemas - Validation schemas
// Author: Tentacle OS

export const symbolSchema = {
  parse: (val: string) => /^[A-Z]{2,10}$/i.test(val) ? val.toUpperCase() : null
};

export const addressSchema = {
  parse: (val: string) => {
    const cleaned = val.toLowerCase();
    return /^0x[a-f0-9]{40}$/.test(cleaned) ? cleaned : null;
  }
};
