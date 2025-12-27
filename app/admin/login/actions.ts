"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + (process.env.AUTH_SECRET || "default-secret"))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashed = await hashPassword(password)
  return hashed === hashedPassword
}

async function createSession(userId: string): Promise<string> {
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

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required", success: false }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "Invalid email or password", success: false }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { error: "Invalid email or password", success: false }
    }

    const token = await createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An error occurred during login", success: false }
  }
}

// هذه الدالة للاستخدام مع form action - لا ترجع شيء
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  redirect("/admin/login")
}