import { useEffect, useState } from 'react'
import type { SectionId } from '@/types/mascot'
import { OBSERVED_SECTION_IDS, SCROLL_DEBOUNCE_MS } from '@/config/mascot-motion'

/** One passive scroll subscription. Read geometry only after scrolling settles. */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const measure = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight
      let best: SectionId | null = null
      let score = 0
      for (const id of OBSERVED_SECTION_IDS) {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        if (!rect) continue
        const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 80))
        if (visible > score) { score = visible; best = id }
      }
      setActiveSection(best)
      setIsScrolling(false)
    }
    const onScroll = () => {
      setIsScrolling(true)
      clearTimeout(timer)
      timer = setTimeout(measure, SCROLL_DEBOUNCE_MS)
    }
    const visibility = () => { setIsPageVisible(!document.hidden); if (!document.hidden) measure() }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])
  return { activeSection, isScrolling, isPageVisible }
}
