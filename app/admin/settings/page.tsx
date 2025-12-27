"use client"

import { motion } from "framer-motion"
import { Settings, Globe, Palette, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#9ca3af]/10 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-[#9ca3af]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1f2b3b]">Settings</h1>
          <p className="text-[#6b7280]">Configure site-wide settings</p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1f2b3b]">Language Settings</h3>
              <p className="text-sm text-[#6b7280] mt-1">
                Configure default language and available languages for the site.
              </p>
              <p className="text-xs text-[#9ca3af] mt-3 bg-[#f9fafb] px-3 py-2 rounded-lg">
                Currently supporting: Arabic (default), English
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1f2b3b]">Theme Settings</h3>
              <p className="text-sm text-[#6b7280] mt-1">Customize colors and branding for the website.</p>
              <p className="text-xs text-[#9ca3af] mt-3 bg-[#f9fafb] px-3 py-2 rounded-lg">
                Theme customization coming soon
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1f2b3b]">Security Settings</h3>
              <p className="text-sm text-[#6b7280] mt-1">Manage admin access and authentication settings.</p>
              <p className="text-xs text-[#9ca3af] mt-3 bg-[#f9fafb] px-3 py-2 rounded-lg">
                Change password functionality coming soon
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
