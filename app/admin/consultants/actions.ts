"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getConsultants() {
  return prisma.consultant.findMany({
    orderBy: { order: "asc" },
  })
}

export async function createConsultant(data: {
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  descriptionAr?: string
  descriptionEn?: string
  imageUrl?: string
  isFeatured?: boolean
  order?: number
}) {
  const maxOrder = await prisma.consultant.aggregate({ _max: { order: true } })
  const consultant = await prisma.consultant.create({
    data: {
      ...data,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  })
  revalidatePath("/admin/consultants")
  revalidatePath("/")
  return consultant
}

export async function updateConsultant(
  id: string,
  data: {
    nameAr?: string
    nameEn?: string
    roleAr?: string
    roleEn?: string
    descriptionAr?: string
    descriptionEn?: string
    imageUrl?: string
    isFeatured?: boolean
    order?: number
    isActive?: boolean
  },
) {
  const consultant = await prisma.consultant.update({
    where: { id },
    data,
  })
  revalidatePath("/admin/consultants")
  revalidatePath("/")
  return consultant
}

export async function deleteConsultant(id: string) {
  await prisma.consultant.delete({ where: { id } })
  revalidatePath("/admin/consultants")
  revalidatePath("/")
}

export async function toggleConsultantActive(id: string) {
  const consultant = await prisma.consultant.findUnique({ where: { id } })
  if (!consultant) return null

  const updated = await prisma.consultant.update({
    where: { id },
    data: { isActive: !consultant.isActive },
  })
  revalidatePath("/admin/consultants")
  revalidatePath("/")
  return updated
}
