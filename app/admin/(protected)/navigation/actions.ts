"use server"

import { requireAuth } from "@/lib/auth"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getNavItems() {
  await requireAuth()
  return prisma.navItem.findMany({
    orderBy: { order: "asc" },
  })
}

export async function createNavItem(data: {
  labelAr: string
  labelEn: string
  href: string
  order?: number
  isVisible?: boolean
  isExternal?: boolean
}) {
  await requireAuth()
  const maxOrder = await prisma.navItem.aggregate({ _max: { order: true } })
  const navItem = await prisma.navItem.create({
    data: {
      ...data,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  })
  revalidatePath("/admin/navigation")
  revalidatePath("/[lang]", "page")
  return navItem
}

export async function updateNavItem(
  id: string,
  data: {
    labelAr?: string
    labelEn?: string
    href?: string
    order?: number
    isVisible?: boolean
    isExternal?: boolean
  },
) {
  await requireAuth()
  const navItem = await prisma.navItem.update({
    where: { id },
    data,
  })
  revalidatePath("/admin/navigation")
  revalidatePath("/[lang]", "page")
  return navItem
}

export async function deleteNavItem(id: string) {
  await requireAuth()
  await prisma.navItem.delete({ where: { id } })
  revalidatePath("/admin/navigation")
  revalidatePath("/[lang]", "page")
}

export async function toggleNavItemVisible(id: string) {
  await requireAuth()
  const navItem = await prisma.navItem.findUnique({ where: { id } })
  if (!navItem) return null

  const updated = await prisma.navItem.update({
    where: { id },
    data: { isVisible: !navItem.isVisible },
  })
  revalidatePath("/admin/navigation")
  revalidatePath("/[lang]", "page")
  return updated
}
