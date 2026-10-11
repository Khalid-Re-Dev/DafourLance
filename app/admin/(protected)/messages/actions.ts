"use server"

import { requireAuth } from "@/lib/auth"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getMessages() {
  await requireAuth()
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getUnreadCount() {
  await requireAuth()
  return prisma.contactMessage.count({
    where: { isRead: false },
  })
}

export async function markAsRead(id: string) {
  await requireAuth()
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  })
  revalidatePath("/admin/messages")
}

export async function markAsUnread(id: string) {
  await requireAuth()
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: false },
  })
  revalidatePath("/admin/messages")
}

export async function deleteMessage(id: string) {
  await requireAuth()
  await prisma.contactMessage.delete({
    where: { id },
  })
  revalidatePath("/admin/messages")
}
