"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

// ── Types ──────────────────────────────────────────────────

type BehaviorData = {
  behaviorInstructionsAr: string
  behaviorInstructionsEn: string
}

type SectionInput = {
  icon: string
  titleAr: string
  titleEn: string
  contentAr: string
  contentEn: string
}

export type SectionRecord = {
  id: string
  icon: string
  titleAr: string
  titleEn: string
  contentAr: string
  contentEn: string
  order: number
}

// ── Revalidate helper ──────────────────────────────────────

function revalidateAll() {
  revalidatePath("/api/ai-chat")
  revalidatePath("/admin/ai-content")
}

// ── Default sections (seeded on first load) ────────────────

const DEFAULT_SECTIONS: Omit<SectionInput, "contentAr" | "contentEn">[] = [
  { icon: "🏢", titleAr: "معلومات الشركة", titleEn: "Company Information" },
  { icon: "⚙️", titleAr: "الخدمات المقدمة", titleEn: "Services Offered" },
  { icon: "✨", titleAr: "المميزات والميزات", titleEn: "Features & Highlights" },
  { icon: "💰", titleAr: "معلومات الأسعار", titleEn: "Pricing Information" },
  { icon: "❓", titleAr: "الأسئلة الشائعة", titleEn: "FAQ / Common Questions" },
  { icon: "📋", titleAr: "سياق إضافي", titleEn: "Additional Context" },
]

// ── Behavior Instructions (AiKnowledgeBase singleton) ──────

export async function getBehaviorInstructions(): Promise<{
  success: boolean
  data: BehaviorData
}> {
  try {
    const record = await prisma.aiKnowledgeBase.findUnique({
      where: { id: "singleton" },
    })
    return {
      success: true,
      data: {
        behaviorInstructionsAr: record?.behaviorInstructionsAr ?? "",
        behaviorInstructionsEn: record?.behaviorInstructionsEn ?? "",
      },
    }
  } catch (error) {
    console.error("[Admin] getBehaviorInstructions error:", error)
    return {
      success: false,
      data: { behaviorInstructionsAr: "", behaviorInstructionsEn: "" },
    }
  }
}

export async function updateBehaviorInstructions(
  data: BehaviorData
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.aiKnowledgeBase.upsert({
      where: { id: "singleton" },
      update: {
        behaviorInstructionsAr: data.behaviorInstructionsAr,
        behaviorInstructionsEn: data.behaviorInstructionsEn,
      },
      create: {
        id: "singleton",
        behaviorInstructionsAr: data.behaviorInstructionsAr,
        behaviorInstructionsEn: data.behaviorInstructionsEn,
      },
    })
    revalidateAll()
    return { success: true, message: "Saved successfully" }
  } catch (error) {
    console.error("[Admin] updateBehaviorInstructions error:", error)
    return { success: false, message: "Save failed. Please try again." }
  }
}

// ── Knowledge Sections CRUD ────────────────────────────────

export async function getAiKnowledgeSectionsAdmin(): Promise<SectionRecord[]> {
  try {
    const sections = await prisma.aiKnowledgeSection.findMany({
      orderBy: { order: "asc" },
    })

    // Seed defaults if no sections exist yet
    if (sections.length === 0) {
      await prisma.aiKnowledgeSection.createMany({
        data: DEFAULT_SECTIONS.map((s, i) => ({
          icon: s.icon,
          titleAr: s.titleAr,
          titleEn: s.titleEn,
          contentAr: "",
          contentEn: "",
          order: i,
        })),
      })
      return await prisma.aiKnowledgeSection.findMany({
        orderBy: { order: "asc" },
      })
    }

    return sections
  } catch (error) {
    console.error("[Admin] getAiKnowledgeSectionsAdmin error:", error)
    return []
  }
}

export async function createAiKnowledgeSection(
  data: SectionInput
): Promise<{ success: boolean; message: string }> {
  try {
    // Get max order to place new section at end
    const maxOrder = await prisma.aiKnowledgeSection.aggregate({
      _max: { order: true },
    })
    const nextOrder = (maxOrder._max.order ?? -1) + 1

    await prisma.aiKnowledgeSection.create({
      data: { ...data, order: nextOrder },
    })
    revalidateAll()
    return { success: true, message: "Section added successfully" }
  } catch (error) {
    console.error("[Admin] createAiKnowledgeSection error:", error)
    return { success: false, message: "Failed to add section" }
  }
}

export async function updateAiKnowledgeSection(
  id: string,
  data: Partial<SectionInput>
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.aiKnowledgeSection.update({
      where: { id },
      data,
    })
    revalidateAll()
    return { success: true, message: "Section updated successfully" }
  } catch (error) {
    console.error("[Admin] updateAiKnowledgeSection error:", error)
    return { success: false, message: "Failed to update section" }
  }
}

export async function updateSectionContent(
  id: string,
  contentAr: string,
  contentEn: string
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.aiKnowledgeSection.update({
      where: { id },
      data: { contentAr, contentEn },
    })
    revalidateAll()
    return { success: true, message: "Content saved" }
  } catch (error) {
    console.error("[Admin] updateSectionContent error:", error)
    return { success: false, message: "Failed to save content" }
  }
}

export async function deleteAiKnowledgeSection(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.aiKnowledgeSection.delete({
      where: { id },
    })
    revalidateAll()
    return { success: true, message: "Section deleted" }
  } catch (error) {
    console.error("[Admin] deleteAiKnowledgeSection error:", error)
    return { success: false, message: "Failed to delete section" }
  }
}

// ── Keep backward compat for existing code ─────────────────

type AiKnowledgeBaseData = {
  aboutAr: string; aboutEn: string
  servicesAr: string; servicesEn: string
  featuresAr: string; featuresEn: string
  pricingAr: string; pricingEn: string
  faqAr: string; faqEn: string
  extraAr: string; extraEn: string
  behaviorInstructionsAr: string; behaviorInstructionsEn: string
}

export async function getAiKnowledgeBaseAdmin(): Promise<{
  success: boolean
  data: AiKnowledgeBaseData | null
}> {
  try {
    const record = await prisma.aiKnowledgeBase.findUnique({
      where: { id: "singleton" },
    })
    if (!record) {
      return {
        success: true,
        data: {
          aboutAr: "", aboutEn: "",
          servicesAr: "", servicesEn: "",
          featuresAr: "", featuresEn: "",
          pricingAr: "", pricingEn: "",
          faqAr: "", faqEn: "",
          extraAr: "", extraEn: "",
          behaviorInstructionsAr: "", behaviorInstructionsEn: "",
        },
      }
    }
    return { success: true, data: record }
  } catch (error) {
    console.error("[Admin] getAiKnowledgeBaseAdmin error:", error)
    return { success: false, data: null }
  }
}

export async function updateAiKnowledgeBase(
  data: AiKnowledgeBaseData
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.aiKnowledgeBase.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    })
    revalidateAll()
    return { success: true, message: "Saved successfully" }
  } catch (error) {
    console.error("[Admin] updateAiKnowledgeBase error:", error)
    return { success: false, message: "Save failed. Please try again." }
  }
}
