import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/** Hash a password with scrypt. Format: salt:hash (hex). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/** Verify a password against stored salt:hash. Timing-safe. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!(salt && hash)) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hash, "hex");
  return timingSafeEqual(derived, storedBuffer);
}
