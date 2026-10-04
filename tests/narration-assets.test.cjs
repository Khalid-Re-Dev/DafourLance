const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createHash } = require('node:crypto')
const messages = require('../config/guide-messages.json')
const assets = require('../config/narration-assets.json')

for (const language of ['ar', 'en']) {
  test(`${language}: all guide messages have distinct, versioned local MP3s matching their provenance`, () => {
    assert.deepEqual(Object.keys(assets[language]).sort(), Object.keys(messages).sort())
    const provenance = require(`../public/audio/guide/${language}/generation.json`)
    const hashes = new Set()
    for (const [key, url] of Object.entries(assets[language])) {
      const parsed = new URL(url, 'https://test.invalid')
      assert.equal(parsed.pathname, `/audio/guide/${language}/${key}.mp3`)
      const bytes = fs.readFileSync(path.join(__dirname, '../public', parsed.pathname))
      const digest = createHash('sha256').update(bytes).digest('hex')
      assert.equal(parsed.searchParams.get('v'), digest.slice(0, 12))
      assert.equal(provenance.files[key].sha256, digest)
      assert.equal(provenance.files[key].bytes, bytes.length)
      assert.ok(bytes.length > 1000)
      assert.equal(provenance.files[key].sourceText || provenance.files[key].spokenText, messages[key][language].spoken)
      hashes.add(digest)
    }
    assert.equal(hashes.size, Object.keys(messages).length)
  })
}
