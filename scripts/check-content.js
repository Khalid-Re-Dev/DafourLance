const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const texts = await prisma.siteText.findMany()
  console.log(`Total SiteText records: ${texts.length}`)
  if (texts.length > 0) {
    for (const t of texts) {
      console.log(`  [${t.key}] headingAr: "${t.headingAr || ''}" | headingEn: "${t.headingEn || ''}"`)
    }
  }

  const footer = await prisma.footerConfig.findMany()
  console.log(`\nTotal FooterConfig records: ${footer.length}`)
  if (footer.length > 0) {
    for (const f of footer) {
      console.log(`  [${f.id}] phone: ${f.phone} | email: ${f.email} | active: ${f.isActive}`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
