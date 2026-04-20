"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

type AiKnowledgeBaseData = {
  aboutAr: string
  aboutEn: string
  servicesAr: string
  servicesEn: string
  featuresAr: string
  featuresEn: string
  pricingAr: string
  pricingEn: string
  faqAr: string
  faqEn: string
  extraAr: string
  extraEn: string
  behaviorInstructionsAr: string
  behaviorInstructionsEn: string
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
      // Return empty defaults — don't create yet
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

    // Revalidate chat API so next request picks up new content
    revalidatePath("/api/ai-chat")
    revalidatePath("/admin/ai-content")

    return { success: true, message: "Saved successfully" }
  } catch (error) {
    console.error("[Admin] updateAiKnowledgeBase error:", error)
    return { success: false, message: "Save failed. Please try again." }
  }
}
