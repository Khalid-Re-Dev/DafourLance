import prisma from "@/lib/db"

// Fetch all active consultants ordered by their order field
export async function getConsultants() {
  try {
    return await prisma.consultant.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  } catch {
    // Return empty array if database is not yet initialized
    return []
  }
}

// Fetch all active projects ordered by their order field
export async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  } catch {
    return []
  }
}

// Fetch all active partners ordered by their order field
export async function getPartners() {
  try {
    return await prisma.partner.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })
  } catch {
    return []
  }
}

// Fetch all visible nav items ordered by their order field
export async function getNavItems() {
  try {
    return await prisma.navItem.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
    })
  } catch {
    return []
  }
}

// Fetch a site text by its key
export async function getSiteText(key: string) {
  try {
    return await prisma.siteText.findUnique({
      where: { key },
    })
  } catch {
    return null
  }
}

// Fetch all site texts (useful for bulk loading)
export async function getAllSiteTexts() {
  try {
    const texts = await prisma.siteText.findMany()
    // Convert to a map for easy access
    return texts.reduce(
      (acc, text) => {
        acc[text.key] = text
        return acc
      },
      {} as Record<string, (typeof texts)[0]>,
    )
  } catch {
    return {}
  }
}

// Helper to get localized content from a site text
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

// Helper to get localized field from any record with Ar/En fields
export function getLocalized<T extends Record<string, unknown>>(
  record: T,
  field: string,
  language: "ar" | "en",
): string {
  const arField = `${field}Ar` as keyof T
  const enField = `${field}En` as keyof T
  return (language === "ar" ? record[arField] : record[enField]) as string
}
