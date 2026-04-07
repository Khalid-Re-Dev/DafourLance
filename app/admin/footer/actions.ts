"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function getFooterConfig() {
  try {
    let config = await prisma.footerConfig.findFirst({
      where: { isActive: true },
    })

    // Create default config if none exists
    if (!config) {
      config = await prisma.footerConfig.create({
        data: {
          phone: "+967 777000000",
          email: "email@email.com",
          whatsapp: "+967 777000000",
          descriptionAr:
            "شركة رائدة في التحول الرقمي تقدما حلولاً مبتكرة في تصميم الأعمال وتحقيق التحول الرقمي بأعلى معايير الجودة والابتكار",
          descriptionEn:
            "A leading company in digital transformation providing innovative solutions in business design and achieving digital transformation with the highest standards of quality and innovation",
          copyrightAr: "جميع الحقوق محفوظة © 2025 دافور لحلول التقنية المحدودة",
          copyrightEn: "All rights reserved © 2025 Dafour Technology Solutions Ltd",
        },
      })
    }

    return config
  } catch {
    return null
  }
}

export async function updateFooterConfig(data: {
  phone?: string
  phone2?: string
  email?: string
  whatsapp?: string
  addressAr?: string
  addressEn?: string
  linkedinUrl?: string
  twitterUrl?: string
  youtubeUrl?: string
  instagramUrl?: string
  facebookUrl?: string
  descriptionAr?: string
  descriptionEn?: string
  copyrightAr?: string
  copyrightEn?: string
}) {
  // Auth guard
  const session = await getSession()
  if (!session) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    let config = await prisma.footerConfig.findFirst({
      where: { isActive: true },
    })

    if (config) {
      config = await prisma.footerConfig.update({
        where: { id: config.id },
        data,
      })
    } else {
      config = await prisma.footerConfig.create({
        data: {
          ...data,
          isActive: true,
        },
      })
    }

    revalidatePath("/admin/footer")
    revalidatePath("/")
    return { success: true, data: config }
  } catch (error) {
    console.error("Error updating footer config:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save footer config",
    }
  }
}
