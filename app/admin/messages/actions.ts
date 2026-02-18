"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getUnreadCount() {
  return prisma.contactMessage.count({
    where: { isRead: false },
  })
}

export async function markAsRead(id: string) {
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  })
  revalidatePath("/admin/messages")
}

export async function markAsUnread(id: string) {
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: false },
  })
  revalidatePath("/admin/messages")
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({
    where: { id },
  })
  revalidatePath("/admin/messages")
}
