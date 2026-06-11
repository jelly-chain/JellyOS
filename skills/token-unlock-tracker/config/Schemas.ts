// Schemas - Zod validation schemas
// Author: Tentacle OS

export const symbolSchema = {
  parse: (val: string) => /^[A-Z]{2,10}$/i.test(val) ? val.toUpperCase() : null
};

export const addressSchema = {
  parse: (val: string) => {
    const cleaned = val.toLowerCase();
    if (/^0x[a-f0-9]{40}$/.test(cleaned)) return cleaned;
    if (/^[a-z0-9]{32,44}$/.test(cleaned)) return cleaned;
    return null;
  }
};

export const numberSchema = {
  parse: (val: unknown) => typeof val === 'number' && !isNaN(val) ? val : null
};
