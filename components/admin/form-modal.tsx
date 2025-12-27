"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit?: () => void
  isLoading?: boolean
}

export default function FormModal({ isOpen, onClose, title, children, onSubmit, isLoading }: FormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
              <h2 className="text-xl font-semibold text-[#1f2b3b]">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-[#9ca3af] hover:text-[#6b7280] hover:bg-[#f3f4f6] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
              <Button variant="outline" onClick={onClose} className="rounded-xl bg-transparent">
                Cancel
              </Button>
              {onSubmit && (
                <Button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-xl"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
