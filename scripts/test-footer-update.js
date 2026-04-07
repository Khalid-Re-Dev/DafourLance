const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  // Update footer with test values
  const config = await prisma.footerConfig.findFirst({ where: { isActive: true } })
  if (!config) {
    console.log("No FooterConfig found!")
    return
  }
  
  const updated = await prisma.footerConfig.update({
    where: { id: config.id },
    data: {
      phone: "+967 774071453",
      phone2: "+967 774071453",
      email: "email@email.com",
      whatsapp: "+967 774071453",
    }
  })
  
  console.log("Updated FooterConfig:", {
    phone: updated.phone,
    phone2: updated.phone2,
    email: updated.email,
    whatsapp: updated.whatsapp,
  })
}

main().catch(console.error).finally(() => prisma.$disconnect())
