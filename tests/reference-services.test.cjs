const { test } = require('node:test')
const assert = require('node:assert/strict')
const { planServices } = require('../scripts/restore-reference-services.cjs')
const defaults = require('../scripts/service-defaults.cjs')

test('fresh database receives six services in reference RTL order', () => {
  const plan = planServices([])
  assert.equal(plan.length, 6)
  assert.ok(plan.every(step => step.action === 'create' && step.data.isActive))
  assert.equal(plan[0].data.titleAr, 'تطوير المواقع')
  assert.equal(plan[5].data.titleAr, 'تحليل البيانات')
})
test('repeat execution preserves edited content and IDs without duplicate inserts', () => {
  const existing = defaults.map(item => ({ ...item, id: `imported-${item.id}`, descriptionAr: 'محتوى مخصص', isActive: false }))
  const plan = planServices(existing)
  assert.ok(plan.every(step => step.action === 'update' && step.id.startsWith('imported-')))
  for (const step of plan) assert.deepEqual(Object.keys(step.data).sort(), ['isActive', 'order'])
  assert.equal(existing[0].descriptionAr, 'محتوى مخصص')
})
test('ambiguous duplicate matches stop rather than overwrite a chosen record', () => {
  assert.throws(() => planServices([defaults[0], { ...defaults[0], id: 'duplicate' }]), /Ambiguous/)
})
