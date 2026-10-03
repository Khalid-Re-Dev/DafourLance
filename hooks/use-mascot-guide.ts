import { useState, useEffect, useCallback, useRef } from 'react';
import { GuideState, GuidePreferences, SpeechStatus } from '@/types/mascot-guide';
import { guidePreferencesService } from '@/services/guide-preferences';
import { WELCOME_DELAY_MS, WELCOME_AUTO_DISMISS_MS, DWELL_NARRATION_THRESHOLD_MS, GUIDE_SECTIONS, WELCOME_TEXTS } from '@/config/mascot-guide';
import { useLanguage } from '@/lib/i18n/language-context';
import { useActiveSection } from '@/hooks/use-active-section';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { speechService } from '@/services/speech-service';

export interface UseMascotGuideParams {
  isChatOpen: boolean;
  isUserInteracting?: boolean;
}

export function useMascotGuide({ isChatOpen, isUserInteracting = false }: UseMascotGuideParams) {
  const { language } = useLanguage();
  const { activeSection } = useActiveSection();
  const prefersReducedMotion = useReducedMotion();

  // Internal state
  const [guideState, setGuideState] = useState<GuideState>({ status: 'idle' });
  const [preferences, setPreferences] = useState<GuidePreferences>(() => 
    guidePreferencesService.getPreferences()
  );
  const [showWelcome, setShowWelcome] = useState(false);
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  // Refs for timers to ensure safe cleanup
  const welcomeDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Welcome Speech Ref for one-shot execution
  const welcomeSpeechConsumedRef = useRef<string | null>(null);
  const welcomeSpeechSuccessRef = useRef(false);
  const welcomeMessage = language === 'ar' ? WELCOME_TEXTS.ar.message : WELCOME_TEXTS.en.message;
  const spokenWelcomeMessage = language === 'ar' ? WELCOME_TEXTS.ar.spokenMessage : WELCOME_TEXTS.en.spokenMessage;
  const isFirstLanguageRenderRef = useRef(true);

  // Sync preferences from local storage on mount
  useEffect(() => {
    setPreferences(guidePreferencesService.getPreferences());
    speechService.initialize();
  }, []);

  // Update preferences helper
  const updatePreferences = useCallback((updates: Partial<GuidePreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      guidePreferencesService.savePreferences(next);
      return next;
    });
  }, []);

  // Welcome Eligibility logic
  useEffect(() => {
    // If chat is open, cancel welcome timers and hide welcome
    if (isChatOpen) {
      if (welcomeDelayTimerRef.current) clearTimeout(welcomeDelayTimerRef.current);
      if (welcomeDismissTimerRef.current) clearTimeout(welcomeDismissTimerRef.current);
      setShowWelcome(false);
      return;
    }

    // Only show welcome if they haven't seen it, guide is enabled, and not in guided mode already
    if (!preferences.hasSeenWelcome && preferences.guideEnabled && !isGuidedMode && guideState.status === 'idle') {
      welcomeDelayTimerRef.current = setTimeout(() => {
        setGuideState({ status: 'welcome_prompt' });
        setShowWelcome(true);

        welcomeDismissTimerRef.current = setTimeout(() => {
          setShowWelcome(false);
          setGuideState({ status: 'idle' });
          updatePreferences({ hasSeenWelcome: true });
        }, WELCOME_AUTO_DISMISS_MS);
      }, WELCOME_DELAY_MS);
    }

    return () => {
      if (welcomeDelayTimerRef.current) clearTimeout(welcomeDelayTimerRef.current);
      if (welcomeDismissTimerRef.current) clearTimeout(welcomeDismissTimerRef.current);
    };
  }, [preferences.hasSeenWelcome, preferences.guideEnabled, isGuidedMode, guideState.status, isChatOpen, updatePreferences]);

  // Welcome TTS execution
  useEffect(() => {
    if (showWelcome && !isChatOpen) {
      const token = `welcome-${language}`;
      if (welcomeSpeechConsumedRef.current !== token) {
        welcomeSpeechConsumedRef.current = token;
        console.log(`[WELCOME_TTS] trigger. lang=${language}, textLength=${spokenWelcomeMessage.length}`);
        if (!preferences.mutedNarration && speechService.isAvailable() && speechService.hasVoiceForLanguage(language)) {
          speechService.speak(spokenWelcomeMessage, language, {
            onComplete: () => {
              welcomeSpeechSuccessRef.current = true;
            },
          });
        }
      }
    } else {
      // If prompt hides, do we clear the token? No, we don't want it replaying 
      // if something forces a re-render. We keep the token per lifecycle.
      // But if chat opens, we cancel speech (already handled).
    }
  }, [showWelcome, language, isChatOpen, preferences.mutedNarration, spokenWelcomeMessage]);

  // Handle chat open state override
  useEffect(() => {
    if (isChatOpen) {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
      setPendingMessage(null);
      setGuideState({ status: 'chat_open' });
    } else if (guideState.status === 'chat_open') {
      setGuideState(isGuidedMode ? { status: 'observing' } : { status: 'idle' });
    }
  }, [isChatOpen, guideState.status, isGuidedMode]);

  // Handle user interaction pause override
  useEffect(() => {
    if (isUserInteracting && isGuidedMode && !isChatOpen) {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
      setGuideState({ status: 'interaction_paused' });
    } else if (!isUserInteracting && guideState.status === 'interaction_paused') {
      setGuideState({ status: 'observing' });
    }
  }, [isUserInteracting, isGuidedMode, isChatOpen, guideState.status]);

  // Main Section Dwell Engine
  useEffect(() => {
    // Clear previous timer on any dependency change
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
    
    // Any disruption clears the pending message
    setPendingMessage(null);

    const isEligibleForDwell = 
      isGuidedMode &&
      preferences.guideEnabled &&
      !isChatOpen &&
      !isUserInteracting &&
      speechStatus !== 'speaking' &&
      activeSection &&
      GUIDE_SECTIONS[activeSection]?.enabled !== false &&
      !preferences.narratedSections.includes(activeSection);

    if (isEligibleForDwell) {
      // Safely transition to section_dwell without adding guideState to dependencies
      setGuideState(prev => {
        if (prev.status !== 'section_dwell' || (prev.status === 'section_dwell' && prev.sectionId !== activeSection)) {
          return { status: 'section_dwell', sectionId: activeSection };
        }
        return prev;
      });

      dwellTimerRef.current = setTimeout(() => {
        const sectionMeta = GUIDE_SECTIONS[activeSection];
        if (sectionMeta) {
          const localizedMessage = language === 'ar' ? sectionMeta.messageAr : sectionMeta.messageEn;
          setPendingMessage(localizedMessage);
          setGuideState({ status: 'preparing_message', sectionId: activeSection });
        }
      }, DWELL_NARRATION_THRESHOLD_MS);
    } else {
      setGuideState(prev => {
        if (prev.status === 'section_dwell' || prev.status === 'preparing_message') {
          return { status: 'observing' };
        }
        return prev;
      });
    }

    return () => {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
      }
    };
  }, [
    activeSection,
    isGuidedMode,
    preferences.guideEnabled,
    preferences.narratedSections,
    isChatOpen,
    isUserInteracting,
    speechStatus,
    language
  ]);

  // Reduced motion override
  useEffect(() => {
    if (prefersReducedMotion && guideState.status !== 'reduced_motion' && !isChatOpen) {
      // Keep architecture compatible, but don't force state unless needed.
    }
  }, [prefersReducedMotion, guideState.status, isChatOpen]);

  // Speech status subscription
  useEffect(() => {
    const unsubscribe = speechService.subscribeToStatusChanges((status) => {
      setSpeechStatus(status);
      if (status === 'speaking') {
        setGuideState(prev => {
          // Note: welcomeSpeechSuccessRef is now set via onComplete callback
          // in the speak() call, not here. This avoids marking success on
          // speech start rather than speech completion.
          return prev.status !== 'chat_open' && prev.status !== 'idle' ? { status: 'speaking' } : prev;
        });
      }
    });
    return unsubscribe;
  }, []);

  // Language synchronization (cancel speech if language changes)
  // Skip the initial mount invocation — speech hasn't started yet and
  // a mount-time cancel() would be harmless but adds fragility.
  useEffect(() => {
    if (isFirstLanguageRenderRef.current) {
      isFirstLanguageRenderRef.current = false;
      return;
    }
    speechService.cancel();
  }, [language]);

  // API Methods
  const acceptGuide = useCallback(() => {
    setShowWelcome(false);
    setIsGuidedMode(true);
    setGuideState({ status: 'observing' });
    updatePreferences({ hasSeenWelcome: true });
    
    // Stop any active welcome speech
    speechService.cancel();

    // Prepare speech service for future use
    speechService.initialize();

    // If welcome speech didn't succeed (e.g. blocked by autoplay), retry it now with user gesture
    if (!welcomeSpeechSuccessRef.current && !preferences.mutedNarration && speechService.isAvailable() && speechService.hasVoiceForLanguage(language)) {
      speechService.speak(spokenWelcomeMessage, language, {
        onComplete: () => {
          welcomeSpeechSuccessRef.current = true;
        },
      });
    }
  }, [updatePreferences, preferences.mutedNarration, spokenWelcomeMessage, language]);

  const dismissGuide = useCallback(() => {
    setShowWelcome(false);
    setIsGuidedMode(false);
    setGuideState({ status: 'dismissed' });
    updatePreferences({ hasSeenWelcome: true });
    
    // Stop any active welcome speech
    speechService.cancel();
  }, [updatePreferences]);

  const toggleMute = useCallback(() => {
    updatePreferences({ mutedNarration: !preferences.mutedNarration });
  }, [preferences.mutedNarration, updatePreferences]);

  const startGuideCycle = useCallback(() => {
    const cycleId = Date.now().toString();
    setIsGuidedMode(true);
    setGuideState({ status: 'observing' });
    updatePreferences({ 
      narratedSections: [],
      guideCycleId: cycleId 
    });
  }, [updatePreferences]);

  const resetGuideCycle = useCallback(() => {
    setIsGuidedMode(false);
    setGuideState({ status: 'idle' });
    updatePreferences({ narratedSections: [] });
  }, [updatePreferences]);

  return {
    guideState,
    isGuidedMode,
    isMuted: preferences.mutedNarration,
    isNarrationEligible: guideState.status === 'preparing_message',
    pendingMessage,
    showWelcome,
    welcomeMessage,
    activeSection,
    narratedSections: preferences.narratedSections,
    acceptGuide,
    dismissGuide,
    toggleMute,
    startGuideCycle,
    resetGuideCycle,
    speechStatus
  };
}
