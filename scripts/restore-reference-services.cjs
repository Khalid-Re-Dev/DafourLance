const defaults = require('./service-defaults.cjs')

// Desktop RTL reading order in the supplied reference. Preserve all CMS text.
const referenceIds = defaults.map(service => service.id)

function planServices(existing) {
  return referenceIds.map((id, index) => {
    const item = defaults.find(service => service.id === id)
    const matches = existing.filter(service =>
      service.id === id || service.titleAr.trim() === item.titleAr ||
      service.titleEn.trim().toLowerCase() === item.titleEn.toLowerCase())
    if (matches.length > 1) throw new Error(`Ambiguous service: ${id}; review duplicates before restoring`)
    return matches.length
      ? { action: 'update', id: matches[0].id, data: { isActive: true, order: index + 1 } }
      : { action: 'create', id, data: { ...item, order: index + 1 } }
  })
}

async function main() {
  require('dotenv').config({ quiet: true })
  const { PrismaClient } = require('@prisma/client')
  const db = new PrismaClient()
  try {
    const apply = process.argv.includes('--apply')
    await db.$transaction(async tx => {
      // Concurrent executions must not insert two title-matched services.
      if (apply) await tx.$executeRawUnsafe('LOCK TABLE "Service" IN SHARE ROW EXCLUSIVE MODE')
      const plan = planServices(await tx.service.findMany())
      console.table(plan.map(({ action, id, data }) => ({ action, id, order: data.order })))
      if (!apply) return
      for (const step of plan) {
        if (step.action === 'update') await tx.service.update({ where: { id: step.id }, data: step.data })
        else await tx.service.create({ data: step.data })
      }
    })
    console.log(apply ? 'Reference services restored; existing text and other records preserved.' : 'Preview only. Run with --apply after verifying the target database.')
  } finally { await db.$disconnect() }
}

module.exports = { planServices }
if (require.main === module) main().catch(() => {
  console.error('Service restoration failed; no transaction was committed. Check the database connection and duplicate service titles.')
  process.exitCode = 1
})
