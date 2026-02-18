"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function submitContactForm(formData: FormData) {
  // 1. استخراج البيانات من الفورم
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const message = formData.get("message") as string

  // 2. التحقق من الحقول المطلوبة
  if (!firstName || !lastName || !email || !message) {
    return { success: false, error: "Missing required fields" }
  }

  try {
    // 3. حفظ الرسالة في قاعدة البيانات
    await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || "", // حفظ الهاتف كنص فارغ إذا لم يتم إدخاله
        message,
        isRead: false, // تعيين الحالة كـ "غير مقروءة" افتراضياً
      },
    })

    // 4. تحديث صفحة الرسائل في لوحة التحكم فوراً
    // هذا السطر مهم جداً لكي يرى الأدمن الرسالة الجديدة بدون تحديث الصفحة
    revalidatePath("/admin/messages")
    
    return { success: true }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error: "Database error occurred" }
  }
}