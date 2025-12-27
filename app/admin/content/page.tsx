"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, ChevronDown, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSiteTexts, updateSiteText } from "./actions"

interface SiteText {
  id: string
  key: string
  headingAr: string | null
  headingEn: string | null
  bodyAr: string | null
  bodyEn: string | null
  extraJson: string | null
}

const sections = [
  { id: "hero", label: "Hero Section", keys: ["hero.title", "hero.description", "hero.cta"] },
  {
    id: "about",
    label: "About Section",
    keys: ["about.main", "about.vision", "about.mission", "about.goals", "about.values"],
  },
  { id: "services", label: "Services Section", keys: ["services.main"] },
  { id: "consultants", label: "Consultants Section", keys: ["consultants.main"] },
  { id: "projects", label: "Projects Section", keys: ["projects.main"] },
  { id: "partners", label: "Partners Section", keys: ["partners.main"] },
  { id: "contact", label: "Contact Section", keys: ["contact.main"] },
  { id: "footer", label: "Footer Section", keys: ["footer.main"] },
]

export default function ContentPage() {
  const [siteTexts, setSiteTexts] = useState<SiteText[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(["hero"])
  const [editedTexts, setEditedTexts] = useState<Record<string, Partial<SiteText>>>({})
  const [savingIds, setSavingIds] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const data = await getSiteTexts()
    setSiteTexts(data)
  }

  function toggleSection(sectionId: string) {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  function getTextByKey(key: string): SiteText | undefined {
    return siteTexts.find((t) => t.key === key)
  }

  function handleChange(id: string, field: keyof SiteText, value: string) {
    setEditedTexts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }))
    // Remove from saved list when editing
    setSavedIds((prev) => prev.filter((savedId) => savedId !== id))
  }

  async function handleSave(text: SiteText) {
    const edits = editedTexts[text.id]
    if (!edits) return

    setSavingIds((prev) => [...prev, text.id])
    try {
      await updateSiteText(text.id, {
        headingAr: edits.headingAr ?? text.headingAr ?? undefined,
        headingEn: edits.headingEn ?? text.headingEn ?? undefined,
        bodyAr: edits.bodyAr ?? text.bodyAr ?? undefined,
        bodyEn: edits.bodyEn ?? text.bodyEn ?? undefined,
      })
      await loadData()
      setEditedTexts((prev) => {
        const next = { ...prev }
        delete next[text.id]
        return next
      })
      setSavedIds((prev) => [...prev, text.id])
      setTimeout(() => {
        setSavedIds((prev) => prev.filter((id) => id !== text.id))
      }, 2000)
    } catch (error) {
      console.error("Error saving:", error)
    }
    setSavingIds((prev) => prev.filter((id) => id !== text.id))
  }

  function getValue(text: SiteText, field: keyof SiteText): string {
    const edited = editedTexts[text.id]?.[field]
    if (edited !== undefined) return edited as string
    return (text[field] as string) || ""
  }

  function hasChanges(id: string): boolean {
    return !!editedTexts[id] && Object.keys(editedTexts[id]).length > 0
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#fe6a52]/10 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#fe6a52]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1f2b3b]">Content Management</h1>
          <p className="text-[#6b7280]">Edit text content for all landing page sections</p>
        </div>
      </div>

      {/* Sections Accordion */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#f9fafb] transition-colors"
            >
              <span className="font-semibold text-[#1f2b3b]">{section.label}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#9ca3af] transition-transform ${expandedSections.includes(section.id) ? "rotate-180" : ""}`}
              />
            </button>

            {/* Section Content */}
            {expandedSections.includes(section.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="border-t border-[#e5e7eb]"
              >
                <div className="p-6 space-y-8">
                  {section.keys.map((key) => {
                    const text = getTextByKey(key)
                    if (!text) return null

                    const isSaving = savingIds.includes(text.id)
                    const isSaved = savedIds.includes(text.id)
                    const hasEdits = hasChanges(text.id)

                    return (
                      <div key={key} className="space-y-4 pb-6 border-b border-[#f3f4f6] last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-[#1f2b3b]">{key.split(".")[1]?.toUpperCase() || key}</h3>
                            <code className="text-xs text-[#9ca3af]">{key}</code>
                          </div>
                          {hasEdits && (
                            <Button
                              onClick={() => handleSave(text)}
                              disabled={isSaving}
                              size="sm"
                              className={`gap-2 rounded-lg ${isSaved ? "bg-green-500 hover:bg-green-600" : "bg-[#fe6a52] hover:bg-[#e55a42]"} text-white`}
                            >
                              {isSaving ? (
                                "Saving..."
                              ) : isSaved ? (
                                <>
                                  <Check className="w-4 h-4" /> Saved
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" /> Save
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Heading Fields */}
                        {(text.headingAr !== null || text.headingEn !== null) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-[#9ca3af]">Heading (Arabic)</Label>
                              <Input
                                value={getValue(text, "headingAr")}
                                onChange={(e) => handleChange(text.id, "headingAr", e.target.value)}
                                dir="rtl"
                                className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-[#9ca3af]">Heading (English)</Label>
                              <Input
                                value={getValue(text, "headingEn")}
                                onChange={(e) => handleChange(text.id, "headingEn", e.target.value)}
                                className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20"
                              />
                            </div>
                          </div>
                        )}

                        {/* Body Fields */}
                        {(text.bodyAr !== null || text.bodyEn !== null) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-[#9ca3af]">Body (Arabic)</Label>
                              <Textarea
                                value={getValue(text, "bodyAr")}
                                onChange={(e) => handleChange(text.id, "bodyAr", e.target.value)}
                                dir="rtl"
                                rows={4}
                                className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20 resize-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs text-[#9ca3af]">Body (English)</Label>
                              <Textarea
                                value={getValue(text, "bodyEn")}
                                onChange={(e) => handleChange(text.id, "bodyEn", e.target.value)}
                                rows={4}
                                className="border-[#e5e7eb] focus:border-[#fe6a52] focus:ring-[#fe6a52]/20 resize-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
