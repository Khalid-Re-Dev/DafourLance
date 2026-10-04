// ═══════════════════════════════════════════════════════════════════════════════
// config/mascot-motion.ts — Centralized constants for the mascot motion system
//
// All timing, sizing, and positioning values live here.
// No magic numbers should be scattered across hooks or components.
// ═══════════════════════════════════════════════════════════════════════════════

import type {
  AnchorZone,
  AnchorDefinition,
  SectionId,
  SectionConfig,
  DeviceCategory,
} from "@/types/mascot"

// ── Timing Constants ─────────────────────────────────────────────────────────

/** Time the user must remain on the same section before contextual reposition (ms) */
export const DWELL_THRESHOLD_MS = 10_000

/** Debounce duration for scroll event detection (ms) */
export const SCROLL_DEBOUNCE_MS = 200

/** Duration of smooth relocation animation (ms) */
export const RELOCATION_DURATION_MS = 1_200

/** Delay before resuming motion after chatbot closes (ms) */
export const CHAT_CLOSE_RESUME_DELAY_MS = 2_000

/** How long interaction pause persists after the last interaction event (ms) */
export const INTERACTION_PAUSE_MS = 3_000

/**
 * Attention micro-motion interval range (ms).
 * A random value within this range is picked for each cycle.
 */
export const ATTENTION_INTERVAL_MIN_MS = 15_000
export const ATTENTION_INTERVAL_MAX_MS = 25_000

/**
 * Optional autonomous relocation minimum interval (ms).
 * This is a SECONDARY behavior — never fires merely because the timer elapsed.
 * Only considered when ALL higher-priority conditions are satisfied and the
 * current position is demonstrably not contextually appropriate.
 */
export const AUTONOMOUS_MIN_INTERVAL_MS = 45_000

/**
 * Minimum time between any two relocations to prevent restless movement (ms).
 */
export const RELOCATION_COOLDOWN_MS = 8_000

// ── Idle Animation Constants ─────────────────────────────────────────────────

/** Amplitude of the gentle vertical float in pixels */
export const IDLE_FLOAT_AMPLITUDE = 3

/** Duration of one full float cycle in seconds */
export const IDLE_FLOAT_DURATION = 7

/** Maximum rotation during idle tilt in degrees */
export const IDLE_TILT_DEGREES = 0.5

// ── Attention Micro-Motion Constants ─────────────────────────────────────────

/** Vertical lift for attention gesture in pixels */
export const ATTENTION_LIFT_PX = 6

/** Scale emphasis for attention gesture */
export const ATTENTION_SCALE = 1.06

/** Duration of the attention gesture animation in seconds */
export const ATTENTION_DURATION_S = 0.6

// ── Responsive Mascot Sizing ─────────────────────────────────────────────────

export const MASCOT_SIZE: Record<DeviceCategory, number> = {
  mobile: 72,
  tablet: 80,
  desktop: 88,
}

// ── Anchor Zone Definitions ──────────────────────────────────────────────────
// Positions are expressed as fractions of viewport width/height.
// The motion engine computes actual pixel positions from these.

export const ANCHOR_DEFINITIONS: Record<AnchorZone, AnchorDefinition> = {
  top_left: {
    xFraction: 0.04,
    yFraction: 0.12,
    safeMargin: 16,
    bubbleDirection: "right",
  },
  top_right: {
    xFraction: 0.96,
    yFraction: 0.12,
    safeMargin: 16,
    bubbleDirection: "left",
  },
  middle_left: {
    xFraction: 0.04,
    yFraction: 0.50,
    safeMargin: 16,
    bubbleDirection: "right",
  },
  middle_right: {
    xFraction: 0.96,
    yFraction: 0.50,
    safeMargin: 16,
    bubbleDirection: "left",
  },
  bottom_left: {
    xFraction: 0.04,
    yFraction: 0.96,
    safeMargin: 16,
    bubbleDirection: "right",
  },
  bottom_right: {
    xFraction: 0.96,
    yFraction: 0.96,
    safeMargin: 16,
    bubbleDirection: "left",
  },
}

// ── Section → Preferred Anchor Mapping ───────────────────────────────────────
// Each section defines its preferred anchor for LTR and RTL layouts,
// plus fallback anchors tried in order if the preferred one is unsafe.

export const SECTION_ANCHOR_CONFIG: Record<SectionId, SectionConfig> = {
  hero: {
    preferredAnchorLTR: "bottom_right",
    preferredAnchorRTL: "bottom_left",
    fallbackAnchors: ["middle_right", "middle_left", "bottom_left", "bottom_right"],
  },
  about: {
    preferredAnchorLTR: "middle_right",
    preferredAnchorRTL: "middle_left",
    fallbackAnchors: ["bottom_right", "bottom_left", "middle_left", "middle_right"],
  },
  services: {
    preferredAnchorLTR: "bottom_right",
    preferredAnchorRTL: "bottom_left",
    fallbackAnchors: ["middle_right", "middle_left", "bottom_left", "bottom_right"],
  },
  consultants: {
    preferredAnchorLTR: "middle_right",
    preferredAnchorRTL: "middle_left",
    fallbackAnchors: ["bottom_right", "bottom_left", "middle_left", "middle_right"],
  },
  projects: {
    preferredAnchorLTR: "bottom_right",
    preferredAnchorRTL: "bottom_left",
    fallbackAnchors: ["top_right", "top_left", "bottom_left", "bottom_right"],
  },
  partners: {
    preferredAnchorLTR: "middle_right",
    preferredAnchorRTL: "middle_left",
    fallbackAnchors: ["bottom_right", "bottom_left", "middle_left", "middle_right"],
  },
  contact: {
    // Contact has a form — prefer side zones that won't obstruct input fields
    preferredAnchorLTR: "middle_left",
    preferredAnchorRTL: "middle_right",
    fallbackAnchors: ["bottom_left", "bottom_right", "top_left", "top_right"],
  },
}

// ── Safe-Zone Collision Selectors ────────────────────────────────────────────
// Elements whose bounding rects should be checked before placing the mascot.
// The collision heuristic iterates these selectors and checks for overlap.

export const SAFE_ZONE_SELECTORS = [
  "header",
  "nav",
  ".mascot-fab-button",             // the mascot's own chatbot trigger area
  "#contact form",                   // contact form
  "[data-mascot-safe-zone='true']",  // opt-in safe-zone markers for future use
] as const

// ── Section IDs for IntersectionObserver ─────────────────────────────────────

export const OBSERVED_SECTION_IDS: SectionId[] = [
  "hero",
  "about",
  "services",
  "consultants",
  "projects",
  "partners",
  "contact",
]

// ── IntersectionObserver Config ──────────────────────────────────────────────

/** Minimum visibility ratio before a section can become "active" */
export const SECTION_MIN_VISIBILITY = 0.15

/** Threshold steps for fine-grained visibility tracking */
export const SECTION_OBSERVER_THRESHOLDS = Array.from(
  { length: 11 },
  (_, i) => i / 10,
) // [0, 0.1, 0.2, ..., 1.0]
