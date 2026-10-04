"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, MessageCircle, Phone, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import AnimatedMascot from "@/components/animated-mascot"
import { useMascotMotion } from "@/hooks/use-mascot-motion"
import { useActiveSection } from "@/hooks/use-active-section"
import { useMascotGuide } from "@/hooks/use-mascot-guide"
import { WelcomePrompt } from "@/components/welcome-prompt"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { MascotSpeechBubble } from "@/components/mascot-speech-bubble"
import {
  IDLE_FLOAT_AMPLITUDE,
  IDLE_FLOAT_DURATION,
  IDLE_TILT_DEGREES,
  ATTENTION_LIFT_PX,
  ATTENTION_SCALE,
  ATTENTION_DURATION_S,
} from "@/config/mascot-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  showFallback?: boolean
}

const STORAGE_KEY = "daforlance-ai-chat-history"
const WHATSAPP_URL = "https://wa.me/967777000000"

// Robot SVG Icon Component
function RobotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Head */}
      <rect x="16" y="16" width="32" height="28" rx="6" fill="white" />
      {/* Antenna */}
      <circle cx="32" cy="10" r="4" fill="#fe6a52" />
      <rect x="30" y="10" width="4" height="8" fill="#fe6a52" />
      {/* Eyes */}
      <circle cx="24" cy="28" r="5" fill="#1f2b3b" />
      <circle cx="40" cy="28" r="5" fill="#1f2b3b" />
      <circle cx="25" cy="27" r="2" fill="white" />
      <circle cx="41" cy="27" r="2" fill="white" />
      {/* Mouth */}
      <rect x="26" y="36" width="12" height="3" rx="1.5" fill="#1f2b3b" />
      {/* Body */}
      <rect x="20" y="46" width="24" height="14" rx="4" fill="white" />
      {/* Chest light */}
      <circle cx="32" cy="53" r="3" fill="#fe6a52" />
      {/* Arms */}
      <rect x="10" y="48" width="8" height="4" rx="2" fill="white" />
      <rect x="46" y="48" width="8" height="4" rx="2" fill="white" />
    </svg>
  )
}

// Typing indicator component
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <motion.div
        className="w-2 h-2 bg-[#fe6a52] rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-[#fe6a52] rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.15 }}
      />
      <motion.div
        className="w-2 h-2 bg-[#fe6a52] rounded-full"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
      />
    </div>
  )
}

