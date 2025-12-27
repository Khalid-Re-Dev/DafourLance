import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "./db"

// Simple session-based auth without NextAuth for simplicity
// In production, use NextAuth or a more robust solution

export interface Session {
  userId: string
  email: string
  name: string | null
}

const SESSION_COOKIE_NAME = "admin_session"

export async function hashPassword(password: string): Promise<string> {
  // Simple hash for demo - in production use bcrypt
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.AUTH_SECRET || "default-secret")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashed = await hashPassword(password)
  return hashed === hashedPassword
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const sessionData = JSON.stringify({ userId, sessionId, createdAt: Date.now() })
  const encoder = new TextEncoder()
  const data = encoder.encode(sessionData)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const token =
    hashArray.map((b) => b.toString(16).padStart(2, "0")).join("") + "." + Buffer.from(sessionData).toString("base64")
  return token
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const [, encodedData] = sessionCookie.value.split(".")
    if (!encodedData) return null

    const sessionData = JSON.parse(Buffer.from(encodedData, "base64").toString())

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
      return { success: false, error: "Invalid email or password" }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { success: false, error: "Invalid email or password" }
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
