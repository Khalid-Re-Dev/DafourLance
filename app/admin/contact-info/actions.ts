"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getContactInfo() {
  try {
    let config = await prisma.contactInfo.findFirst({
      where: { isActive: true },
    })

    // Create default config if none exists
    if (!config) {
      config = await prisma.contactInfo.create({
        data: {
          phone: "+967 777000000",
          email: "email@email.com",
          whatsapp: "+967 777000000",
          titleAr: "تواصل معنا",
          titleEn: "Contact Us",
          subtitleAr: "نحن هنا لمساعدتك",
          subtitleEn: "We are here to help you",
        },
      })
    }

    return config
  } catch {
    return null
  }
}

export async function updateContactInfo(data: {
  phone?: string
  phone2?: string
  email?: string
  whatsapp?: string
  addressAr?: string
  addressEn?: string
  titleAr?: string
  titleEn?: string
  subtitleAr?: string
  subtitleEn?: string
}) {
  try {
    let config = await prisma.contactInfo.findFirst({
      where: { isActive: true },
    })

    if (config) {
      config = await prisma.contactInfo.update({
        where: { id: config.id },
        data,
      })
    } else {
      config = await prisma.contactInfo.create({
        data: {
          ...data,
          isActive: true,
        },
      })
    }

    revalidatePath("/admin/contact-info")
    revalidatePath("/")
    return config
  } catch (error) {
    console.error("Error updating contact info:", error)
    throw error
  }
}
