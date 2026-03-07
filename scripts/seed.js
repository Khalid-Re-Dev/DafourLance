const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const prisma = new PrismaClient()

// function hashPassword(password) {
//   const data = password + (process.env.AUTH_SECRET || "default-secret")
//   return crypto
//     .createHash("sha256")
//     .update(data)
//     .digest("hex")
// }


async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + (process.env.AUTH_SECRET || "default-secret"))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function main() {
  console.log("Starting database seed...")

  const hashedPassword = await hashPassword("Admin123!", 10)

  await prisma.user.upsert({
    where: { email: "admin@daforlance.com" },
    update: {},
    create: {
      email: "admin@daforlance.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "admin",
    },
  })

  console.log(hashedPassword)
  console.log("Admin created successfully")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
