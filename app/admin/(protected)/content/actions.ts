"use server"

import { requireAuth } from "@/lib/auth"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getSiteTexts() {
  await requireAuth()
  return prisma.siteText.findMany({
    orderBy: { key: "asc" },
  })
}

export async function updateSiteText(
  id: string,
  data: {
    headingAr?: string
    headingEn?: string
    bodyAr?: string
    bodyEn?: string
    extraJson?: string
  },
) {
  await requireAuth()
  const siteText = await prisma.siteText.update({
    where: { id },
    data,
  })
  revalidatePath("/admin/content")
  revalidatePath("/[lang]", "page")
  return siteText
}

export async function createSiteText(data: {
  key: string
  headingAr?: string
  headingEn?: string
  bodyAr?: string
  bodyEn?: string
  extraJson?: string
}) {
  await requireAuth()
  const siteText = await prisma.siteText.create({
    data,
  })
  revalidatePath("/admin/content")
  revalidatePath("/[lang]", "page")
  return siteText
}
