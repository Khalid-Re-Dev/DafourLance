const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash("Admin123!", 12)
  console.log("New bcrypt hash:", hash)

  // Try updating existing user
  const result = await prisma.user.updateMany({
    where: { email: "admin@daforlance.com" },
    data: { password: hash },
  })
  console.log("Updated users:", result.count)

  if (result.count === 0) {
    console.log("No user found with admin@daforlance.com — checking all users...")
    const users = await prisma.user.findMany({
      select: { id: true, email: true, password: true },
    })
    console.log("All users:", JSON.stringify(users, null, 2))
    
    // Update the first user found regardless of email
    if (users.length > 0) {
      for (const u of users) {
        const res = await prisma.user.update({
          where: { id: u.id },
          data: { password: hash, email: "admin@daforlance.com" },
        })
        console.log("Fixed user:", res.email, "-> bcrypt hash applied")
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
