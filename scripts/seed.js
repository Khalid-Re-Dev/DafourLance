const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  const hashedPassword = await bcrypt.hash("Admin123!", 10)

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

  console.log("Admin created successfully")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
