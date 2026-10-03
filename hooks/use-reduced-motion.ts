// ═══════════════════════════════════════════════════════════════════════════════
// hooks/use-reduced-motion.ts — Detects prefers-reduced-motion preference
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react"

/**
 * Watches the `prefers-reduced-motion: reduce` media query.
 * Returns `true` when the user/OS has requested reduced motion.
 *
 * Standalone hook — no dependencies on the motion system.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mql.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return prefersReduced
}
