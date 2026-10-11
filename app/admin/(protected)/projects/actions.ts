// actions.ts
"use server"

import { requireAuth } from "@/lib/auth"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

// جلب جميع المشاريع مرتبة
export async function getProjects() {
  await requireAuth()
  return prisma.project.findMany({
    orderBy: { order: "asc" },
  })
}

// إنشاء مشروع جديد مع دعم الحقول الموسعة
export async function createProject(data: {
  titleAr: string
  titleEn: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  fullDescriptionAr?: string // ✨ مضاف من v0
  fullDescriptionEn?: string // ✨ مضاف من v0
  categoryAr?: string
  categoryEn?: string
  imageUrl: string
  galleryImages?: string     // ✨ مضاف من v0 (سلسلة JSON)
  ctaLabelAr?: string
  ctaLabelEn?: string
  ctaLink?: string
  order?: number
}) {
  await requireAuth()
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } })
  const project = await prisma.project.create({
    data: {
      ...data,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  })
  revalidatePath("/admin/projects")
  revalidatePath("/[lang]", "page")
  return project
}

// تحديث مشروع موجود
export async function updateProject(
  id: string,
  data: {
    titleAr?: string
    titleEn?: string
    shortDescriptionAr?: string
    shortDescriptionEn?: string
    fullDescriptionAr?: string // ✨ مضاف
    fullDescriptionEn?: string // ✨ مضاف
    categoryAr?: string
    categoryEn?: string
    imageUrl?: string
    galleryImages?: string     // ✨ مضاف
    ctaLabelAr?: string
    ctaLabelEn?: string
    ctaLink?: string
    order?: number
    isActive?: boolean
  },
) {
  await requireAuth()
  const project = await prisma.project.update({
    where: { id },
    data,
  })
  revalidatePath("/admin/projects")
  revalidatePath("/[lang]", "page")
  return project
}

// حذف مشروع
export async function deleteProject(id: string) {
  await requireAuth()
  await prisma.project.delete({ where: { id } })
  revalidatePath("/admin/projects")
  revalidatePath("/[lang]", "page")
}

// تفعيل أو تعطيل المشروع
export async function toggleProjectActive(id: string) {
  await requireAuth()
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project) return null

  const updated = await prisma.project.update({
    where: { id },
    data: { isActive: !project.isActive },
  })
  revalidatePath("/admin/projects")
  revalidatePath("/[lang]", "page")
  return updated
}