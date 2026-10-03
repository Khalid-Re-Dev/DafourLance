import { SpeechStatus } from '@/types/mascot-guide';

export interface SpeechCallbacks {
  onComplete?: () => void;
  onCancelled?: () => void;
}

class SpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private currentStatus: SpeechStatus = 'idle';
  private statusListeners: ((status: SpeechStatus) => void)[] = [];
  private pendingSpeech: { text: string; language: 'ar' | 'en'; callbacks?: SpeechCallbacks } | null = null;
  
  // Default config
  private rate = 0.95;
  private pitch = 1;
  private volume = 1;

  public initialize() {
    if (typeof window === 'undefined' || !window.speechSynthesis || this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.loadVoices();
    
    // Some browsers need a listener for when voices are loaded asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        this.loadVoices();
        console.log(`[SpeechService] voiceschanged. voiceCount: ${this.voices.length}, hasPending: ${!!this.pendingSpeech}`);
        // Guard: do not replay pending speech if we are already speaking.
        // This prevents voiceschanged (which can fire multiple times) from
        // cancelling and restarting active speech.
        if (this.pendingSpeech && this.voices.length > 0 && this.currentStatus !== 'speaking') {
          const { text, language, callbacks } = this.pendingSpeech;
          this.pendingSpeech = null;
          this.speak(text, language, callbacks);
        }
      });
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  public isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return !!window.speechSynthesis;
  }

  public hasVoiceForLanguage(language: 'ar' | 'en'): boolean {
    if (!this.isAvailable()) return false;
    if (!this.isInitialized) {
      this.initialize();
    }
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.getPreferredVoice(language) !== null;
  }

  private getPreferredVoice(language: 'ar' | 'en'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    
    if (language === 'ar') {
      const arabicVoices = this.voices.filter(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        if (lang.startsWith('ar')) return true;
        const name = (v.name || '').toLowerCase();
        return name.includes('arabic') || name.includes('العربية');
      });
      if (arabicVoices.length > 0) {
        // Prefer local voice if possible
        const local = arabicVoices.find(v => v.localService);
        return local || arabicVoices[0];
      }
    } else {
      const englishVoices = this.voices.filter(v => {
        const lang = (v.lang || '').toLowerCase().replace('_', '-');
        if (lang.startsWith('en')) return true;
        const name = (v.name || '').toLowerCase();
        return name.includes('english');
      });
      if (englishVoices.length > 0) {
        // Prefer a smooth local voice
        const local = englishVoices.find(v => v.localService);
        return local || englishVoices[0];
      }
    }
    
    // No matching voice for this language
    return null;
  }

  private setStatus(status: SpeechStatus) {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusListeners.forEach(listener => listener(status));
    }
  }

  public subscribeToStatusChanges(listener: (status: SpeechStatus) => void): () => void {
    this.statusListeners.push(listener);
    // Send immediate initial status
    listener(this.currentStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  public speak(text: string, language: 'ar' | 'en', callbacks?: SpeechCallbacks): boolean {
    if (!this.isAvailable()) return false;

    if (!this.isInitialized) {
      this.initialize();
    }

    console.log(`[SpeechService] speak() entry. lang=${language}, textLength=${text.length}`);

    this.cancel(); // Cancel any ongoing speech

    if (this.voices.length === 0) {
      console.log('[SpeechService] voices not yet loaded, pendingSpeech queued');
      this.pendingSpeech = { text, language, callbacks };
      return false;
    }

    const voice = this.getPreferredVoice(language);
    console.log(`[SpeechService] voice count: ${this.voices.length}, selectedVoice: ${voice ? voice.name : 'null (no matching voice)'}, lang: ${language}`);

    if (!voice) {
      console.warn(`[SpeechService] No voice available for language '${language}'. Audible TTS skipped.`);
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang || (language === 'ar' ? 'ar-SA' : 'en-US');
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    utterance.onstart = () => {
      console.log('[SpeechService] utterance onstart');
      this.setStatus('speaking');
    };
    utterance.onend = () => {
      console.log('[SpeechService] utterance onend');
      this.setStatus('idle');
      callbacks?.onComplete?.();
    };
    utterance.onerror = (e) => {
      console.log(`[SpeechService] utterance onerror: ${e.error}`);
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        this.setStatus('error');
        callbacks?.onCancelled?.();
      } else {
        this.setStatus('idle');
        callbacks?.onCancelled?.();
      }
    };
    utterance.onpause = () => this.setStatus('paused');
    utterance.onresume = () => this.setStatus('speaking');

    try {
      console.log('[SpeechService] native speechSynthesis.speak() invocation');
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('[SpeechService] native speechSynthesis.speak() failed:', e);
      this.setStatus('error');
      callbacks?.onCancelled?.();
      return false;
    }
  }

  public cancel(): void {
    if (!this.isAvailable()) return;
    const wasActive = (typeof window !== 'undefined' && !!window.speechSynthesis && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) || this.currentStatus === 'speaking';
    console.log(`[SpeechService] cancel() invocation. wasActive: ${wasActive}`);
    this.pendingSpeech = null;
    try {
      window.speechSynthesis.cancel();
      this.setStatus('idle');
    } catch (e) {
      // Ignore
    }
  }

  public pause(): void {
    if (!this.isAvailable()) return;
    try {
      window.speechSynthesis.pause();
    } catch (e) {
      // Ignore
    }
  }

  public resume(): void {
    if (!this.isAvailable()) return;
    try {
      window.speechSynthesis.resume();
    } catch (e) {
      // Ignore
    }
  }
}

export const speechService = new SpeechService();

// ============================================================================
// TEMPORARY DIAGNOSTIC TEST (REMOVE AFTER TESTING)
// ============================================================================
if (typeof window !== 'undefined') {
  (window as unknown as { __testEnglishTTS?: (text?: string) => boolean }).__testEnglishTTS = (
    text: string = 'Hello from Dafourlance.'
  ) => {
    return speechService.speak(text, 'en');
  };
}
// ============================================================================
