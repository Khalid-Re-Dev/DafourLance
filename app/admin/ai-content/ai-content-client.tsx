"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Brain, Save, ChevronDown, ChevronUp } from "lucide-react"
import { updateAiKnowledgeBase } from "./actions"

// ── Types ──────────────────────────────────────────────────
type Lang = "ar" | "en"

type KbData = {
  aboutAr: string; aboutEn: string
  servicesAr: string; servicesEn: string
  featuresAr: string; featuresEn: string
  pricingAr: string; pricingEn: string
  faqAr: string; faqEn: string
  extraAr: string; extraEn: string
  behaviorInstructionsAr: string; behaviorInstructionsEn: string
}

interface Props {
  initialData: KbData | null
}

// ── Section config ─────────────────────────────────────────
type SectionKey = "about" | "services" | "features" | "pricing" | "faq" | "extra" | "behaviorInstructions"

interface SectionConfig {
  key: SectionKey
  icon: string
  labelEn: string
  labelAr: string
  hintEn: string
  hintAr: string
  placeholderAr: string
  placeholderEn: string
  rows: number
}

const SECTIONS: SectionConfig[] = [
  {
    key: "about",
    icon: "🏢",
    labelEn: "Company Information",
    labelAr: "معلومات الشركة",
    hintEn: "Who you are, your mission, vision, and background.",
    hintAr: "من أنتم، رسالتكم، رؤيتكم، وخلفية الشركة.",
    placeholderAr: "دافور لانس شركة متخصصة في...",
    placeholderEn: "DaforLance is a company specialized in...",
    rows: 4,
  },
  {
    key: "services",
    icon: "⚙️",
    labelEn: "Services Offered",
    labelAr: "الخدمات المقدمة",
    hintEn: "List all services with details. The AI uses this to answer service questions.",
    hintAr: "اذكر كل الخدمات مع تفاصيلها. يستخدمها الذكاء الاصطناعي للإجابة.",
    placeholderAr: "1. تصميم المواقع - ...\n2. تطبيقات الجوال - ...",
    placeholderEn: "1. Web Design - ...\n2. Mobile Apps - ...",
    rows: 6,
  },
  {
    key: "features",
    icon: "✨",
    labelEn: "Features & Highlights",
    labelAr: "المميزات والميزات",
    hintEn: "What makes you unique. Special offers, guarantees, team strengths.",
    hintAr: "ما يميزكم. عروض خاصة، ضمانات، مميزات الفريق.",
    placeholderAr: "- خبرة أكثر من 5 سنوات\n- ضمان الجودة لمدة سنة...",
    placeholderEn: "- 5+ years of experience\n- 1-year quality guarantee...",
    rows: 4,
  },
  {
    key: "pricing",
    icon: "💰",
    labelEn: "Pricing Information",
    labelAr: "معلومات الأسعار",
    hintEn: "Pricing ranges, packages, or pricing model. Leave empty if not applicable.",
    hintAr: "نطاقات الأسعار أو الباقات. اتركه فارغاً إن لم ينطبق.",
    placeholderAr: "باقة المبتدئين: تبدأ من ...\nباقة الأعمال: ...",
    placeholderEn: "Starter package: from ...\nBusiness package: ...",
    rows: 4,
  },
  {
    key: "faq",
    icon: "❓",
    labelEn: "FAQ / Common Questions",
    labelAr: "الأسئلة الشائعة",
    hintEn: "Add frequent questions with answers. The AI will use these directly.",
    hintAr: "أضف أسئلة متكررة مع إجاباتها. يستخدمها الذكاء الاصطناعي مباشرة.",
    placeholderAr: "س: كم يستغرق تسليم الموقع؟\nج: عادةً من 2-4 أسابيع...",
    placeholderEn: "Q: How long does delivery take?\nA: Usually 2-4 weeks...",
    rows: 6,
  },
  {
    key: "extra",
    icon: "📋",
    labelEn: "Additional Context",
    labelAr: "سياق إضافي",
    hintEn: "Any other info that doesn't fit above. Portfolio links, team info, policies.",
    hintAr: "أي معلومات أخرى. روابط أعمال، معلومات الفريق، السياسات.",
    placeholderAr: "أعمالنا السابقة: ...\nفريقنا يتكون من...",
    placeholderEn: "Our previous work: ...\nOur team consists of...",
    rows: 4,
  },
  {
    key: "behaviorInstructions",
    icon: "🎯",
    labelEn: "AI Behavior Instructions",
    labelAr: "تعليمات سلوك الذكاء الاصطناعي",
    hintEn: "Custom instructions appended to the system prompt. Control tone, style, restrictions.",
    hintAr: "تعليمات مخصصة تُضاف لـ system prompt. تحكم في الأسلوب والقيود.",
    placeholderAr: "كن ودياً دائماً. لا تذكر المنافسين. اقترح التواصل عبر واتساب عند الاستفسار عن الأسعار.",
    placeholderEn: "Always be friendly. Don't mention competitors. Suggest WhatsApp contact when asked about pricing.",
    rows: 3,
  },
]

