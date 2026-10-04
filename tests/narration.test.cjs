const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
// Exercise the real service with deterministic native media implementations.
function setup({ asset = true, voices = [] } = {}) {
  const instances = []; const utterances = []; let cancelCount = 0
  class Audio {
    constructor() { instances.push(this); this.onplaying = null; this.onended = null; this.onerror = null }
    play() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject }) }
    pause() { this.paused = true }
    load() {}
    removeAttribute() {}
  }
  const exports = {}
  const context = { exports, Audio, SpeechSynthesisUtterance: class { constructor(text) { this.text = text } },
    window: { speechSynthesis: { getVoices: () => voices, speak: u => utterances.push(u), cancel: () => cancelCount++, pause() {} } },
    setTimeout, clearTimeout,
    require: name => name.includes('narration-assets') ? { en: asset ? { welcome: '/welcome.mp3', hero: '/hero.mp3' } : {}, ar: {} }
      : { messages: require('../config/guide-messages.json') },
  }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('services/speech-service.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, context)
  return { service: new exports.SpeechService(), instances, utterances, cancels: () => cancelCount }
}
test('speaking begins on actual playing event, not play request; stale events cannot win', () => {
  const { service, instances } = setup(); let started = 0
  service.play('welcome', 'en', { onStart: () => started++ })
  assert.equal(service.currentStatus, 'loading'); assert.equal(service.isPlaying, false)
  const stale = instances[0].onplaying
  service.play('hero', 'en'); stale()
  assert.equal(started, 0); assert.equal(service.isPlaying, false)
  instances[1].onplaying(); assert.equal(service.isPlaying, true)
  service.stop(); assert.equal(service.currentStatus, 'idle'); assert.equal(instances[1].paused, true)
})
test('autoplay rejection is surfaced; it never falls through to another voice', async () => {
  const { service, instances, utterances } = setup({ voices: [{ lang: 'en-US' }] })
  service.play('welcome', 'en')
  instances[0].reject({ name: 'NotAllowedError' }); await new Promise(setImmediate)
  assert.equal(service.currentStatus, 'blocked'); assert.equal(utterances.length, 0)
  service.stop()
})
test('Arabic never uses an English-only voice and downloads no model', () => {
  const { service, instances, utterances } = setup({ voices: [{ lang: 'en-US' }] })
  service.play('welcome', 'ar')
  assert.equal(service.currentStatus, 'unavailable'); assert.equal(instances.length, 0); assert.equal(utterances.length, 0)
})
test('missing asset uses only matching language; language change invalidates old callbacks', () => {
  const { service, instances, utterances, cancels } = setup({ voices: [{ lang: 'en-US' }, { lang: 'ar-JO' }] })
  service.play('welcome', 'en'); instances[0].onerror()
  assert.equal(utterances[0].lang, 'en-US'); const stale = utterances[0].onstart
  service.play('welcome', 'ar'); stale()
  assert.equal(service.currentStatus, 'loading'); assert.equal(utterances[1].lang, 'ar-JO')
  utterances[1].onstart(); assert.equal(service.isPlaying, true); assert.ok(cancels() >= 1)
  service.stop()
})
test('late rejected promise after cancellation cannot start fallback', async () => {
  const { service, instances, utterances } = setup({ voices: [{ lang: 'en-US' }] })
  service.play('welcome', 'en'); service.stop(); instances[0].reject({ name: 'NetworkError' })
  await new Promise(setImmediate)
  assert.equal(service.currentStatus, 'idle'); assert.equal(utterances.length, 0)
})
