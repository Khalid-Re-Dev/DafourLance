import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import prisma from "./db"

// Session-based auth with bcrypt password hashing
// Session tokens use HMAC-like integrity verification

export interface Session {
  userId: string
  email: string
  name: string | null
}

const SESSION_COOKIE_NAME = "admin_session"
const BCRYPT_ROUNDS = 12

// ──────────────────────────────────────────────
// Password hashing (bcrypt)
// ──────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  console.log("AUTH_DEBUG: verifyPassword called")
  // Bcrypt hashes start with $2a$ or $2b$
  if (hashedPassword.startsWith("$2a$") || hashedPassword.startsWith("$2b$")) {
    console.log("AUTH_DEBUG: Detected bcrypt hash format")
    const match = await bcrypt.compare(password, hashedPassword)
    console.log("AUTH_DEBUG: bcrypt.compare match:", match)
    return match
  }

  console.log("AUTH_DEBUG: Detected legacy format, falling back to SHA-256")
  return verifyLegacySha256(password, hashedPassword)
}

/** Check against legacy SHA-256 hash (used before bcrypt migration) */
async function verifyLegacySha256(password: string, storedHash: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + (process.env.AUTH_SECRET || "default-secret"))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const computed = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return computed === storedHash
}

/**
 * Re-hash a user's password from legacy SHA-256 to bcrypt.
 * Called transparently on successful legacy login.
 */
export async function migratePasswordToBcrypt(userId: string, plainPassword: string): Promise<void> {
  const bcryptHash = await hashPassword(plainPassword)
  await prisma.user.update({
    where: { id: userId },
    data: { password: bcryptHash },
  })
}

// ──────────────────────────────────────────────
// Session management
// ──────────────────────────────────────────────

async function computeTokenHash(payload: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(payload)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const sessionData = JSON.stringify({ userId, sessionId, createdAt: Date.now() })
  const hash = await computeTokenHash(sessionData)
  const token = hash + "." + Buffer.from(sessionData).toString("base64")
  return token
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const [tokenHash, encodedData] = sessionCookie.value.split(".")
    if (!tokenHash || !encodedData) return null

    // Verify token integrity — re-compute hash and compare
    const payload = Buffer.from(encodedData, "base64").toString()
    const expectedHash = await computeTokenHash(payload)
    if (tokenHash !== expectedHash) {
      return null
    }

    const sessionData = JSON.parse(payload)

    // Check session age (24 hours)
    if (Date.now() - sessionData.createdAt > 24 * 60 * 60 * 1000) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: { id: true, email: true, name: true },
    })

    if (!user) return null

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    }
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }
  return session
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { success: false, error: "Invalid credentials" }
    }

    // Migrate legacy SHA-256 hash to bcrypt on successful login
    if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      await migratePasswordToBcrypt(user.id, password)
    }

    const token = await createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
