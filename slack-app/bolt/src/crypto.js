// AES-256-GCM for OAuth tokens at rest, plus PKCE / random helpers.
import crypto from "node:crypto";
import { config } from "./config.js";

const key = Buffer.from(config.tokenEncryptionKey, "hex");
if (key.length !== 32) {
  throw new Error("TOKEN_ENCRYPTION_KEY must be 64 hex characters (32 bytes). Generate: openssl rand -hex 32");
}

export function encrypt(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), enc].map((b) => b.toString("base64url")).join(".");
}

export function decrypt(blob) {
  const [iv, tag, enc] = String(blob).split(".").map((s) => Buffer.from(s, "base64url"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString("base64url");

export function pkcePair() {
  const verifier = randomToken(48);
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}
