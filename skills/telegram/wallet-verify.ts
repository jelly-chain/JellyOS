// Wallet Verification - EVM nonce-based
import { randomBytes, createHash } from "node:crypto";

export interface Challenge {
  message: string;
  nonce: string;
  issuedAt: number;
}

export function generateChallenge(): Challenge {
  const nonce = randomBytes(16).toString("hex");
  const issuedAt = Date.now();
  const message = `JellyOS Verification
Nonce: ${nonce}
Issued: ${new Date(issuedAt).toISOString()}

No funds moved. Signature proves ownership.`;
  return { message, nonce, issuedAt };
}
