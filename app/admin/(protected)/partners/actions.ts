"use server"

import { requireAuth } from "@/lib/auth"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getPartners() {
  await requireAuth()
  return prisma.partner.findMany({
    orderBy: { order: "asc" },
  })
}

export async function createPartner(data: {
  nameAr: string
  nameEn: string
  logoUrl: string
  websiteUrl?: string
  order?: number
}) {
  await requireAuth()
  const maxOrder = await prisma.partner.aggregate({ _max: { order: true } })
  const partner = await prisma.partner.create({
    data: {
      ...data,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  })
  revalidatePath("/admin/partners")
  revalidatePath("/[lang]", "page")
  return partner
}

export async function updatePartner(
  id: string,
  data: {
    nameAr?: string
    nameEn?: string
    logoUrl?: string
    websiteUrl?: string
    order?: number
    isActive?: boolean
  },
) {
  await requireAuth()
  const partner = await prisma.partner.update({
    where: { id },
    data,
  })
  revalidatePath("/admin/partners")
  revalidatePath("/[lang]", "page")
  return partner
}

export async function deletePartner(id: string) {
  await requireAuth()
  await prisma.partner.delete({ where: { id } })
  revalidatePath("/admin/partners")
  revalidatePath("/[lang]", "page")
}

export async function togglePartnerActive(id: string) {
  await requireAuth()
  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) return null

  const updated = await prisma.partner.update({
    where: { id },
    data: { isActive: !partner.isActive },
  })
  revalidatePath("/admin/partners")
  revalidatePath("/[lang]", "page")
  return updated
}
