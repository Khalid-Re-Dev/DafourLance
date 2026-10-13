const oldName = 'محمد بن سواد'

function planCopy(siteTexts, navItems) {
  const headings = {
    'hero.title': 'نحو تجربة رقمية واحترافية أفضل',
    'about.main': 'من نحن',
  }
  const plan = []
  for (const row of siteTexts) {
    if (headings[row.key] && row.headingAr?.trim() === oldName) {
      plan.push({ model: 'siteText', id: row.id, field: 'headingAr', before: row.headingAr, after: headings[row.key] })
    }
  }
  for (const row of navItems) {
    if (row.href === '#about' && row.labelAr.trim() === oldName) {
      plan.push({ model: 'navItem', id: row.id, field: 'labelAr', before: row.labelAr, after: 'من نحن' })
    }
  }
  return plan
}

async function main() {
  const { createRequire } = require('node:module')
  const fromNext = createRequire(require.resolve('next/package.json'))
  fromNext('@next/env').loadEnvConfig(process.cwd(), true)
  const target = new URL(process.env.DATABASE_URL || '')
  if (target.hostname !== 'ep-red-cherry-b4bil09j.c-6.us-east-2.aws.neon.tech' || target.pathname !== '/neondb') {
    throw new Error('Unexpected database')
  }
  const { PrismaClient } = require('@prisma/client')
  const db = new PrismaClient({ log: [] })
  const apply = process.argv.includes('--apply')
  try {
    await db.$transaction(async tx => {
      const plan = planCopy(await tx.siteText.findMany(), await tx.navItem.findMany())
      console.table(plan.map(({ model, id, after }) => ({ model, id, replacement: after })))
      if (!apply) return
      for (const step of plan) {
        const result = await tx[step.model].updateMany({
          where: { id: step.id, [step.field]: step.before },
          data: { [step.field]: step.after },
        })
        if (result.count !== 1) throw new Error('Content changed during repair')
      }
    }, { maxWait: 20000, timeout: 30000 })
    console.log(apply ? 'COPY REPAIR: OK' : 'Preview only; use --apply to save.')
  } finally { await db.$disconnect() }
}

module.exports = { planCopy }
if (require.main === module) main().catch(() => {
  console.error('COPY REPAIR FAILED: check target database and retry after reviewing concurrent edits.')
  process.exitCode = 1
})
