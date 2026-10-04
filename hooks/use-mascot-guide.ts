import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'
import { speechService, type NarrationStatus } from '@/services/speech-service'
import { messages, type MessageId, WELCOME_DELAY_MS, DWELL_NARRATION_THRESHOLD_MS, GUIDE_STORAGE_KEY } from '@/config/mascot-guide'
import type { SectionId } from '@/types/mascot'

// Document lifecycle, not localStorage: survives route remounts, resets on hard refresh.
const cycle = { welcomeClaimed: false, enabled: false, narrated: new Set<string>() }

export function useMascotGuide({ isChatOpen, isUserInteracting, activeSection, isScrolling, isPageVisible, relocate }: {
  isChatOpen: boolean; isUserInteracting: boolean; activeSection: SectionId | null
  isScrolling: boolean; isPageVisible: boolean; relocate: (section: SectionId) => number
}) {
  const { language } = useLanguage()
  const [showWelcome, setShowWelcome] = useState(false)
  const [isGuidedMode, setIsGuidedMode] = useState(false)
  const [isMuted, setMuted] = useState(false)
  const [activeMessage, setActiveMessage] = useState<string | null>(null)
  const [speechStatus, setSpeechStatus] = useState<NarrationStatus>('idle')
  const [cycleNumber, setCycleNumber] = useState(0)
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const retryConsumed = useRef(false)
  const previousLanguage = useRef(language)
  const stopBubble = useCallback(() => {
    clearTimeout(bubbleTimer.current)
    speechService.stop()
    setActiveMessage(null)
  }, [])
  useEffect(() => {
    setIsGuidedMode(cycle.enabled)
    try { setMuted(JSON.parse(localStorage.getItem(GUIDE_STORAGE_KEY) || '{}').mutedNarration === true) } catch {}
    const unsubscribe = speechService.subscribeToStatusChanges(setSpeechStatus)
    return () => { unsubscribe(); clearTimeout(bubbleTimer.current); speechService.stop() }
  }, [])
  useEffect(() => {
    if (isChatOpen || !isPageVisible || cycle.welcomeClaimed) return
    // Delay measured from the navigation, so lazy-loading doesn't add five more seconds.
    const timer = setTimeout(() => {
      if (cycle.welcomeClaimed) return
      cycle.welcomeClaimed = true
      setShowWelcome(true)
    }, Math.max(0, WELCOME_DELAY_MS - performance.now()))
    return () => clearTimeout(timer)
  }, [isChatOpen, isPageVisible])
  // Cleanup runs before the new-language effect; no stale callbacks can start old speech.
  useEffect(() => {
    if (previousLanguage.current !== language) {
      previousLanguage.current = language
      stopBubble()
    }
  }, [language, stopBubble])
  useEffect(() => {
    if (!showWelcome || isChatOpen || !isPageVisible || isMuted) return
    const timer = setTimeout(() => speechService.play('welcome', language), 0)
    return () => { clearTimeout(timer); speechService.stop() }
  }, [showWelcome, isChatOpen, isPageVisible, isMuted, language])
  useEffect(() => {
    if (isChatOpen || isScrolling || isUserInteracting || !isPageVisible) stopBubble()
    if (isChatOpen) { cycle.welcomeClaimed = true; setShowWelcome(false) }
  }, [isChatOpen, isScrolling, isUserInteracting, isPageVisible, stopBubble])
  useEffect(() => {
    if (!isGuidedMode || showWelcome || isChatOpen || isScrolling || isUserInteracting || !isPageVisible || !activeSection) return
    const token = `${language}:${activeSection}`
    if (cycle.narrated.has(token)) return
    let narrationTimer: ReturnType<typeof setTimeout>
    const dwellTimer = setTimeout(() => {
      const duration = relocate(activeSection)
      narrationTimer = setTimeout(() => {
        if (cycle.narrated.has(token)) return
        cycle.narrated.add(token)
        const message = messages[activeSection as MessageId][language].text
        setActiveMessage(message)
        clearTimeout(bubbleTimer.current)
        // Visual-only timeout also guards missing native audio callbacks.
        bubbleTimer.current = setTimeout(() => setActiveMessage(null), Math.max(8000, message.length * 85))
        if (!isMuted) speechService.play(activeSection, language, {
          onEnd: () => {
            clearTimeout(bubbleTimer.current)
            bubbleTimer.current = setTimeout(() => setActiveMessage(null), 4000)
          },
        })
      }, duration)
    }, DWELL_NARRATION_THRESHOLD_MS)
    return () => { clearTimeout(dwellTimer); clearTimeout(narrationTimer) }
  }, [activeSection, isGuidedMode, showWelcome, isChatOpen, isScrolling, isUserInteracting, isPageVisible, language, isMuted, cycleNumber, relocate])
  const acceptGuide = useCallback(() => {
    stopBubble() // Starting a tour never restarts the welcome sentence.
    cycle.enabled = true
    setShowWelcome(false)
    setIsGuidedMode(true)
  }, [stopBubble])
  const dismissGuide = useCallback(() => {
    stopBubble()
    cycle.welcomeClaimed = true
    cycle.enabled = false
    setShowWelcome(false)
    setIsGuidedMode(false)
  }, [stopBubble])
  const startGuideCycle = useCallback(() => {
    stopBubble()
    cycle.narrated.clear()
    cycle.enabled = true
    cycle.welcomeClaimed = true
    setShowWelcome(false)
    setIsGuidedMode(true)
    setCycleNumber(n => n + 1)
  }, [stopBubble])
  const toggleMute = useCallback(() => {
    const next = !isMuted
    setMuted(next)
    if (next) speechService.stop()
    try { localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify({ mutedNarration: next })) } catch {}
  }, [isMuted])
  const retryWelcome = useCallback(() => {
    if (retryConsumed.current || !showWelcome || speechService.isPlaying) return
    retryConsumed.current = true
    speechService.play('welcome', language)
  }, [showWelcome, language])
  return { showWelcome, welcomeMessage: messages.welcome[language].text, isGuidedMode, isMuted,
    activeMessage, speechStatus, acceptGuide, dismissGuide, startGuideCycle, toggleMute,
    dismissBubble: stopBubble, retryWelcome, canRetryWelcome: speechStatus === 'blocked' && !retryConsumed.current }
}
