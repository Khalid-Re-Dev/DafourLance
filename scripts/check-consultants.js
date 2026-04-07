const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const consultants = await prisma.consultant.findMany()
  console.log(`Total consultants in DB: ${consultants.length}`)
  for (const c of consultants) {
    console.log(`  - [${c.id}] ${c.nameEn} (${c.roleEn}) | active: ${c.isActive} | image: ${c.imageUrl ? 'yes' : 'no'}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