// ── Default empty state ────────────────────────────────────
const EMPTY_DATA: KbData = {
  aboutAr: "", aboutEn: "",
  servicesAr: "", servicesEn: "",
  featuresAr: "", featuresEn: "",
  pricingAr: "", pricingEn: "",
  faqAr: "", faqEn: "",
  extraAr: "", extraEn: "",
  behaviorInstructionsAr: "", behaviorInstructionsEn: "",
}

// ── Helper to build the field key from section key + language ──
function getFieldKey(sectionKey: SectionKey, lang: Lang): keyof KbData {
  const suffix = lang === "ar" ? "Ar" : "En"
  return `${sectionKey}${suffix}` as keyof KbData
}

// ── Component ──────────────────────────────────────────────
export default function AiContentClient({ initialData }: Props) {
  const [formData, setFormData] = useState<KbData>(
    initialData ?? EMPTY_DATA
  )
  const [activeLang, setActiveLang] = useState<Lang>("ar")
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({ about: true }) // first section open by default
  const [isPending, startTransition] = useTransition()

  // ── Handlers ───────────────────────────────────────────
  function handleChange(field: keyof KbData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function toggleSection(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateAiKnowledgeBase(formData)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#fe6a52]/5 border border-[#fe6a52]/20 rounded-xl">
        <Brain className="w-5 h-5 text-[#fe6a52] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-[#1f2b3b]">
            How this works
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Content added here is injected into the AI chatbot context on every 
            conversation. The AI will use it to answer visitor questions accurately.
            Leave any section empty to use the default hardcoded content.
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
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeLang === lang
                ? "bg-white shadow-sm text-[#1f2b3b] border border-[#e5e7eb]"
                : "text-gray-500 hover:text-[#1f2b3b]"
              }
            `}
          >
            {lang === "ar" ? "🇸🇦 العربية" : "🇬🇧 English"}
          </button>
        ))}
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const fieldKey = getFieldKey(section.key, activeLang)
        const isExpanded = expandedSections[section.key] ?? false
        const hasContent = !!(
          formData[getFieldKey(section.key, "ar")] ||
          formData[getFieldKey(section.key, "en")]
        )

        return (
          <div
            key={section.key}
            dir={activeLang === "ar" ? "rtl" : "ltr"}
            className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden"
          >
            {/* Section header — clickable to expand/collapse */}
            <button
              type="button"
              onClick={() => toggleSection(section.key)}
              className={`w-full flex items-center gap-3 p-4 px-5 hover:bg-[#f9fafb] transition-colors ${activeLang === "ar" ? "text-right" : "text-left"}`}
            >
              {/* Icon — first in DOM: appears RIGHT in RTL, LEFT in LTR */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg leading-none">{section.icon}</span>
                {hasContent && (
                  <span className="w-2 h-2 rounded-full bg-[#fe6a52]" />
                )}
              </div>

              {/* Title + hint — takes remaining space */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1f2b3b] leading-tight">
                  {activeLang === "ar" ? section.labelAr : section.labelEn}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  {activeLang === "ar" ? section.hintAr : section.hintEn}
                </p>
              </div>

              {/* Chevron — last in DOM: appears LEFT in RTL, RIGHT in LTR */}
              <div className="shrink-0">
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </div>
            </button>

            {/* Section body */}
            {isExpanded && (
              <div className="px-5 pb-5">
                <textarea
                  value={formData[fieldKey]}
                  onChange={(e) => handleChange(fieldKey, e.target.value)}
                  rows={section.rows}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  placeholder={
                    activeLang === "ar"
                      ? section.placeholderAr
                      : section.placeholderEn
                  }
                  className="
                    w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb]
                    px-4 py-3 text-sm text-[#1f2b3b]
                    placeholder:text-[#9ca3af]
                    outline-none resize-y transition-all
                    focus:border-[#fe6a52] focus:ring-2 focus:ring-[#fe6a52]/20
                  "
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Save button — same pattern as settings page */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="
            inline-flex items-center gap-2 px-5 py-2.5
            rounded-xl text-sm font-semibold text-white
            bg-[#fe6a52] hover:bg-[#e55b45]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors shadow-sm
          "
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save Knowledge Base"}
        </button>
      </div>

    </div>
  )
}
