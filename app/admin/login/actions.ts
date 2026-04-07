"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import {
  verifyPassword,
  migratePasswordToBcrypt,
  createSession,
} from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string) || ""
  const password = (formData.get("password") as string) || ""

  if (!email || !password) {
    return { error: "Email and password are required", success: false }
  }

  try {
    console.log("LOGIN_DEBUG: Attempting login for email:", email)
    
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user) {
      console.log("LOGIN_DEBUG: User not found in database for email:", email)
      return { error: "Invalid credentials", success: false }
    }

    console.log("LOGIN_DEBUG: User found:", user.email)
    console.log("LOGIN_DEBUG: Stored hash starts with:", user.password.substring(0, 10))
    
    const isValid = await verifyPassword(password, user.password)
    console.log("LOGIN_DEBUG: Verification result:", isValid)

    if (!isValid) {
      console.log("LOGIN_DEBUG: Password mismatch for user:", email)
      return { error: "Invalid credentials", success: false }
    }

    // Migrate legacy SHA-256 hash to bcrypt on successful login
    if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      console.log("LOGIN_DEBUG: Migrating legacy hash to bcrypt")
      await migratePasswordToBcrypt(user.id, password)
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

    console.log("LOGIN_DEBUG: Login successful for:", email)
    return { success: true }
  } catch (error) {
    console.error("LOGIN_DEBUG: Login error exception:", error)
    return { error: "An error occurred during login", success: false }
  }
}

// هذه الدالة للاستخدام مع form action - لا ترجع شيء
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  redirect("/admin/login")
}
