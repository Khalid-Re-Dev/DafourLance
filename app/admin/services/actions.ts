"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { order: "asc" },
  })
}

export async function createService(data: {
  icon?: string
  titleAr: string
  titleEn: string
  descriptionAr?: string
  descriptionEn?: string
  order?: number
  isActive?: boolean
  isFeatured?: boolean
}) {
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } })
  const service = await prisma.service.create({
    data: {
      ...data,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  })
  revalidatePath("/admin/services")
  revalidatePath("/")
  return service
}

export async function updateService(
  id: string,
  data: {
    icon?: string
    titleAr?: string
    titleEn?: string
    descriptionAr?: string
    descriptionEn?: string
    order?: number
    isActive?: boolean
    isFeatured?: boolean
  },
) {
  const service = await prisma.service.update({
    where: { id },
    data,
  })
  revalidatePath("/admin/services")
  revalidatePath("/")
  return service
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } })
  revalidatePath("/admin/services")
  revalidatePath("/")
}

export async function toggleServiceActive(id: string) {
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) return null

  const updated = await prisma.service.update({
    where: { id },
    data: { isActive: !service.isActive },
  })
  revalidatePath("/admin/services")
  revalidatePath("/")
  return updated
}
