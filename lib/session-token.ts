import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
export const SESSION_SECONDS = 24 * 60 * 60
function secret() {
 const value = process.env.AUTH_SECRET
 if (!value || Buffer.byteLength(value) < 32) throw new Error("AUTH_SECRET must contain at least 32 bytes")
 return value
}
function signature(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url") }
export function passwordRevision(passwordHash: string) { return signature(`password:${passwordHash}`) }
export function signSession(userId: string, passwordHash: string, now = Date.now()) {
 const payload = Buffer.from(JSON.stringify({version: 1, userId, nonce: randomUUID(), issuedAt: now,
 expiresAt: now + SESSION_SECONDS * 1000, revision: passwordRevision(passwordHash)})).toString("base64url")
 return `${payload}.${signature(payload)}`
}
export function verifySession(token: string, now = Date.now()): {userId: string; revision: string} | null {
 try {
  if (token.length > 2048) return null
  const parts = token.split(".")
  if (parts.length !== 2 || !parts.every(p => /^[A-Za-z0-9_-]+$/.test(p))) return null
  const [payload, mac] = parts
  const expected = Buffer.from(signature(payload)), actual = Buffer.from(mac)
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
  if (data.version !== 1 || typeof data.userId !== "string" || !data.userId ||
   typeof data.revision !== "string" || typeof data.nonce !== "string" ||
   !Number.isSafeInteger(data.issuedAt) || !Number.isSafeInteger(data.expiresAt) ||
   data.issuedAt > now || data.expiresAt <= now || data.expiresAt - data.issuedAt !== SESSION_SECONDS * 1000) return null
  return {userId:data.userId, revision:data.revision}
 } catch { return null }
}
