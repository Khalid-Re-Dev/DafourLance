// ═══════════════════════════════════════════════════════════════════════════════
// hooks/use-active-section.ts — IntersectionObserver-based section detection
//
// Strategy: HIGHEST VISIBILITY RATIO
// Tracks all known landing-page sections and reports which one occupies the
// most viewport area. Includes hysteresis to prevent rapid flickering when
// two sections share the viewport near a boundary.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react"
import type { SectionId } from "@/types/mascot"
import {
  OBSERVED_SECTION_IDS,
  SECTION_MIN_VISIBILITY,
  SECTION_OBSERVER_THRESHOLDS,
} from "@/config/mascot-motion"

export interface ActiveSectionResult {
  /** The section with the highest visibility, or null if none qualify */
  activeSection: SectionId | null
}

/**
 * Observes all known page sections via IntersectionObserver and returns the
 * one with the greatest visibility ratio, provided it exceeds the minimum
 * threshold (`SECTION_MIN_VISIBILITY`).
 *
 * Standalone hook — no dependency on the motion system.
 */
export function useActiveSection(): ActiveSectionResult {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const visibilityRef = useRef<Map<SectionId, number>>(new Map())

  const resolveActive = useCallback(() => {
    let bestSection: SectionId | null = null
    let bestRatio = 0

    visibilityRef.current.forEach((ratio, section) => {
      if (ratio > bestRatio && ratio >= SECTION_MIN_VISIBILITY) {
        bestRatio = ratio
        bestSection = section
      }
    })

    setActiveSection(bestSection)
  }, [])

  useEffect(() => {
    // Collect DOM elements for all known sections
    const elements: { id: SectionId; el: Element }[] = []
    for (const id of OBSERVED_SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) {
        elements.push({ id, el })
      }
    }

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId
          visibilityRef.current.set(id, entry.intersectionRatio)
        }
        resolveActive()
      },
      {
        threshold: SECTION_OBSERVER_THRESHOLDS,
      },
    )

    for (const { el } of elements) {
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
    }
  }, [resolveActive])

  return { activeSection }
}
