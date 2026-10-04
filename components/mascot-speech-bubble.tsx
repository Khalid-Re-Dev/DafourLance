import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface MascotSpeechBubbleProps {
  message: string;
  visible: boolean;
  direction?: 'left' | 'right'; // Kept for backwards compatibility but ignored
  isRTL: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onMuteToggle?: () => void;
  onDismiss?: () => void;
  targetPosition?: { x: number, y: number };
  mascotSize?: number;
}

export function MascotSpeechBubble({
  message,
  visible,
  isRTL,
  isSpeaking,
  isMuted,
  onMuteToggle,
  onDismiss,
  targetPosition = { x: 0, y: 0 },
  mascotSize = 80
}: MascotSpeechBubbleProps) {
  const prefersReducedMotion = useReducedMotion();
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false)
  const [placement, setPlacement] = useState({ vertical: 'top', horizontal: 'left', x: 16, y: 16 })
  useEffect(() => { setMounted(true) }, [])
  useLayoutEffect(() => {
    if (!visible || !mounted) return
    const update = () => {
      const viewport = window.visualViewport
      const left = (viewport?.offsetLeft || 0) + 16
      const top = (viewport?.offsetTop || 0) + 16
      const right = left + (viewport?.width || window.innerWidth) - 32
      const bottom = top + (viewport?.height || window.innerHeight) - 32
      const width = bubbleRef.current?.offsetWidth || 280
      const height = bubbleRef.current?.offsetHeight || 140
      const above = targetPosition.y - height - 16
      const below = targetPosition.y + mascotSize + 16
      const vertical = above >= top ? 'top' : 'bottom'
      const x = Math.max(left, Math.min(isRTL ? targetPosition.x : targetPosition.x + mascotSize - width, right - width))
      const y = Math.max(top, Math.min(vertical === 'top' ? above : below, bottom - height))
      setPlacement({ vertical, horizontal: isRTL ? 'left' : 'right', x, y })
    }
    update()
    const observer = new ResizeObserver(update)
    if (bubbleRef.current) observer.observe(bubbleRef.current)
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    return () => { observer.disconnect(); window.removeEventListener('resize', update); window.visualViewport?.removeEventListener('resize', update) }
  }, [visible, mounted, message, targetPosition.x, targetPosition.y, isRTL, mascotSize])

  // Animations
  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: placement.vertical === 'top' ? 10 : -10,
      transformOrigin: `${placement.vertical === 'top' ? 'bottom' : 'top'} ${placement.horizontal === 'right' ? 'right' : 'left'}`
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.2, ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: placement.vertical === 'top' ? 10 : -10,
      transition: { duration: 0.2 }
    }
  };

  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const variants = prefersReducedMotion ? reducedMotionVariants : bubbleVariants;

  if (!mounted) return null
  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={bubbleRef}
          className="fixed z-50 w-[280px] max-w-[calc(100vw-32px)]"
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ left: placement.x, top: placement.y, maxHeight: 'calc(100dvh - 32px)', overflowY: 'auto' }}
          variants={variants as any}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="status"
          aria-live="polite"
        >
          {/* Bubble Container */}
          <div className="relative bg-[#1f2b3b] text-white rounded-2xl p-4 shadow-xl border border-[#2d3e50]">
            
            {/* Header / Controls */}
            <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Speaking Indicator */}
              <div className="flex items-center h-5">
                {isSpeaking && !isMuted && (
                  <div className="flex gap-1 items-center">
                    <motion.div className="w-1 h-3 bg-[#fe6a52] rounded-full" animate={prefersReducedMotion ? {} : { scaleY: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                    <motion.div className="w-1 h-2 bg-[#fe6a52] rounded-full" animate={prefersReducedMotion ? {} : { scaleY: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} />
                    <motion.div className="w-1 h-4 bg-[#fe6a52] rounded-full" animate={prefersReducedMotion ? {} : { scaleY: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} />
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 text-gray-400">
                {onMuteToggle && (
                  <button 
                    onClick={onMuteToggle}
                    className="min-h-8 min-w-8 flex items-center justify-center hover:text-white transition-colors"
                    aria-label={isMuted ? (isRTL ? 'تفعيل الصوت' : 'Unmute') : (isRTL ? 'كتم الصوت' : 'Mute')}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}
                {onDismiss && (
                  <button 
                    onClick={onDismiss}
                    className="min-h-8 min-w-8 flex items-center justify-center hover:text-white transition-colors"
                    aria-label={isRTL ? 'إغلاق' : 'Close'}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Message Text */}
            <p className={`text-sm leading-relaxed font-cairo ${isRTL ? 'text-right' : 'text-left'}`}>
              {message}
            </p>

            {/* Pointer / Arrow */}
            <div 
              className={`absolute w-3 h-3 bg-[#1f2b3b] border-[#2d3e50] transform rotate-45 ${
                placement.vertical === 'top' ? 'bottom-[-6px] border-b border-r' : 'top-[-6px] border-t border-l'
              } ${
                placement.horizontal === 'right' ? 'right-6' : 'left-6'
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>, document.body
  );
}
