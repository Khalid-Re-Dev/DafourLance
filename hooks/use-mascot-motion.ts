import { useCallback, useEffect, useRef, useState } from 'react'
import { useDeviceCategory } from './use-device-category'
import { useReducedMotion } from './use-reduced-motion'
import { ANCHOR_DEFINITIONS, SECTION_ANCHOR_CONFIG, MASCOT_SIZE } from '@/config/mascot-motion'
import type { AnchorZone, AnchorPosition, SectionId } from '@/types/mascot'

function protectedRects() {
  return Array.from(document.querySelectorAll('header, nav, main a, main button, main input, main textarea, main select, [data-mascot-safe-zone]'))
    .map(el => el.getBoundingClientRect()).filter(r => r.width && r.height && r.bottom > 0 && r.top < window.innerHeight)
}
function isSafe(position: AnchorPosition, size: number, obstacles: DOMRect[]) {
  return !obstacles.some(r => position.x < r.right + 8 && position.x + size > r.left - 8 && position.y < r.bottom + 8 && position.y + size > r.top - 8)
}

export function useMascotMotion({ isChatOpen, isRTL, isScrolling, isPageVisible }: {
  isChatOpen: boolean; isRTL: boolean; isScrolling: boolean; isPageVisible: boolean
}) {
  const device = useDeviceCategory()
  const reduced = useReducedMotion()
  const mascotSize = MASCOT_SIZE[device]
  const containerRef = useRef<HTMLDivElement>(null)
  const current = useRef<AnchorPosition>({ x: 0, y: 0 })
  const [targetPosition, setTargetPosition] = useState(current.current)
  const [isRelocating, setRelocating] = useState(false)
  const [relocationDuration, setDuration] = useState(0)
  const [hasMounted, setMounted] = useState(false)
  const [isUserInteracting, setInteracting] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const clamp = useCallback((position: AnchorPosition) => {
    const viewport = window.visualViewport
    const left = viewport?.offsetLeft ?? 0
    const top = viewport?.offsetTop ?? 0
    const width = viewport?.width ?? window.innerWidth
    const height = viewport?.height ?? window.innerHeight
    return { x: Math.max(left + 16, Math.min(position.x, left + width - mascotSize - 16)),
      y: Math.max(top + 24, Math.min(position.y, top + height - mascotSize - 32)) }
  }, [mascotSize])
  const anchorPosition = useCallback((anchor: AnchorZone) => {
    const def = ANCHOR_DEFINITIONS[anchor]
    return clamp({ x: def.xFraction * window.innerWidth - mascotSize / 2,
      y: def.yFraction * (window.visualViewport?.height ?? window.innerHeight) - mascotSize / 2 })
  }, [clamp, mascotSize])
  const setPosition = useCallback((position: AnchorPosition) => {
    current.current = position
    setTargetPosition(position)
  }, [])
  const stop = useCallback(() => {
    clearTimeout(timer.current)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) setPosition(clamp({ x: rect.left, y: rect.top }))
    setRelocating(false)
  }, [clamp, setPosition])
  const safePresence = useCallback((preferred: AnchorPosition) => {
    const obstacles = protectedRects()
    const candidates = [preferred, ...(['bottom_left', 'bottom_right', 'middle_left', 'middle_right'] as AnchorZone[]).map(anchorPosition)]
    return candidates.find(position => isSafe(position, mascotSize, obstacles)) || preferred
  }, [anchorPosition, mascotSize])
  useEffect(() => {
    setPosition(safePresence(anchorPosition(isRTL ? 'bottom_left' : 'bottom_right')))
    setMounted(true)
    setRelocating(false)
    clearTimeout(timer.current)
  }, [isRTL, anchorPosition, safePresence, setPosition])
  useEffect(() => {
    if (isChatOpen) {
      stop()
      setPosition(anchorPosition(isRTL ? 'bottom_left' : 'bottom_right'))
    } else if (isScrolling || isUserInteracting || reduced || !isPageVisible) stop()
  }, [isChatOpen, isScrolling, isUserInteracting, reduced, isPageVisible, stop, setPosition, anchorPosition, isRTL])
  useEffect(() => {
    const resize = () => { clearTimeout(timer.current); setRelocating(false); setPosition(safePresence(clamp(current.current))) }
    window.addEventListener('resize', resize, { passive: true })
    window.visualViewport?.addEventListener('resize', resize)
    return () => { clearTimeout(timer.current); window.removeEventListener('resize', resize); window.visualViewport?.removeEventListener('resize', resize) }
  }, [clamp, safePresence, setPosition])
  const relocate = useCallback((section: SectionId) => {
    if (isChatOpen || isScrolling || isUserInteracting || reduced || !isPageVisible) return 0
    const config = SECTION_ANCHOR_CONFIG[section]
    const preferred = isRTL ? config.preferredAnchorRTL : config.preferredAnchorLTR
    // Read all protected rectangles once per dwell, never once per frame.
    const obstacles = protectedRects()
    const candidates = [preferred, ...config.fallbackAnchors].map(anchorPosition)
    const next = candidates.find(position => isSafe(position, mascotSize, obstacles))
    // No safe destination: keep the current anchor; never knowingly select an unsafe preferred one.
    if (!next || Math.hypot(next.x - current.current.x, next.y - current.current.y) < 24) return 0
    const distance = Math.hypot(next.x - current.current.x, next.y - current.current.y)
    const duration = Math.round(Math.min(900, Math.max(500, 450 + distance * 0.45)))
    setDuration(duration)
    setRelocating(true)
    setPosition(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setRelocating(false), duration)
    return duration
  }, [isChatOpen, isScrolling, isUserInteracting, reduced, isPageVisible, isRTL, anchorPosition, mascotSize, setPosition])
  const handleInteractionStart = useCallback(() => setInteracting(true), [])
  const handleInteractionEnd = useCallback(() => setInteracting(false), [])
  const motionState = isChatOpen ? 'chat_open' : reduced ? 'reduced_motion' : isScrolling ? 'scrolling' : isUserInteracting ? 'interaction_pause' : isRelocating ? 'contextual_reposition' : 'gentle_presence'
  return { containerRef, motionState, targetPosition, mascotSize, isRelocating, relocationDuration,
    hasMounted, handleInteractionStart, handleInteractionEnd, isUserInteracting, relocate }
}
