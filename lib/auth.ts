import { cookies } from "next/headers";

// Single shared-password gate for the /manage admin screen (docs Phase 2A).
// The password lives in ADMIN_PASSWORD (env / Cloudflare secret), never in the
// repo. The session cookie stores an HMAC of a fixed message keyed by the
// password, so the raw password is never placed in a cookie. Web Crypto is used
// so this runs identically on Node and the Cloudflare Workers runtime.

const COOKIE = "obp_admin";
const SESSION_MESSAGE = "obp-admin-session-v1";

async function hmacHex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time string comparison.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

// Verify a submitted password (constant-time) and return the session token to set.
export async function verifyPassword(submitted: string): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  if (!timingSafeEqual(submitted, password)) return null;
  return hmacHex(password, SESSION_MESSAGE);
}

export async function isAuthed(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const expected = await hmacHex(password, SESSION_MESSAGE);
  return timingSafeEqual(token, expected);
}

export async function setSession(token: string): Promise<void> {
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
