"use client"

import { useState, useTransition, useCallback } from "react"
import { toast } from "sonner"
import {
  Brain, Save, ChevronDown, ChevronUp,
  Plus, Pencil, Trash2, X, Check, Loader2,
} from "lucide-react"
import {
  type SectionRecord,
  createAiKnowledgeSection,
  updateAiKnowledgeSection,
  updateSectionContent,
  deleteAiKnowledgeSection,
  updateBehaviorInstructions,
} from "./actions"

// ── Types ──────────────────────────────────────────────────
type Lang = "ar" | "en"

type BehaviorData = {
  behaviorInstructionsAr: string
  behaviorInstructionsEn: string
}

interface Props {
  initialSections: SectionRecord[]
  initialBehavior: BehaviorData
}

// ── Emoji picker options ───────────────────────────────────
const EMOJI_OPTIONS = [
  "🏢", "⚙️", "✨", "💰", "❓", "📋", "🎯", "📌",
  "🚀", "💡", "🔧", "📊", "🎨", "📱", "🌐", "🤝",
  "📞", "📧", "🏆", "⭐", "🔒", "📝", "💼", "🎓",
  "🛒", "📦", "🔔", "💬", "🗂️", "📚",
]

// ── Section Modal ──────────────────────────────────────────
function SectionModal({
  isOpen,
  onClose,
  onSave,
  initial,
  isPending,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { icon: string; titleAr: string; titleEn: string }) => void
  initial?: { icon: string; titleAr: string; titleEn: string }
  isPending: boolean
}) {
  const [icon, setIcon] = useState(initial?.icon ?? "📌")
  const [titleAr, setTitleAr] = useState(initial?.titleAr ?? "")
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "")
  const [showEmojis, setShowEmojis] = useState(false)

  if (!isOpen) return null

  const isValid = titleAr.trim() && titleEn.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e5e7eb]">
          <h3 className="text-lg font-bold text-[#1f2b3b]">
            {initial ? "Edit Section" : "Add New Section"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-[#1f2b3b] mb-2">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojis(!showEmojis)}
                className="w-14 h-14 rounded-xl border-2 border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-center text-2xl hover:border-[#fe6a52] transition-colors"
              >
                {icon}
              </button>
              {showEmojis && (
                <div className="absolute top-16 left-0 z-10 bg-white rounded-xl shadow-xl border border-[#e5e7eb] p-3 grid grid-cols-10 gap-1 w-[320px]">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => { setIcon(e); setShowEmojis(false) }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-[#fe6a52]/10 transition-colors ${icon === e ? "bg-[#fe6a52]/20 ring-1 ring-[#fe6a52]" : ""}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title Arabic */}
          <div>
            <label className="block text-sm font-medium text-[#1f2b3b] mb-1.5">
              العنوان بالعربية <span className="text-[#fe6a52]">*</span>
            </label>
            <input
              type="text"
              dir="rtl"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: سياسة الإرجاع"
              className="w-full h-11 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#1f2b3b] placeholder:text-[#9ca3af] outline-none focus:border-[#fe6a52] focus:ring-2 focus:ring-[#fe6a52]/20 transition-all"
            />
          </div>

          {/* Title English */}
          <div>
            <label className="block text-sm font-medium text-[#1f2b3b] mb-1.5">
              Title in English <span className="text-[#fe6a52]">*</span>
            </label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Return Policy"
              className="w-full h-11 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#1f2b3b] placeholder:text-[#9ca3af] outline-none focus:border-[#fe6a52] focus:ring-2 focus:ring-[#fe6a52]/20 transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#e5e7eb] bg-[#f9fafb]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-[#e5e7eb] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isValid || isPending}
            onClick={() => onSave({ icon, titleAr: titleAr.trim(), titleEn: titleEn.trim() })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#fe6a52] hover:bg-[#e55b45] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirmation ────────────────────────────────────
function DeleteConfirm({
  isOpen,
  title,
  onConfirm,
  onCancel,
  isPending,
}: {
  isOpen: boolean
  title: string
  onConfirm: () => void
  onCancel: () => void
  isPending: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-[#1f2b3b]">Delete Section?</h3>
          <p className="text-sm text-gray-500 mt-1">
            &quot;{title}&quot; will be permanently removed. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function AiContentClient({ initialSections, initialBehavior }: Props) {
  // ── State ────────────────────────────────────────────
  const [sections, setSections] = useState<SectionRecord[]>(initialSections)
  const [behavior, setBehavior] = useState<BehaviorData>(initialBehavior)
  const [activeLang, setActiveLang] = useState<Lang>("ar")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [editingContent, setEditingContent] = useState<Record<string, { ar: string; en: string }>>({})

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<SectionRecord | null>(null)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<SectionRecord | null>(null)

  // Transitions
  const [isPending, startTransition] = useTransition()
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [savingBehavior, setSavingBehavior] = useState(false)

  // ── Handlers ─────────────────────────────────────────

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const isExpanding = !prev[id]
      if (isExpanding) {
        const section = sections.find((s) => s.id === id)
        if (section && !editingContent[id]) {
          setEditingContent((prev) => ({
            ...prev,
            [id]: { ar: section.contentAr, en: section.contentEn },
          }))
        }
      }
      return { ...prev, [id]: !prev[id] }
    })
  }, [sections, editingContent])

  function handleContentChange(id: string, lang: Lang, value: string) {
    setEditingContent((prev) => ({
      ...prev,
      [id]: { ...prev[id], [lang === "ar" ? "ar" : "en"]: value },
    }))
  }

  function handleSaveContent(id: string) {
    const content = editingContent[id]
    if (!content) return

    setSavingSection(id)
    startTransition(async () => {
      const result = await updateSectionContent(id, content.ar, content.en)
      if (result.success) {
        toast.success(result.message)
        setSections((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, contentAr: content.ar, contentEn: content.en } : s
          )
        )
      } else {
        toast.error(result.message)
      }
      setSavingSection(null)
    })
  }

  function handleAddSection() {
    setEditingSection(null)
    setModalOpen(true)
  }

  function handleEditSection(section: SectionRecord) {
    setEditingSection(section)
    setModalOpen(true)
  }

  function handleModalSave(data: { icon: string; titleAr: string; titleEn: string }) {
    startTransition(async () => {
      if (editingSection) {
        // Update existing
        const result = await updateAiKnowledgeSection(editingSection.id, data)
        if (result.success) {
          toast.success(result.message)
          setSections((prev) =>
            prev.map((s) =>
              s.id === editingSection.id ? { ...s, ...data } : s
            )
          )
        } else {
          toast.error(result.message)
        }
      } else {
        // Create new
        const result = await createAiKnowledgeSection({
          ...data,
          contentAr: "",
          contentEn: "",
        })
        if (result.success) {
          toast.success(result.message)
          // Re-fetch to get the new section with its ID
          window.location.reload()
        } else {
          toast.error(result.message)
        }
      }
      setModalOpen(false)
      setEditingSection(null)
    })
  }

  function handleDeleteSection() {
    if (!deleteTarget) return
    startTransition(async () => {
      const result = await deleteAiKnowledgeSection(deleteTarget.id)
      if (result.success) {
        toast.success(result.message)
        setSections((prev) => prev.filter((s) => s.id !== deleteTarget.id))
        // Clean up editing state
        setEditingContent((prev) => {
          const next = { ...prev }
          delete next[deleteTarget.id]
          return next
        })
        setExpandedSections((prev) => {
          const next = { ...prev }
          delete next[deleteTarget.id]
          return next
        })
      } else {
        toast.error(result.message)
      }
      setDeleteTarget(null)
    })
  }

  function handleSaveBehavior() {
    setSavingBehavior(true)
    startTransition(async () => {
      const result = await updateBehaviorInstructions(behavior)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      setSavingBehavior(false)
    })
  }

  // ── Render ───────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#fe6a52]/5 border border-[#fe6a52]/20 rounded-xl">
        <Brain className="w-5 h-5 text-[#fe6a52] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#1f2b3b]">How this works</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage knowledge sections that the AI chatbot uses to answer visitor questions.
            Add, edit, or remove sections as needed. Each section&apos;s content is injected into the AI context.
          </p>
        </div>
      </div>

      {/* Language toggle */}
      <div className="flex gap-2 p-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl w-fit">
        {(["ar", "en"] as Lang[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeLang === lang
                ? "bg-white shadow-sm text-[#1f2b3b] border border-[#e5e7eb]"
                : "text-gray-500 hover:text-[#1f2b3b]"
            }`}
          >
            {lang === "ar" ? "🇸🇦 العربية" : "🇬🇧 English"}
          </button>
        ))}
      </div>

      {/* ─── Dynamic Sections ─── */}
      {sections.map((section) => {
        const isExpanded = expandedSections[section.id] ?? false
        const content = editingContent[section.id]
        const hasContent = !!(section.contentAr || section.contentEn)
        const isSaving = savingSection === section.id

        return (
          <div
            key={section.id}
            dir={activeLang === "ar" ? "rtl" : "ltr"}
            className="group bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden transition-shadow hover:shadow-md"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 p-4 px-5">
              {/* Icon */}
              <span className="text-lg leading-none shrink-0">{section.icon}</span>

              {/* Title — clickable to expand */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`flex-1 min-w-0 ${activeLang === "ar" ? "text-right" : "text-left"}`}
              >
                <p className="text-sm font-semibold text-[#1f2b3b] leading-tight">
                  {activeLang === "ar" ? section.titleAr : section.titleEn}
                </p>
              </button>

              {/* Action buttons — visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditSection(section)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#fe6a52] hover:bg-[#fe6a52]/10 transition-all"
                  title="Edit section"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(section)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Delete section"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content indicator + Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                {hasContent && (
                  <span className="w-2 h-2 rounded-full bg-[#fe6a52]" />
                )}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="text-gray-400 hover:text-[#1f2b3b] transition-colors"
                >
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4" />
                    : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Section body — expandable content area */}
            {isExpanded && content && (
              <div className="px-5 pb-5 space-y-3 border-t border-[#e5e7eb]/50">
                <div className="pt-3">
                  <textarea
                    value={activeLang === "ar" ? content.ar : content.en}
                    onChange={(e) => handleContentChange(section.id, activeLang, e.target.value)}
                    rows={5}
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    placeholder={
                      activeLang === "ar"
                        ? "أضف محتوى هذا القسم بالعربية..."
                        : "Add content for this section in English..."
                    }
                    className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#1f2b3b] placeholder:text-[#9ca3af] outline-none resize-y transition-all focus:border-[#fe6a52] focus:ring-2 focus:ring-[#fe6a52]/20"
                  />
                </div>
                <div className={`flex ${activeLang === "ar" ? "justify-start" : "justify-end"}`}>
                  <button
                    type="button"
                    onClick={() => handleSaveContent(section.id)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#fe6a52] hover:bg-[#e55b45] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {isSaving
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Save className="w-3.5 h-3.5" />}
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* ─── Add Section Button ─── */}
      <button
        type="button"
        onClick={handleAddSection}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#e5e7eb] text-gray-400 hover:border-[#fe6a52] hover:text-[#fe6a52] hover:bg-[#fe6a52]/5 transition-all duration-200"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Add New Section</span>
      </button>

      {/* ─── Behavior Instructions (special section) ─── */}
      <div
        dir={activeLang === "ar" ? "rtl" : "ltr"}
        className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden"
      >
        <div className="flex items-center gap-3 p-4 px-5 border-b border-[#e5e7eb]/50">
          <span className="text-lg leading-none shrink-0">🎯</span>
          <div className={`flex-1 min-w-0 ${activeLang === "ar" ? "text-right" : "text-left"}`}>
            <p className="text-sm font-semibold text-[#1f2b3b] leading-tight">
              {activeLang === "ar"
                ? "تعليمات سلوك الذكاء الاصطناعي"
                : "AI Behavior Instructions"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeLang === "ar"
                ? "تعليمات مخصصة تُضاف لـ system prompt. تحكم في الأسلوب والقيود."
                : "Custom instructions appended to the system prompt. Control tone, style, restrictions."}
            </p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <textarea
            value={activeLang === "ar" ? behavior.behaviorInstructionsAr : behavior.behaviorInstructionsEn}
            onChange={(e) =>
              setBehavior((prev) => ({
                ...prev,
                [activeLang === "ar" ? "behaviorInstructionsAr" : "behaviorInstructionsEn"]: e.target.value,
              }))
            }
            rows={3}
            dir={activeLang === "ar" ? "rtl" : "ltr"}
            placeholder={
              activeLang === "ar"
                ? "كن ودياً دائماً. لا تذكر المنافسين. اقترح التواصل عبر واتساب..."
                : "Always be friendly. Don't mention competitors. Suggest WhatsApp contact..."
            }
            className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#1f2b3b] placeholder:text-[#9ca3af] outline-none resize-y transition-all focus:border-[#fe6a52] focus:ring-2 focus:ring-[#fe6a52]/20"
          />
          <div className={`flex ${activeLang === "ar" ? "justify-start" : "justify-end"}`}>
            <button
              type="button"
              onClick={handleSaveBehavior}
              disabled={savingBehavior}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#fe6a52] hover:bg-[#e55b45] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {savingBehavior
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Save className="w-4 h-4" />}
              {savingBehavior ? "Saving..." : "Save Instructions"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Modals ─── */}
      <SectionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSection(null) }}
        onSave={handleModalSave}
        initial={editingSection ? { icon: editingSection.icon, titleAr: editingSection.titleAr, titleEn: editingSection.titleEn } : undefined}
        isPending={isPending}
      />

      <DeleteConfirm
        isOpen={!!deleteTarget}
        title={deleteTarget ? (activeLang === "ar" ? deleteTarget.titleAr : deleteTarget.titleEn) : ""}
        onConfirm={handleDeleteSection}
        onCancel={() => setDeleteTarget(null)}
        isPending={isPending}
      />
    </div>
  )
}
