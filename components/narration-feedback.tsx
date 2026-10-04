import type { NarrationStatus } from '@/services/speech-service'

export interface NarrationFeedbackProps {
  language: 'ar' | 'en'
  status: NarrationStatus
  error: string | null
  isMuted: boolean
  onPlay?: () => void
}

/** Explain silence and offer a direct playback gesture; never retry automatically. */
export function NarrationFeedback({ language, status, error, isMuted, onPlay }: NarrationFeedbackProps) {
  const ar = language === 'ar'
  const message = isMuted
    ? (ar ? 'الصوت مكتوم.' : 'Audio is muted.')
    : status === 'loading'
      ? (ar ? 'جارٍ تجهيز الصوت…' : 'Preparing audio…')
      : status === 'blocked'
        ? (ar ? 'المتصفح منع التشغيل التلقائي. اضغط تشغيل الصوت.' : 'Autoplay was blocked. Select Play audio.')
        : status === 'unavailable'
          ? error === 'no-matching-voice'
            ? (ar ? 'لم يتوفر صوت عربي في هذا المتصفح. يمكنك متابعة الجولة نصيًا أو إعادة المحاولة.' : 'No English voice is available in this browser. Continue with text or retry.')
            : error === 'speech-unsupported'
              ? (ar ? 'هذا المتصفح لا يدعم النطق الصوتي. يمكنك متابعة الجولة نصيًا.' : 'This browser does not support speech. You can continue with text.')
              : (ar ? 'تعذّر تشغيل الصوت. يمكنك إعادة المحاولة.' : 'Audio could not start. You can retry.')
          : null
  const canPlay = !isMuted && status !== 'loading' && status !== 'speaking' && onPlay
  return <div className="space-y-2 text-xs leading-relaxed">
    {message && <p role="status">{message}</p>}
    {canPlay && <button type="button" onClick={onPlay} className="min-h-8 underline underline-offset-4 focus-visible:outline">
      {ar ? 'تشغيل الصوت' : 'Play audio'}
    </button>}
  </div>
}
