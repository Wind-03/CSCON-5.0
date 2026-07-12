import { randomBytes } from "crypto";

/**
 * Generates a short, human-friendly access code like "CSCON5-7F3K9Q".
 * Not cryptographically meaningful — it's a display/lookup code for the
 * access-card email, not a secret.
 */
export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  const bytes = randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `CSCON5-${code}`;
}