"use client"
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
const SmartAssistant = dynamic(() => import('./smart-assistant'), { ssr: false })
export default function DeferredAssistant() {
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const publicPage = pathname === '/ar' || pathname === '/en'
  useEffect(() => {
    if (!publicPage) return
    let idle: number | undefined
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setReady(true), { timeout: 1200 })
      else setReady(true)
    }, Math.max(0, 3000 - performance.now()))
    return () => { clearTimeout(timer); if (idle !== undefined) window.cancelIdleCallback(idle) }
  }, [publicPage])
  return publicPage && ready ? <SmartAssistant /> : null
}
