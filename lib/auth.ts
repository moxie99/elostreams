import { cookies } from "next/headers";
import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export const SESSION_COOKIE_NAME = "elo_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short — set a long random string in .env.local."
    );
  }
  return secret;
}

// ---------------------------------------------------------------------------
// Password hashing — scrypt via node:crypto (no native dependency)
// ---------------------------------------------------------------------------

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const testBuf = scryptSync(password, salt, hashBuf.length);
  return hashBuf.length === testBuf.length && timingSafeEqual(hashBuf, testBuf);
}

// ---------------------------------------------------------------------------
// Stateless session token — payload.signature, HMAC-SHA256 signed, with expiry
// ---------------------------------------------------------------------------

export type SessionPayload = {
  sub: string;
  email: string;
  exp: number; // unix seconds
};

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createSession(input: { sub: string; email: string }): string {
  const payload: SessionPayload = {
    sub: input.sub,
    email: input.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifySession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = sign(data);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie helper — reads + verifies the current admin session
// ---------------------------------------------------------------------------

export async function getAdminSession(): Promise<SessionPayload | null> {
  try {
    const store = await cookies();
    return verifySession(store.get(SESSION_COOKIE_NAME)?.value);
  } catch {
    // Misconfiguration (e.g. missing secret) should read as "not signed in".
    return null;
  }
}
