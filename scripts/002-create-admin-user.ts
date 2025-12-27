// Run this script to create the initial admin user
// Usage: npx tsx scripts/002-create-admin-user.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + (process.env.AUTH_SECRET || "default-secret"))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function main() {
  const email = "admin@dafourlance.com"
  const password = "admin123"
  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: {
      email,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  })

  console.log("Admin user created/updated:", user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
