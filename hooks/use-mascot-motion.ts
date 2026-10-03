// ═══════════════════════════════════════════════════════════════════════════════
// hooks/use-mascot-motion.ts — Core mascot motion engine
//
// A pure hook with explicit parameters. No provider dependency.
// Independently testable by supplying mock values for isChatOpen and isRTL.
//
// Consumes standalone hooks internally:
//   - useActiveSection  (section detection)
//   - useReducedMotion  (accessibility)
//   - useDeviceCategory (responsive sizing)
//
// Priority hierarchy (highest → lowest):
//   1. User interaction    → interaction_pause
//   2. Chat open           → chat_open
//   3. Reduced motion      → reduced_motion
//   4. Scrolling           → scrolling
//   5. Section settling    → section_settling
//   6. Contextual reposition → contextual_reposition
//   7. Attention gesture   → attention
//   8. Gentle presence     → gentle_presence
//   9. Default             → idle
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react"
import type {
  MascotMotionState,
  MascotMotionOutput,
  AnchorZone,
  AnchorPosition,
  SectionId,
} from "@/types/mascot"
import {
  DWELL_THRESHOLD_MS,
  SCROLL_DEBOUNCE_MS,
  RELOCATION_DURATION_MS,
  CHAT_CLOSE_RESUME_DELAY_MS,
  INTERACTION_PAUSE_MS,
  ATTENTION_INTERVAL_MIN_MS,
  ATTENTION_INTERVAL_MAX_MS,
  RELOCATION_COOLDOWN_MS,
  MASCOT_SIZE,
  ANCHOR_DEFINITIONS,
  SECTION_ANCHOR_CONFIG,
  SAFE_ZONE_SELECTORS,
} from "@/config/mascot-motion"
import { useActiveSection } from "@/hooks/use-active-section"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useDeviceCategory } from "@/hooks/use-device-category"

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Compute pixel position from an anchor definition and current viewport. */
function computeAnchorPosition(
  anchor: AnchorZone,
  mascotSize: number,
): AnchorPosition {
  const def = ANCHOR_DEFINITIONS[anchor]
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024
  const vh = typeof window !== "undefined" ? window.innerHeight : 768

  // Position is the top-left corner of the mascot bounding box
  let x = def.xFraction * vw - mascotSize / 2
  let y = def.yFraction * vh - mascotSize / 2

  // Clamp to safe margins
  x = Math.max(def.safeMargin, Math.min(x, vw - mascotSize - def.safeMargin))
  y = Math.max(def.safeMargin, Math.min(y, vh - mascotSize - def.safeMargin))

  return { x, y }
}

/** Check whether a proposed mascot rect overlaps any safe-zone elements. */
function checkSafeZoneCollision(
  position: AnchorPosition,
  mascotSize: number,
): boolean {
  if (typeof document === "undefined") return false

  const mascotRect = {
    left: position.x,
    top: position.y,
    right: position.x + mascotSize,
    bottom: position.y + mascotSize,
  }

  for (const selector of SAFE_ZONE_SELECTORS) {
    const els = document.querySelectorAll(selector)
    for (const el of els) {
      const rect = el.getBoundingClientRect()
      // Check AABB overlap
      if (
        mascotRect.left < rect.right &&
        mascotRect.right > rect.left &&
        mascotRect.top < rect.bottom &&
        mascotRect.bottom > rect.top
      ) {
        return true // collision detected
      }
    }
  }

  return false
}

/**
 * Select the best anchor for a given section and direction.
 * Tries the preferred anchor first, then fallbacks, skipping any that collide
 * with safe-zone elements.
 */
function selectBestAnchor(
  section: SectionId | null,
  isRTL: boolean,
  mascotSize: number,
  defaultAnchor: AnchorZone,
): { anchor: AnchorZone; position: AnchorPosition } {
  if (!section) {
    const pos = computeAnchorPosition(defaultAnchor, mascotSize)
    return { anchor: defaultAnchor, position: pos }
  }

  const config = SECTION_ANCHOR_CONFIG[section]
  const preferred = isRTL ? config.preferredAnchorRTL : config.preferredAnchorLTR

  // Try preferred first
  const preferredPos = computeAnchorPosition(preferred, mascotSize)
  if (!checkSafeZoneCollision(preferredPos, mascotSize)) {
    return { anchor: preferred, position: preferredPos }
  }

  // Try fallbacks in order
  for (const fallback of config.fallbackAnchors) {
    const pos = computeAnchorPosition(fallback, mascotSize)
    if (!checkSafeZoneCollision(pos, mascotSize)) {
      return { anchor: fallback, position: pos }
    }
  }

  // All collide — use preferred anyway (better than nothing)
  return { anchor: preferred, position: preferredPos }
}

/** Random integer in [min, max] */
function randomInRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/** Distance between two positions */
function positionDistance(a: AnchorPosition, b: AnchorPosition): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

