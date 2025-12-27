"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, LogOut, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/app/admin/login/actions"

interface TopbarProps {
  user: {
    email: string
    name: string | null
  }
}

export default function AdminTopbar({ user }: TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logoutAction()
    } catch (error) {
      // redirect throws an error, which is expected
      router.push("/admin/login")
      router.refresh()
    }
  }

  return (
    <header className="h-16 bg-white border-b border-[#e5e7eb] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Page Title Area */}
      <div>
        <h1 className="text-lg font-semibold text-[#1f2b3b]">Welcome back</h1>
        <p className="text-sm text-[#9ca3af]">Manage your website content</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-[#6b7280] hover:text-[#1f2b3b] hover:bg-[#f9fafb] rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#fe6a52] rounded-full" />
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f9fafb] transition-colors"
          >
            <div className="w-9 h-9 bg-[#fe6a52]/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#fe6a52]" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-[#1f2b3b]">{user.name || "Admin"}</p>
              <p className="text-xs text-[#9ca3af]">{user.email}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#9ca3af] transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg shadow-black/10 border border-[#e5e7eb] overflow-hidden"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full justify-start gap-2 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-none"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}