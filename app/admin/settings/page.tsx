"use client"

import { useEffect, useState, useTransition } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Globe,
  Palette,
  Shield,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Loader2,
  KeyRound,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { getSettings, saveOpenAiKey, deleteOpenAiKey } from "./actions"

export default function SettingsPage() {
  // ─── state ───────────────────────────────────────
  const [apiKey, setApiKey] = useState("")          // new key being entered
  const [maskedKey, setMaskedKey] = useState<string | null>(null) // masked display value from server
  const [hasKey, setHasKey] = useState(false)        // whether a key is configured
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, startSaveTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  // ─── load existing key ───────────────────────────
  useEffect(() => {
    getSettings()
      .then((s) => {
        if (s.hasKey && s.openAiKey) {
          setMaskedKey(s.openAiKey) // this is the masked version
          setHasKey(true)
        }
      })
      .catch(() => { /* auth redirect will handle it */ })
      .finally(() => setLoading(false))
  }, [])

  // ─── handlers ────────────────────────────────────
  function handleSave() {
    startSaveTransition(async () => {
      const res = await saveOpenAiKey(apiKey)
      if (res.success) {
        toast.success("API key saved successfully")
        // Re-fetch to get the newly masked value
        const updated = await getSettings()
        setMaskedKey(updated.openAiKey)
        setHasKey(true)
        setApiKey("")
        setShowKey(false)
      } else {
        toast.error(res.error ?? "Failed to save key")
      }
    })
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      const res = await deleteOpenAiKey()
      if (res.success) {
        toast.success("API key removed")
        setMaskedKey(null)
        setHasKey(false)
        setApiKey("")
        setShowKey(false)
      } else {
        toast.error(res.error ?? "Failed to remove key")
      }
    })
  }

  const hasUnsavedChanges = apiKey.trim().length > 0

  // ─── render ──────────────────────────────────────
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
        {/* ── OpenAI API Key Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#fe6a52]/10 rounded-lg flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-[#fe6a52]" />
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              {/* Title row */}
              <div>
                <h3 className="font-semibold text-[#1f2b3b]">OpenAI API Key</h3>
                <p className="text-sm text-[#6b7280] mt-1">
                  Manage your OpenAI key for AI-powered features. Stored securely in the database.
                </p>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-[#6b7280] text-sm py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading settings…
                </div>
              ) : (
                <>
                  {/* Status badge */}
                  {hasKey && (
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Key configured {maskedKey && <span className="text-emerald-500 font-mono">({maskedKey})</span>}
                    </div>
                  )}

                  {/* Input group */}
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        if (!showKey) setShowKey(true)
                        setApiKey(e.target.value)
                      }}
                      onFocus={() => {
                        if (!showKey && apiKey) setShowKey(true)
                      }}
                      placeholder={hasKey ? "Enter new key to replace…" : "sk-proj-…"}
                      className="w-full h-11 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 pr-12 text-sm text-[#1f2b3b] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#fe6a52] focus:ring-2 focus:ring-[#fe6a52]/20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#1f2b3b] transition-colors"
                      aria-label={showKey ? "Hide key" : "Show key"}
                    >
                      {showKey ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !apiKey.trim() || !hasUnsavedChanges}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#fe6a52] hover:bg-[#e55b45] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? "Saving…" : "Save Key"}
                    </button>

                    {hasKey && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        {isDeleting ? "Removing…" : "Delete Key"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Language Settings ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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

        {/* ── Theme Settings ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        {/* ── Security Settings ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