// ── Main Hook ────────────────────────────────────────────────────────────────

interface UseMascotMotionParams {
  /** Whether the chatbot popup is open */
  isChatOpen: boolean
  /** Whether the current layout direction is RTL */
  isRTL: boolean
}

export function useMascotMotion({
  isChatOpen,
  isRTL,
}: UseMascotMotionParams): MascotMotionOutput {
  // ── Internal hooks ───────────────────────────────────────────────────────
  const { activeSection } = useActiveSection()
  const prefersReducedMotion = useReducedMotion()
  const deviceCategory = useDeviceCategory()

  const mascotSize = MASCOT_SIZE[deviceCategory]
  const defaultAnchor: AnchorZone = isRTL ? "bottom_left" : "bottom_right"

  // ── State ────────────────────────────────────────────────────────────────
  const [currentAnchor, setCurrentAnchor] = useState<AnchorZone>(defaultAnchor)
  // Initialize with a stable value for SSR — real position computed on mount
  const [targetPosition, setTargetPosition] = useState<AnchorPosition>({ x: 0, y: 0 })
  const [hasMounted, setHasMounted] = useState(false)
  const [isRelocating, setIsRelocating] = useState(false)
  const [relocationDuration, setRelocationDuration] = useState(RELOCATION_DURATION_MS)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [showAttention, setShowAttention] = useState(false)

  // ── Refs (timers, last values, flags) ────────────────────────────────────
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const attentionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const relocationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chatResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastRelocationTimeRef = useRef(0)
  const settledSectionRef = useRef<SectionId | null>(null)
  const wasChatOpenRef = useRef(false)

  // ── Compute real position on mount (avoids SSR hydration mismatch) ──────
  useEffect(() => {
    setTargetPosition(computeAnchorPosition(defaultAnchor, mascotSize))
    setHasMounted(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup helper ───────────────────────────────────────────────────────
  const clearTimer = useCallback(
    (ref: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
      if (ref.current !== null) {
        clearTimeout(ref.current)
        ref.current = null
      }
    },
    [],
  )

  // ── Relocation logic ─────────────────────────────────────────────────────
  const performRelocation = useCallback(
    (section: SectionId | null) => {
      const now = Date.now()
      if (now - lastRelocationTimeRef.current < RELOCATION_COOLDOWN_MS) return
      if (isChatOpen || prefersReducedMotion || isUserInteracting) return

      const { anchor, position } = selectBestAnchor(
        section,
        isRTL,
        mascotSize,
        defaultAnchor,
      )

      // Skip if already at a suitable position (within 20px threshold)
      const currentPos = computeAnchorPosition(currentAnchor, mascotSize)
      if (
        anchor === currentAnchor &&
        positionDistance(currentPos, position) < 20
      ) {
        return
      }

      // Calculate dynamic duration based on distance
      const distance = positionDistance(currentPos, position)
      // Base duration 800ms + 1ms per pixel, clamped between 800ms and 2000ms
      const dynamicDurationMs = Math.max(800, Math.min(2000, 800 + distance * 1))

      setIsRelocating(true)
      setCurrentAnchor(anchor)
      setTargetPosition(position)
      setRelocationDuration(dynamicDurationMs)
      lastRelocationTimeRef.current = now

      // Mark relocation complete after animation duration
      clearTimer(relocationTimerRef)
      relocationTimerRef.current = setTimeout(() => {
        setIsRelocating(false)
      }, dynamicDurationMs)
    },
    [
      isChatOpen,
      prefersReducedMotion,
      isUserInteracting,
      isRTL,
      mascotSize,
      defaultAnchor,
      currentAnchor,
      clearTimer,
    ],
  )

  // ── Scroll detection ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)

      // Cancel pending dwell timer on new scroll
      clearTimer(dwellTimerRef)
      settledSectionRef.current = null

      // Reset scroll flag after debounce
      clearTimer(scrollTimerRef)
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, SCROLL_DEBOUNCE_MS)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimer(scrollTimerRef)
    }
  }, [clearTimer])

  // ── Dwell timer: starts when scroll stops and section is stable ────────
  useEffect(() => {
    // Don't start dwell if scrolling, chat open, reduced motion, or interacting
    if (isScrolling || isChatOpen || prefersReducedMotion || isUserInteracting) {
      clearTimer(dwellTimerRef)
      settledSectionRef.current = null
      return
    }

    if (!activeSection) {
      clearTimer(dwellTimerRef)
      settledSectionRef.current = null
      return
    }

    // Section changed — restart dwell
    if (activeSection !== settledSectionRef.current) {
      clearTimer(dwellTimerRef)
      settledSectionRef.current = activeSection

      dwellTimerRef.current = setTimeout(() => {
        // Validate: section must still be active when timer fires
        if (settledSectionRef.current === activeSection) {
          performRelocation(activeSection)
        }
      }, DWELL_THRESHOLD_MS)
    }

    return () => {
      clearTimer(dwellTimerRef)
    }
  }, [
    activeSection,
    isScrolling,
    isChatOpen,
    prefersReducedMotion,
    isUserInteracting,
    performRelocation,
    clearTimer,
  ])

  // ── Chat state management ────────────────────────────────────────────────
  useEffect(() => {
    if (isChatOpen) {
      // Kill ALL autonomous timers
      clearTimer(dwellTimerRef)
      clearTimer(attentionTimerRef)
      clearTimer(chatResumeTimerRef)
      settledSectionRef.current = null
      wasChatOpenRef.current = true
    } else if (wasChatOpenRef.current) {
      // Chat just closed — resume after delay
      wasChatOpenRef.current = false
      chatResumeTimerRef.current = setTimeout(() => {
        // Don't do anything aggressive — just allow normal behavior to resume
        // The dwell timer effect will naturally restart on the next section change
      }, CHAT_CLOSE_RESUME_DELAY_MS)
    }

    return () => {
      clearTimer(chatResumeTimerRef)
    }
  }, [isChatOpen, clearTimer])

  // ── Attention micro-motion (occasional subtle gesture) ─────────────────
  useEffect(() => {
    if (isChatOpen || prefersReducedMotion || isUserInteracting || isScrolling) {
      clearTimer(attentionTimerRef)
      setShowAttention(false)
      return
    }

    const scheduleAttention = () => {
      const delay = randomInRange(
        ATTENTION_INTERVAL_MIN_MS,
        ATTENTION_INTERVAL_MAX_MS,
      )
      attentionTimerRef.current = setTimeout(() => {
        // Only show attention if conditions are still met
        if (!isChatOpen && !isUserInteracting && !isScrolling) {
          setShowAttention(true)
          // Reset after the gesture completes
          setTimeout(() => setShowAttention(false), 800)
        }
        scheduleAttention()
      }, delay)
    }

    scheduleAttention()

    return () => {
      clearTimer(attentionTimerRef)
    }
    // Intentionally depend on state flags to restart cycle when conditions change
  }, [isChatOpen, prefersReducedMotion, isUserInteracting, isScrolling, clearTimer])

  // ── Update position on viewport resize ─────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const newPos = computeAnchorPosition(currentAnchor, mascotSize)
      setTargetPosition(newPos)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [currentAnchor, mascotSize])

  // ── Update default position when direction changes ─────────────────────
  useEffect(() => {
    const newDefault = isRTL ? "bottom_left" : "bottom_right"
    // Only recompute if we're at the default anchor (avoid overriding contextual)
    if (currentAnchor === "bottom_left" || currentAnchor === "bottom_right") {
      setCurrentAnchor(newDefault)
      setTargetPosition(computeAnchorPosition(newDefault, mascotSize))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL])

  // ── Interaction handlers ─────────────────────────────────────────────────
  const handleInteractionStart = useCallback(() => {
    setIsUserInteracting(true)
    clearTimer(interactionTimerRef)
  }, [clearTimer])

  const handleInteractionEnd = useCallback(() => {
    clearTimer(interactionTimerRef)
    interactionTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false)
    }, INTERACTION_PAUSE_MS)
  }, [clearTimer])

  // ── Cleanup all timers on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimer(dwellTimerRef)
      clearTimer(scrollTimerRef)
      clearTimer(interactionTimerRef)
      clearTimer(attentionTimerRef)
      clearTimer(relocationTimerRef)
      clearTimer(chatResumeTimerRef)
    }
  }, [clearTimer])

  // ── Resolve motion state via priority hierarchy ──────────────────────────
  const resolveMotionState = (): MascotMotionState => {
    // Priority 1: User interaction
    if (isUserInteracting && !isChatOpen) return "interaction_pause"
    // Priority 2: Chat open
    if (isChatOpen) return "chat_open"
    // Priority 3: Reduced motion
    if (prefersReducedMotion) return "reduced_motion"
    // Priority 4: Active scrolling
    if (isScrolling) return "scrolling"
    // Priority 5: Dwell timer running
    if (settledSectionRef.current && dwellTimerRef.current !== null) return "section_settling"
    // Priority 6: Relocating
    if (isRelocating) return "contextual_reposition"
    // Priority 7: Attention gesture
    if (showAttention) return "attention"
    // Priority 8/9: Idle presence
    return "gentle_presence"
  }

  return {
    motionState: resolveMotionState(),
    currentAnchor,
    targetPosition,
    mascotSize,
    activeSection,
    isRelocating,
    relocationDuration,
    hasMounted,
    handleInteractionStart,
    handleInteractionEnd,
    // Future-ready
    isSpeaking: false as const,
    isBubbleVisible: false as const,
    isGuidedMode: false as const,
  }
}
