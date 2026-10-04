const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
// Exercise the real service with deterministic native media implementations.
function setup({ asset = true, voices = [] } = {}) {
  const instances = []; const utterances = []; let cancelCount = 0
  const voiceListeners = new Set(); const timers = new Map(); let timerId = 0
  const synth = { getVoices: () => voices, speak: u => utterances.push(u), cancel: () => cancelCount++, pause() {},
    addEventListener: (_event, callback) => voiceListeners.add(callback),
    removeEventListener: (_event, callback) => voiceListeners.delete(callback),
  }
  class Audio {
    constructor() { instances.push(this); this.onplaying = null; this.onended = null; this.onerror = null }
    play() { return new Promise((resolve, reject) => { this.resolve = resolve; this.reject = reject }) }
    pause() { this.paused = true }
    load() {}
    removeAttribute() {}
  }
  const exports = {}
  const context = { exports, Audio, SpeechSynthesisUtterance: class { constructor(text) { this.text = text } },
    window: { speechSynthesis: synth },
    setTimeout: (callback, ms) => { timers.set(++timerId, { callback, ms }); return timerId },
    clearTimeout: id => timers.delete(id),
    require: name => name.includes('narration-assets') ? { en: asset ? { welcome: '/welcome.mp3', hero: '/hero.mp3' } : {}, ar: {} }
      : { messages: require('../config/guide-messages.json') },
  }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('services/speech-service.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText, context)
  return { service: new exports.SpeechService(), instances, utterances, context, synth, cancels: () => cancelCount,
    voiceListeners, timers,
    setVoices: (next, emit = true) => { voices = next; if (emit) [...voiceListeners].forEach(callback => callback()) },
    expire: ms => { for (const [id, timer] of [...timers]) if (timer.ms === ms) { timers.delete(id); timer.callback() } },
  }
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
  const { service, instances, utterances, expire } = setup({ voices: [{ lang: 'en-US' }] })
  service.play('welcome', 'ar')
  assert.equal(service.currentStatus, 'loading'); expire(3000)
  assert.equal(service.currentStatus, 'unavailable'); assert.equal(instances.length, 0); assert.equal(utterances.length, 0)
  assert.equal(service.currentError, 'no-matching-voice')
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
test('delayed Arabic voices start exactly once and detach the readiness listener', () => {
  const { service, setVoices, voiceListeners, utterances } = setup()
  service.play('welcome', 'ar')
  assert.equal(service.currentStatus, 'loading'); assert.equal(utterances.length, 0)
  setVoices([{ lang: 'en-US' }]); assert.equal(utterances.length, 0)
  setVoices([{ lang: 'ar_SA' }]); setVoices([{ lang: 'ar_SA' }])
  assert.equal(utterances.length, 1); assert.equal(utterances[0].lang, 'ar_SA'); assert.equal(voiceListeners.size, 0)
  utterances[0].onstart(); assert.equal(service.currentStatus, 'speaking'); service.stop()
})
test('cancellation removes the readiness listener and ignores a queued voiceschanged callback', () => {
  const { service, setVoices, voiceListeners, utterances, timers } = setup()
  service.play('welcome', 'ar'); const stale = [...voiceListeners][0]
  service.stop(); setVoices([{ lang: 'ar-SA' }]); stale()
  assert.equal(utterances.length, 0); assert.equal(voiceListeners.size, 0); assert.equal(timers.size, 0)
  assert.equal(service.currentStatus, 'idle')
})
test('switching to English media cancels pending Arabic voice discovery', () => {
  const { service, setVoices, utterances, voiceListeners, instances } = setup()
  service.play('welcome', 'ar'); service.play('welcome', 'en'); setVoices([{ lang: 'ar-SA' }])
  assert.equal(utterances.length, 0); assert.equal(instances.length, 1); assert.equal(voiceListeners.size, 0)
  service.stop()
})
test('bounded readiness timeout reports the reason and never starts audio later without a new request', () => {
  const { service, expire, setVoices, utterances, voiceListeners } = setup(); const errors = []
  service.play('welcome', 'ar', { onError: reason => errors.push(reason) }); expire(3000)
  assert.equal(service.currentStatus, 'unavailable'); assert.deepEqual(errors, ['no-matching-voice']); assert.equal(voiceListeners.size, 0)
  setVoices([{ lang: 'ar-SA' }]); assert.equal(utterances.length, 0)
  service.play('welcome', 'ar'); assert.equal(utterances.length, 1); assert.equal(service.currentError, null)
  service.stop()
})
test('final readiness check finds voices even if the engine omitted voiceschanged', () => {
  const { service, expire, setVoices, utterances } = setup()
  service.play('welcome', 'ar'); setVoices([{ lang: 'ar-SA' }], false); expire(3000)
  assert.equal(utterances.length, 1); assert.equal(service.currentStatus, 'loading'); service.stop()
})
test('unsupported speech and engine failure report actionable errors', () => {
  const { service, context } = setup(); context.window.speechSynthesis = undefined
  service.play('welcome', 'ar'); assert.equal(service.currentError, 'speech-unsupported')
  const broken = setup(); broken.synth.getVoices = () => { throw Error('engine failed') }
  broken.service.play('welcome', 'ar'); assert.equal(broken.service.currentError, 'voice-query-failed')
  assert.equal(broken.voiceListeners.size, 0); assert.equal(broken.timers.size, 0)
})
test('a direct retry with a ready voice is synchronous and exposes speech autoplay denial', () => {
  const { service, utterances } = setup({ voices: [{ lang: 'ar-SA' }] })
  service.play('welcome', 'ar'); assert.equal(utterances.length, 1)
  utterances[0].onerror({ error: 'not-allowed' }); assert.equal(service.currentStatus, 'blocked')
  service.play('welcome', 'ar'); assert.equal(utterances.length, 2)
  utterances[1].onstart(); assert.equal(service.currentStatus, 'speaking'); service.stop()
})
