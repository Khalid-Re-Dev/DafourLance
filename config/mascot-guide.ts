import messages from './guide-messages.json'
export const WELCOME_DELAY_MS = 5000
export const DWELL_NARRATION_THRESHOLD_MS = 10000
export const BUBBLE_LINGER_MS = 4000
export const GUIDE_STORAGE_KEY = 'dafourlance-guide-preferences'
export const WELCOME_TEXTS = {
  ar: { message: messages.welcome.ar.text, spokenMessage: messages.welcome.ar.spoken, accept: 'ابدأ الجولة', decline: 'ليس الآن' },
  en: { message: messages.welcome.en.text, spokenMessage: messages.welcome.en.spoken, accept: 'Start Tour', decline: 'Not Now' },
}
export type MessageId = keyof typeof messages
export { messages }
