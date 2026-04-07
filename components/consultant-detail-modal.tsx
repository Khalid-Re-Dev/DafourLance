"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Award, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface Consultant {
  id: string
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  descriptionAr: string | null
  descriptionEn: string | null
  imageUrl: string | null
  isFeatured: boolean
}

interface ConsultantDetailModalProps {
  consultant: Consultant | null
  isOpen: boolean
  onClose: () => void
}

export default function ConsultantDetailModal({
  consultant,
  isOpen,
  onClose,
}: ConsultantDetailModalProps) {
  const { language, isRTL } = useLanguage()

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  if (!consultant) return null

  const name = language === "ar" ? consultant.nameAr : consultant.nameEn
  const role = language === "ar" ? consultant.roleAr : consultant.roleEn
  const description =
    language === "ar" ? consultant.descriptionAr : consultant.descriptionEn

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col"
          >
            {/* ── Header with image ── */}
            <div className="relative shrink-0">
              {/* Background pattern — dark navy top section */}
              <div className="h-44 md:h-52 relative overflow-hidden">
                {/* Diagonal pattern similar to consultant cards */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polygon points="0,0 100,0 100,75 0,100" fill="#1f2b3b" />
                  <polygon
                    points="0,100 100,75 100,78 0,103"
                    fill="#fe6a52"
                  />
                </svg>

                {/* Featured badge */}
                {consultant.isFeatured && (
                  <motion.div
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`absolute top-4 ${
                      isRTL ? "left-4" : "right-14"
                    } flex items-center gap-1.5 px-3 py-1.5 bg-[#fe6a52] text-white text-xs font-bold rounded-full shadow-lg`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    {language === "ar" ? "مميز" : "Featured"}
                  </motion.div>
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className={`absolute top-4 ${
                    isRTL ? "left-auto right-4" : "right-4"
                  } p-2 bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors duration-200`}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Consultant avatar — overlapping the header */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
                  className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] rounded-[24px] border-4 border-white shadow-xl overflow-hidden bg-[#1f2b3b] flex items-center justify-center"
                >
                  {consultant.imageUrl ? (
                    <img
                      src={consultant.imageUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-14 h-14 text-white/60" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* ── Body ── */}
            <div
              className={`flex-1 overflow-y-auto pt-[90px] md:pt-[105px] pb-8 px-6 md:px-8 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {/* Name */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-[28px] font-bold text-[#1f2b3b] text-center leading-tight"
              >
                {name}
              </motion.h2>

              {/* Role badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="flex justify-center mt-3"
              >
                <span className="inline-block px-4 py-1.5 bg-[#fff0eb] text-[#fe6a52] text-sm font-semibold rounded-full">
                  {role}
                </span>
              </motion.div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#fe6a52]" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e5e7eb] to-transparent" />
              </div>

              {/* Description / Bio */}
              {description ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <h3 className="text-sm font-bold text-[#1f2b3b] mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-[#fe6a52] rounded-full" />
                    {language === "ar" ? "نبذة" : "About"}
                  </h3>
                  <p className="text-[#6b7280] leading-[1.85] text-[15px] whitespace-pre-wrap">
                    {description}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-[#9ca3af] text-sm text-center italic"
                >
                  {language === "ar"
                    ? "لا يوجد وصف متاح حالياً."
                    : "No description available at this moment."}
                </motion.p>
              )}
            </div>

            {/* ── Footer accent bar ── */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1f2b3b] via-[#fe6a52] to-[#1f2b3b]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
