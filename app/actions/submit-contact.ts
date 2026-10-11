"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

import { z } from "zod"
import { allowRequest } from "@/lib/request-limit"
const contactSchema=z.object({firstName:z.string().trim().min(1).max(100),lastName:z.string().trim().min(1).max(100),
 email:z.string().trim().email().max(254),phone:z.string().trim().max(50).optional(),message:z.string().trim().min(1).max(5000)})
export async function submitContactForm(formData: FormData) {
  if (!allowRequest("contact:global",20,60_000)) return {success:false,error:"Please try again shortly"}
  const parsed=contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return {success:false,error:"Please check the contact fields"}
  const {firstName,lastName,email,phone,message}=parsed.data

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