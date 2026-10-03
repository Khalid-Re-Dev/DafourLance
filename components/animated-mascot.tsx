"use client"

import { useState, useRef, useEffect, useCallback } from "react"

/**
 * AnimatedMascot — Reusable animated robot mascot component.
 *
 * Renders a transparent WebM video of the robot mascot with:
 * - Graceful fallback hierarchy: WebM → poster PNG → inline SVG
 * - prefers-reduced-motion support (shows static poster)
 * - Keyboard accessible with visible focus state
 * - RTL/LTR agnostic
 * - No chatbot business logic — purely visual
 *
 * @example
 *   <AnimatedMascot size={64} onClick={toggle} ariaLabel="Open assistant" />
 */

// ── Asset paths (served from /public/mascot/) ─────────────────────────────────
const MASCOT_WEBM = "/mascot/robot-mascot.webm"
const MASCOT_POSTER = "/mascot/robot-mascot-poster.png"

// ── Inline SVG fallback (matches the original RobotIcon) ──────────────────────
function FallbackRobotSVG({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      aria-hidden="true"
    >
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

// ── Props ─────────────────────────────────────────────────────────────────────
export interface AnimatedMascotProps {
  /** Displayed size in pixels (controls CSS width; height is auto) */
  size?: number
  /** Click handler — when provided, the mascot becomes interactive */
  onClick?: () => void
  /** Accessible label for the mascot button */
  ariaLabel?: string
  /** Extra CSS classes for the outer container */
  className?: string
  /** Whether the animation should play (default: true) */
  animationEnabled?: boolean
  /** Whether the mascot is in "active" state (e.g. chat is open) */
  isActive?: boolean
  /** Render variant: "button" (floating FAB) or "display" (static, e.g. in chat header) */
  variant?: "button" | "display"
}

export default function AnimatedMascot({
  size = 64,
  onClick,
  ariaLabel = "Smart Assistant",
  className = "",
  animationEnabled = true,
  isActive = false,
  variant = "button",
}: AnimatedMascotProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [assetState, setAssetState] = useState<"video" | "poster" | "svg">("video")
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)

  // ── Detect reduced-motion preference ──────────────────────────────────────
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  // ── Determine if we should show the video or a static fallback ────────────
  const showVideo = assetState === "video" && animationEnabled && !prefersReducedMotion

  // ── Control video playback based on animation state ───────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked or unsupported — fall back to poster
        setAssetState((prev) => (prev === "video" ? "poster" : prev))
      })
    }
  }, [showVideo])

  // ── Video error handler: cascade to poster, then SVG ──────────────────────
  const handleVideoError = useCallback(() => {
    setAssetState((prev) => (prev === "video" ? "poster" : prev))
  }, [])

  const handlePosterError = useCallback(() => {
    setAssetState((prev) => (prev !== "svg" ? "svg" : prev))
  }, [])

  const handleVideoReady = useCallback(() => {
    setIsVideoReady(true)
  }, [])

  // ── Defensive Timeout ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!showVideo || isVideoReady) return

    // If video hasn't become ready within timeout, force fallback to prevent hanging blank states
    const timer = setTimeout(() => {
      setAssetState((prev) => (prev === "video" ? "poster" : prev))
    }, 3000)

    return () => clearTimeout(timer)
  }, [showVideo, isVideoReady])

  // ── Shared styles ─────────────────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  }

  // ── Render the visual content ─────────────────────────────────────────────
  const renderContent = () => {
    if (assetState === "svg") {
      return <FallbackRobotSVG size={Math.round(size * 0.75)} />
    }

    if (assetState === "poster" || !showVideo) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={MASCOT_POSTER}
          alt=""
          aria-hidden="true"
          onError={handlePosterError}
          className="mascot-media"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            pointerEvents: "none",
          }}
          draggable={false}
        />
      )
    }

    return (
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        poster={MASCOT_POSTER}
        onError={handleVideoError}
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        aria-hidden="true"
        className="mascot-media"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      >
        <source 
          src={MASCOT_WEBM} 
          type='video/webm; codecs="vp9"' 
          onError={handleVideoError} 
        />
      </video>
    )
  }

  // ── "display" variant: no interactivity, just visual ──────────────────────
  if (variant === "display") {
    return (
      <div
        className={`mascot-container mascot-display ${className}`}
        style={containerStyle}
        role="img"
        aria-label={ariaLabel}
      >
        {renderContent()}
      </div>
    )
  }

  // ── "button" variant: interactive, focusable ──────────────────────────────
  return (
    <div
      className={`mascot-container mascot-button ${isActive ? "mascot-active" : ""} ${className}`}
      style={containerStyle}
      role="presentation"
    >
      {renderContent()}
    </div>
  )
}