export default function SmartAssistant() {
  const { language, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  const { activeSection, isScrolling, isPageVisible } = useActiveSection()
  const { containerRef, motionState, targetPosition, mascotSize, isRelocating,
    relocationDuration, hasMounted, handleInteractionStart, handleInteractionEnd,
    isUserInteracting, relocate } = useMascotMotion({ isChatOpen: isOpen, isRTL, isScrolling, isPageVisible })
  const { showWelcome, welcomeMessage, acceptGuide, dismissGuide, isMuted, toggleMute,
    isGuidedMode, activeMessage, speechStatus, dismissBubble, retryWelcome,
    speechError, retryNarration, startGuideCycle } = useMascotGuide({ isChatOpen: isOpen,
      isUserInteracting, activeSection, isScrolling, isPageVisible, relocate })
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Determine idle float animation based on motion state
  const shouldFloat =
    !isOpen && isPageVisible && !prefersReducedMotion && !isUserInteracting &&
    motionState !== "chat_open" &&
    motionState !== "reduced_motion" &&
    motionState !== "scrolling" &&
    motionState !== "contextual_reposition"

  const isAttention = showWelcome && !prefersReducedMotion && !isScrolling

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setMessages(
          parsed.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        )
      }
    } catch (e) {
      console.error("Failed to load chat history:", e)
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, language }))
      } catch (e) {
        console.error("Failed to save chat history:", e)
      }
    }
  }, [messages, language])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          language,
        }),
      })

      const data = await response.json()

      // Check if the response indicates uncertainty (suggest contacting support)
      const uncertaintyPhrases = [
        "غير متأكد",
        "لست متأكد",
        "not sure",
        "don't know",
        "cannot find",
        "لا أستطيع",
        "تواصل مع",
        "contact",
        "واتساب",
        "whatsapp",
      ]
      const showFallback = uncertaintyPhrases.some((phrase) => data.reply?.toLowerCase().includes(phrase.toLowerCase()))

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.reply ||
          (language === "ar"
            ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
            : "Sorry, an error occurred. Please try again."),
        timestamp: new Date(),
        showFallback,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "ar"
            ? "عذراً، حدث خطأ في الاتصال. يرجى التواصل معنا مباشرة."
            : "Sorry, a connection error occurred. Please contact us directly.",
        timestamp: new Date(),
        showFallback: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = () => {
    setMessages([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  const texts = {
    ar: {
      title: "مساعد دافور لانس الذكي",
      placeholder: "اكتب رسالتك هنا...",
      send: "إرسال",
      whatsapp: "تواصل عبر واتساب",
      contact: "صفحة التواصل",
      clearHistory: "مسح المحادثة",
      greeting: "مرحباً! أنا المساعد الذكي لدافور لانس. كيف يمكنني مساعدتك اليوم؟",
    },
    en: {
      title: "DaforLance Smart Assistant",
      placeholder: "Type your message here...",
      send: "Send",
      whatsapp: "Contact via WhatsApp",
      contact: "Contact Page",
      clearHistory: "Clear Chat",
      greeting: "Hello! I'm the DaforLance smart assistant. How can I help you today?",
    },
  }

  const t = texts[language]

  // Add greeting message if no messages
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: t.greeting,
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length, t.greeting])

  return (
    <>
      {/* ── Motion-positioned mascot container ─────────────────────────────── */}
      <div
        ref={containerRef}
        className={`mascot-motion-container ${isRelocating ? "is-relocating" : ""}`}
        style={{
          transform: `translate(${targetPosition.x}px, ${targetPosition.y}px)`,
          opacity: hasMounted ? 1 : 0,
          transitionDuration: isRelocating ? `${relocationDuration}ms` : "0ms",
          width: mascotSize, height: mascotSize,
        }}
      >
        {/* Floating Robot Mascot Button */}
        <motion.button
          className="mascot-fab-button"
          whileHover={prefersReducedMotion ? {} : { scale: 1.08 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          onClick={toggleChat}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onFocus={handleInteractionStart}
          onBlur={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onTouchCancel={handleInteractionEnd}
          aria-expanded={isOpen}
          aria-controls="assistant-chat"
          aria-label={isOpen ? (language === "ar" ? "إغلاق المساعد" : "Close assistant") : (language === "ar" ? "فتح المساعد الذكي" : "Open smart assistant")}
        >
          <motion.div
          animate={
            isAttention
              ? {
                  y: -ATTENTION_LIFT_PX,
                  scale: ATTENTION_SCALE,
                }
              : shouldFloat
                ? {
                    y: [0, -IDLE_FLOAT_AMPLITUDE, 0],
                    rotate: [0, IDLE_TILT_DEGREES, 0, -IDLE_TILT_DEGREES, 0],
                  }
                : { y: 0, rotate: 0, scale: 1 }
          }
          transition={
            isAttention
              ? { duration: ATTENTION_DURATION_S, ease: "easeOut" }
              : shouldFloat && !prefersReducedMotion
                ? {
                    y: { duration: IDLE_FLOAT_DURATION, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    rotate: { duration: IDLE_FLOAT_DURATION * 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                  }
                : {}
          }
          >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#1f2b3b] to-[#3a4a5f] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-7 h-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="robot"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedMascot
                  animationEnabled={isPageVisible && !prefersReducedMotion}
                  size={mascotSize}
                  variant="display"
                  ariaLabel={language === "ar" ? "مساعد دافور لانس" : "DaforLance Assistant"}
                  className="mascot-float-icon"
                />
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>

        </motion.button>
        
        {/* Contextual Narration Bubble */}
        {activeMessage && (
          <MascotSpeechBubble
            message={activeMessage}
            visible={!!activeMessage && !isOpen && !isRelocating}
            isRTL={isRTL}
            isSpeaking={speechStatus === 'speaking'}
            isMuted={isMuted}
            speechStatus={speechStatus}
            speechError={speechError}
            onPlay={retryNarration}
            onMuteToggle={toggleMute}
            onDismiss={dismissBubble}
            targetPosition={targetPosition}
            mascotSize={mascotSize}
          />
        )}
        
        
        {/* Welcome Prompt moved outside of transformed container */}
        
        {/* Mute Toggle (Only shown when Guide is active and chat is closed) */}
        <AnimatePresence>
          {isGuidedMode && !isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={toggleMute}
              className={`absolute top-0 ${isRTL ? '-left-2' : '-right-2'} bg-white rounded-full p-1.5 shadow-md border border-gray-100 text-gray-500 hover:text-[#fe6a52] transition-colors z-10`}
              aria-label={isMuted ? (language === 'ar' ? 'تفعيل الصوت' : 'Unmute') : (language === 'ar' ? 'كتم الصوت' : 'Mute')}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Welcome Prompt (Moved outside transformed container for true fixed positioning) */}
      <WelcomePrompt
        isVisible={showWelcome && !isOpen}
        message={welcomeMessage}
        language={language}
        isRTL={isRTL}
        prefersReducedMotion={prefersReducedMotion}
        onAccept={acceptGuide}
        onDecline={dismissGuide}
        onPlay={retryWelcome}
        speechStatus={speechStatus}
        speechError={speechError}
        isMuted={isMuted}
        onMuteToggle={toggleMute}
      />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="assistant-chat" role="dialog" aria-label={t.title} dir={isRTL ? "rtl" : "ltr"}
            onKeyDown={event => { if (event.key === "Escape") { setIsOpen(false); containerRef.current?.querySelector("button")?.focus() } }}
            className={`fixed z-50 w-[calc(100%-2rem)] sm:w-[400px] max-h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6"
            }`}
            style={{ bottom: `max(env(safe-area-inset-bottom), ${mascotSize + 48}px)`, width: "min(400px, calc(100vw - 32px))", maxHeight: `calc(100dvh - ${mascotSize + 80}px)` }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1f2b3b] to-[#2d3e50] px-4 py-4 flex items-center justify-between">
              <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                  <AnimatedMascot
                    size={32}
                    variant="display"
                    animationEnabled={false}
                    ariaLabel={language === "ar" ? "مساعد دافور لانس" : "DaforLance Assistant"}
                  />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <h3 className="text-white font-semibold text-sm">{t.title}</h3>
                  <span className="text-white/60 text-xs">{language === "ar" ? "متصل الآن" : "Online"}</span>
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); startGuideCycle() }} className="text-white text-xs focus-visible:outline">{language === 'ar' ? 'إعادة الجولة' : 'Restart tour'}</button>
              <button onClick={clearHistory} className="text-white/60 hover:text-white text-xs transition-colors">
                {t.clearHistory}
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-[400px] bg-[#f9fafb]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === "user" ? (isRTL ? "justify-start" : "justify-end") : isRTL ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-[#fe6a52] text-white rounded-br-md"
                        : "bg-white text-[#1f2b3b] shadow-sm border border-gray-100 rounded-bl-md"
                    }`}
                  >
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isRTL ? "text-right" : "text-left"}`}>
                      {message.content}
                    </p>

                    {/* Fallback CTA buttons */}
                    {message.showFallback && message.role === "assistant" && (
                      <div className={`mt-3 flex flex-wrap gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25d366] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#20bd5a] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {t.whatsapp}
                        </a>
                        <a
                          href="#contact"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 bg-[#1f2b3b] text-white text-xs px-3 py-1.5 rounded-full hover:bg-[#2d3e50] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {t.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  className={`flex ${isRTL ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 rounded-bl-md">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <input
                  ref={inputRef}
                  type="text"
                  aria-label={t.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t.placeholder}
                  className={`flex-1 bg-[#f5f5f5] rounded-full px-4 py-3 text-sm text-[#1f2b3b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fe6a52]/30 transition-all ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  disabled={isLoading}
                />
                <motion.button
                  aria-label={t.send}
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-11 h-11 bg-[#fe6a52] rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
