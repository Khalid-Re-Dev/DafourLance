const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash("Admin123!", 12)
  console.log("Setting all users to admin@dafourlance.com with new hash...")

  const users = await prisma.user.findMany()
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { password: hash, email: "admin@dafourlance.com" },
    })
  }

  console.log("Done. Please use email: admin@dafourlance.com, password: Admin123!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
