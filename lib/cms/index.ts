import prisma from "@/lib/db"

// جلب الاستشاريين
export async function getConsultants() {
  try {
    return await prisma.consultant.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  } catch { return [] }
}

// جلب إعدادات الفوتر
export async function getFooterConfig() {
  try {
    return await prisma.footerConfig.findFirst({
      where: { isActive: true },
    })
  } catch { return null }
}

// جلب المشاريع (محدث لجلب كافة الحقول الجديدة)
export async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  } catch { return [] }
}

// جلب الشركاء
export async function getPartners() {
  try {
    return await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  } catch { return [] }
}

// جلب عناصر القائمة
export async function getNavItems() {
  try {
    return await prisma.navItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    })
  } catch { return [] }
}

// جلب نصوص الموقع بالكامل
export async function getAllSiteTexts() {
  try {
    const texts = await prisma.siteText.findMany()
    return texts.reduce((acc, text) => {
      acc[text.key] = text
      return acc
    }, {} as Record<string, any>)
  } catch { return {} }
}

/** * الدوال المساعدة (Helper Functions) التي كانت في ملفك الأصلي
 * ضماناً لعدم تعطل أي جزء آخر من الموقع يستخدم هذه الدوال
 */
export function getLocalizedText(
  text: { headingAr?: string | null; headingEn?: string | null; bodyAr?: string | null; bodyEn?: string | null } | null,
  language: "ar" | "en",
) {
  if (!text) return { heading: "", body: "" }
  return {
    heading: language === "ar" ? text.headingAr || "" : text.headingEn || "",
    body: language === "ar" ? text.bodyAr || "" : text.bodyEn || "",
  }
}

export function getLocalized<T extends Record<string, any>>(
  item: T,
  field: string,
  language: "ar" | "en"
): any {
  const key = `${field}${language === "ar" ? "Ar" : "En"}`
  return item[key] || item[field] || ""
}

// ─────────────────────────────────────────
// AI Knowledge Base
// ─────────────────────────────────────────
export async function getAiKnowledgeBase() {
  try {
    const record = await prisma.aiKnowledgeBase.findUnique({
      where: { id: "singleton" },
    })
    return record
  } catch {
    return null
  }
}

// ─────────────────────────────────────────
// AI Knowledge Sections (dynamic CRUD)
// ─────────────────────────────────────────
export async function getAiKnowledgeSections() {
  try {
    return await prisma.aiKnowledgeSection.findMany({
      orderBy: { order: "asc" },
    })
  } catch {
    return []
  }
}