import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const keyLength = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const key = await scrypt(password, salt, keyLength) as Buffer;
  return `scrypt$${salt}$${key.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string | null | undefined): Promise<boolean> {
  if (!storedHash) return false;
  const [scheme, salt, expected] = storedHash.split("$");
  if (scheme !== "scrypt" || !salt || !expected) return false;

  const actualKey = await scrypt(password, salt, keyLength) as Buffer;
  const expectedKey = Buffer.from(expected, "base64url");
  if (actualKey.length !== expectedKey.length) return false;

  return timingSafeEqual(actualKey, expectedKey);
}

export function isStrongEnoughPassword(password: string): boolean {
  return password.length >= 8
    && /[a-zA-Z]/.test(password)
    && /[0-9]/.test(password);
}
