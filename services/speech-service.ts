import { messages, type MessageId } from '../config/mascot-guide'
import assets from '../config/narration-assets.json'

type Language = 'ar' | 'en'
export type NarrationStatus = 'idle' | 'loading' | 'speaking' | 'paused' | 'blocked' | 'unavailable'
export interface SpeechCallbacks { onStart?: () => void; onEnd?: () => void; onError?: (reason: string) => void }
export const VOICE_READY_TIMEOUT_MS = 3000

/** One owner for asset playback and language-matched speech fallback. No eager fetches. */
export class SpeechService {
  private generation = 0
  private audio: HTMLAudioElement | null = null
  private utterance: SpeechSynthesisUtterance | null = null
  private timer: ReturnType<typeof setTimeout> | undefined
  private clearVoiceWait: (() => void) | undefined
  private error: string | null = null
  private listeners = new Set<(status: NarrationStatus) => void>()
  private status: NarrationStatus = 'idle'
  get isPlaying() { return this.status === 'speaking' }
  get currentStatus() { return this.status }
  get currentError() { return this.error }
  subscribeToStatusChanges = (listener: (status: NarrationStatus) => void) => {
    this.listeners.add(listener)
    listener(this.status)
    return () => { this.listeners.delete(listener) }
  }
  private setStatus(status: NarrationStatus) {
    this.status = status
    this.listeners.forEach(listener => listener(status))
  }
  stop = () => {
    this.generation++ // Invalidate callbacks before cancel() dispatches native events.
    clearTimeout(this.timer)
    this.clearVoiceWait?.()
    this.error = null
    if (this.audio) {
      this.audio.onplaying = this.audio.onended = this.audio.onerror = this.audio.onwaiting = null
      this.audio.pause()
      this.audio.removeAttribute('src')
      this.audio.load()
      this.audio = null
    }
    if (this.utterance && typeof window !== 'undefined') window.speechSynthesis?.cancel()
    this.utterance = null
    this.setStatus('idle')
  }
  cancel = this.stop
  pause = () => {
    if (this.audio) this.audio.pause()
    if (this.utterance) window.speechSynthesis?.pause()
    this.setStatus('paused')
  }
  play = (id: MessageId, language: Language, callbacks: SpeechCallbacks = {}) => {
    this.stop()
    if (typeof window === 'undefined') return
    const generation = this.generation
    const current = () => generation === this.generation
    const started = () => { if (current()) { clearTimeout(this.timer); this.setStatus('speaking'); callbacks.onStart?.() } }
    const ended = () => { if (current()) { clearTimeout(this.timer); this.setStatus('idle'); callbacks.onEnd?.() } }
    const failed = (reason: string) => {
      if (!current()) return
      this.stop()
      this.error = reason
      this.setStatus(reason === 'NotAllowedError' || reason === 'not-allowed' ? 'blocked' : 'unavailable')
      callbacks.onError?.(reason)
    }
    const speechFallback = () => {
      if (!current()) return
      const synth = window.speechSynthesis
      if (!synth || typeof SpeechSynthesisUtterance === 'undefined') { failed('speech-unsupported'); return }
      let waiting = true
      const cleanup = () => {
        waiting = false
        synth.removeEventListener('voiceschanged', tryVoice)
        clearTimeout(this.timer)
        this.clearVoiceWait = undefined
      }
      const tryVoice = () => {
        if (!current() || !waiting) return false
        let voice: SpeechSynthesisVoice | undefined
        try {
          voice = synth.getVoices().find(v => v.lang.toLowerCase().replace('_', '-').split('-')[0] === language)
        } catch { cleanup(); failed('voice-query-failed'); return false }
        if (!voice) return false
        cleanup()
        const utterance = new SpeechSynthesisUtterance(messages[id][language].spoken)
        this.utterance = utterance // Keep alive until end/cancel.
        utterance.voice = voice
        utterance.lang = voice.lang
        utterance.rate = 0.95
        utterance.onstart = started
        utterance.onend = ended
        utterance.onerror = event => failed(event.error)
        this.timer = setTimeout(() => failed('speech-start-timeout'), 5000)
        try { synth.speak(utterance) } catch { failed('speech-failed') }
        return true
      }
      this.setStatus('loading')
      this.clearVoiceWait = cleanup
      synth.addEventListener('voiceschanged', tryVoice)
      // Keep an already available voice synchronous with a user's Play gesture.
      if (!tryVoice() && waiting) {
        this.timer = setTimeout(() => {
          // Also handle engines that populated their list without emitting an event.
          if (!tryVoice() && current() && waiting) { cleanup(); failed('no-matching-voice') }
        }, VOICE_READY_TIMEOUT_MS)
      }
    }
    const path = (assets[language] as Record<string, string>)[id]
    if (!path) { speechFallback(); return }
    const audio = new Audio()
    this.audio = audio
    audio.preload = 'none'
    audio.src = path
    audio.onplaying = started
    audio.onended = ended
    audio.onwaiting = () => { if (current()) this.setStatus('loading') }
    let usedFallback = false
    const fallback = () => {
      if (!current() || usedFallback) return
      usedFallback = true
      clearTimeout(this.timer)
      audio.onplaying = audio.onended = audio.onerror = audio.onwaiting = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      this.audio = null
      speechFallback()
    }
    audio.onerror = fallback
    this.setStatus('loading')
    this.timer = setTimeout(fallback, 8000)
    try {
      void audio.play().catch(error => {
        if (!current()) return
        if (error.name === 'NotAllowedError') failed(error.name)
        else fallback()
      })
    } catch { fallback() }
  }
}
export const speechService = new SpeechService()
