const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  // 1. Check what's in the database
  const users = await prisma.user.findMany()
  console.log("=== ALL USERS IN DB ===")
  for (const u of users) {
    console.log(`  Email: ${u.email}`)
    console.log(`  Password hash: ${u.password}`)
    console.log(`  Is bcrypt: ${u.password.startsWith("$2b$") || u.password.startsWith("$2a$")}`)
  }

  // 2. Test bcrypt comparison
  const testPassword = "Admin123!"
  const user = users[0]
  if (user) {
    console.log("\n=== TESTING PASSWORD ===")
    console.log(`Testing "${testPassword}" against stored hash...`)
    
    if (user.password.startsWith("$2b$") || user.password.startsWith("$2a$")) {
      const match = await bcrypt.compare(testPassword, user.password)
      console.log(`bcrypt.compare result: ${match}`)
    } else {
      console.log("Hash is NOT bcrypt format, testing SHA-256...")
      const crypto = require("crypto")
      const secret = process.env.AUTH_SECRET || "default-secret"
      console.log(`Using AUTH_SECRET: "${secret}"`)
      
      const encoder = new TextEncoder()
      const data = encoder.encode(testPassword + secret)
      const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const computed = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
      
      console.log(`Computed SHA-256: ${computed}`)
      console.log(`Stored hash:      ${user.password}`)
      console.log(`Match: ${computed === user.password}`)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
