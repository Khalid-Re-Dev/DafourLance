// ═══════════════════════════════════════════════════════════════════════════════
// hooks/use-device-category.ts — Categorizes viewport into device tiers
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react"
import type { DeviceCategory } from "@/types/mascot"

const MOBILE_MAX = 767
const TABLET_MAX = 1024

/**
 * Returns the current device category based on viewport width.
 * Uses matchMedia for efficient change detection (no resize polling).
 *
 * - `mobile`:  ≤ 767px
 * - `tablet`:  768–1024px
 * - `desktop`: > 1024px
 *
 * Standalone hook — no dependencies on the motion system.
 */
export function useDeviceCategory(): DeviceCategory {
  const [category, setCategory] = useState<DeviceCategory>("desktop")

  useEffect(() => {
    const mqlMobile = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`)
    const mqlTablet = window.matchMedia(
      `(min-width: ${MOBILE_MAX + 1}px) and (max-width: ${TABLET_MAX}px)`,
    )

    function resolve() {
      if (mqlMobile.matches) {
        setCategory("mobile")
      } else if (mqlTablet.matches) {
        setCategory("tablet")
      } else {
        setCategory("desktop")
      }
    }

    resolve()

    mqlMobile.addEventListener("change", resolve)
    mqlTablet.addEventListener("change", resolve)
    return () => {
      mqlMobile.removeEventListener("change", resolve)
      mqlTablet.removeEventListener("change", resolve)
    }
  }, [])

  return category
}
