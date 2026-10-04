import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NarrationFeedback, type NarrationFeedbackProps } from './narration-feedback';

export interface WelcomePromptProps {
  isVisible: boolean;
  message: string;
  language: 'ar' | 'en';
  isRTL: boolean;
  prefersReducedMotion: boolean;
  onPlay?: () => void;
  speechStatus: NarrationFeedbackProps['status'];
  speechError: string | null;
  isMuted: boolean;
  onMuteToggle: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function WelcomePrompt({
  isVisible,
  message,
  language,
  isRTL,
  prefersReducedMotion,
  onPlay,
  speechStatus,
  speechError,
  isMuted,
  onMuteToggle,
  onAccept,
  onDecline,
}: WelcomePromptProps) {
  const texts = {
    ar: {
      accept: 'ابدأ الجولة',
      decline: 'ليس الآن',
    },
    en: {
      accept: 'Start Tour',
      decline: 'Not Now',
    },
  };

  const t = texts[language];

  // Motion variants
  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: -20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-6 md:pt-8 pointer-events-none">
          <motion.div
            className="w-full max-w-sm sm:max-w-md p-5 rounded-2xl shadow-2xl bg-white border border-gray-100 flex flex-col gap-4 pointer-events-auto"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            dir={isRTL ? "rtl" : "ltr"}
            style={{ maxHeight: "calc(100dvh - 48px)", overflowY: "auto", marginTop: "env(safe-area-inset-top)" }}
            onKeyDown={event => { if (event.key === "Escape") onDecline() }}
            role="dialog"
            aria-modal="false"
            aria-live="polite"
            aria-labelledby="welcome-prompt-msg"
          >
            <div className="relative">
              <p
                id="welcome-prompt-msg"
                className={`text-base font-medium text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {message}
              </p>
            </div>
            
            <div className="text-gray-700">
              <NarrationFeedback language={language} status={speechStatus} error={speechError} isMuted={isMuted} onPlay={onPlay} />
              {isMuted && <button type="button" onClick={onMuteToggle} className="min-h-8 text-xs underline">{language === 'ar' ? 'تفعيل الصوت' : 'Unmute'}</button>}
            </div>
            <div className={`flex items-center gap-3 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={onAccept}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-[#fe6a52] rounded-xl hover:bg-[#e55942] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fe6a52] focus:ring-offset-1"
              >
                {t.accept}
              </button>
              <button
                onClick={onDecline}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
              >
                {t.decline}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
