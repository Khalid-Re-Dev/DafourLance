// ═══════════════════════════════════════════════════════════════════════════════
// types/mascot.ts — Central type definitions for the mascot motion system
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Motion states — forms a state machine where priority determines which state
 * is active when multiple conditions are true simultaneously.
 *
 * Priority (highest → lowest):
 *   1. interaction_pause  — user hovering/focusing/touching
 *   2. chat_open          — chatbot is open
 *   3. reduced_motion     — prefers-reduced-motion active
 *   4. scrolling          — user actively scrolling
 *   5. section_settling   — scroll stopped, dwell timer running
 *   6. contextual_reposition — relocating to section-preferred anchor
 *   7. attention          — occasional micro-gesture
 *   8. gentle_presence    — subtle alive motion
 *   9. idle               — default resting state
 */
export type MascotMotionState =
  | "idle"
  | "gentle_presence"
  | "attention"
  | "scrolling"
  | "section_settling"
  | "contextual_reposition"
  | "interaction_pause"
  | "chat_open"
  | "reduced_motion"

/**
 * Semantic viewport anchor zones — NOT arbitrary coordinates.
 * Each zone maps to a computed viewport-relative position.
 */
export type AnchorZone =
  | "top_left"
  | "top_right"
  | "middle_left"
  | "middle_right"
  | "bottom_left"
  | "bottom_right"

/** Computed pixel position for the mascot within the viewport. */
export interface AnchorPosition {
  x: number
  y: number
}

/** Anchor zone definition with viewport-relative offsets and constraints. */
export interface AnchorDefinition {
  /** Horizontal offset as fraction of viewport width (0 = left, 1 = right) */
  xFraction: number
  /** Vertical offset as fraction of viewport height (0 = top, 1 = bottom) */
  yFraction: number
  /** Minimum safe margin from viewport edges in pixels */
  safeMargin: number
  /** Preferred speech-bubble direction for future use */
  bubbleDirection: "left" | "right" | "up" | "down"
}

/** Known landing-page section identifiers. */
export type SectionId =
  | "hero"
  | "about"
  | "services"
  | "consultants"
  | "projects"
  | "partners"
  | "contact"

/** Per-section positioning preferences. */
export interface SectionConfig {
  /** Preferred anchor zone for LTR layout */
  preferredAnchorLTR: AnchorZone
  /** Preferred anchor zone for RTL layout */
  preferredAnchorRTL: AnchorZone
  /** Fallback anchors in priority order if preferred is unsafe */
  fallbackAnchors: AnchorZone[]
}

/** Device size category for responsive behavior. */
export type DeviceCategory = "mobile" | "tablet" | "desktop"

/**
 * The complete output shape of useMascotMotion.
 * Designed for future extensibility (speech bubbles, guided mode, etc.)
 */
export interface MascotMotionOutput {
  /** Current resolved motion state */
  motionState: MascotMotionState
  /** Current semantic anchor zone */
  currentAnchor: AnchorZone
  /** Computed pixel position for the mascot */
  targetPosition: AnchorPosition
  /** Responsive mascot size in pixels */
  mascotSize: number
  /** Currently active page section (null if none detected) */
  activeSection: SectionId | null
  /** Whether a relocation animation is in progress */
  isRelocating: boolean
  /** Dynamic duration for the current/latest relocation in milliseconds */
  relocationDuration: number
  /** Whether the initial client-side position has been computed */
  hasMounted: boolean
  /** Handler: call on mouseenter/focus/touchstart */
  handleInteractionStart: () => void
  /** Handler: call on mouseleave/blur/touchend */
  handleInteractionEnd: () => void

  // ── Future-ready fields (always default values for now) ──────────────────
  /** Whether the mascot is currently speaking (future: TTS) */
  isSpeaking: false
  /** Whether a speech bubble is visible (future: narration) */
  isBubbleVisible: false
  /** Whether the mascot is in guided-tour mode (future: tour) */
  isGuidedMode: false
}
