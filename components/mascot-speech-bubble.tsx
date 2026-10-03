import React, { useEffect, useState, useRef } from 'react';
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
  const [placement, setPlacement] = useState({ vertical: 'top', horizontal: isRTL ? 'left' : 'right' });

  useEffect(() => {
    if (!visible) return;
    
    const updatePlacement = () => {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1000;
      
      const el = bubbleRef.current;
      const bubbleW = el ? el.offsetWidth : (vw < 640 ? 240 : 280);
      const bubbleH = el ? el.offsetHeight : 120;
      
      let horiz = isRTL ? 'left' : 'right';
      let vert = 'top';
      
      if (horiz === 'right') {
        if (targetPosition.x + mascotSize - bubbleW < 10) horiz = 'left';
      } else {
        if (targetPosition.x + bubbleW > vw - 10) horiz = 'right';
      }
      
      if (targetPosition.y - bubbleH - 20 < 10) vert = 'bottom';
      
      setPlacement({ vertical: vert, horizontal: horiz });
    };

    updatePlacement();
    const timer = setTimeout(updatePlacement, 50);
    return () => clearTimeout(timer);
  }, [visible, message, targetPosition.x, targetPosition.y, isRTL, mascotSize]);

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
        type: 'spring',
        stiffness: 260,
        damping: 20
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={bubbleRef}
          className={`absolute z-40 w-[240px] sm:w-[280px] ${
            placement.vertical === 'top' ? 'bottom-full mb-4' : 'top-full mt-4'
          } ${
            placement.horizontal === 'right' ? 'right-0' : 'left-0'
          } max-w-[calc(100vw-32px)]`}
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
                    <motion.div className="w-1 h-3 bg-[#fe6a52] rounded-full" animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} />
                    <motion.div className="w-1 h-2 bg-[#fe6a52] rounded-full" animate={{ height: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} />
                    <motion.div className="w-1 h-4 bg-[#fe6a52] rounded-full" animate={{ height: [16, 8, 16] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} />
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 text-gray-400">
                {onMuteToggle && (
                  <button 
                    onClick={onMuteToggle}
                    className="hover:text-white transition-colors"
                    aria-label={isMuted ? (isRTL ? 'تفعيل الصوت' : 'Unmute') : (isRTL ? 'كتم الصوت' : 'Mute')}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}
                {onDismiss && (
                  <button 
                    onClick={onDismiss}
                    className="hover:text-white transition-colors"
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
    </AnimatePresence>
  );
}
