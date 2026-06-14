// Wallet Verification - EVM nonce-based challenge
import { createHash, randomBytes } from "node:crypto";
import { recoverPersonalSignature } from "eth-sig-util";

export interface Challenge {
  message: string;
  nonce: string;
  issuedAt: number;
}

export function generateChallenge(): Challenge {
  const nonce = randomBytes(8).toString("hex");
  const issuedAt = Date.now();
  const message = `JellyOS Verifying
Nonce: ${nonce}
Issued At: ${new Date(issuedAt).toISOString()}

This signature proves ownership without moving funds.`;
  return { message, nonce, issuedAt };
}

export interface VerifyResult {
  success: boolean;
  address?: string;
  error?: string;
}

export function verifySignature(message: string, signature: string): VerifyResult {
  try {
    const address = recoverPersonalSignature({ data: message, signature });
    return { success: true, address };
  } catch {
    return { success: false, error: "Invalid signature" };
  }
}
