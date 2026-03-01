import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const category = (formData.get("category") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // 1. تحويل الملف إلى Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 2. معالجة وتحويل الصورة إلى WebP
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    // 3. تحديد مسار الحفظ المحلي (داخل مجلد public)
    const timestamp = Date.now()
    const originalName = file.name.split(".")[0]
    const filename = `${timestamp}-${originalName}.webp`
    
    // تأكد من وجود المجلدات (public/uploads/category)
    const uploadDir = path.join(process.cwd(), "public", "uploads", category)
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    
    // 4. حفظ الملف فعلياً على جهازك
    await fs.writeFile(filePath, optimizedBuffer)

    // 5. إرجاع الرابط الذي سيستخدمه الموقع لعرض الصورة
    const publicUrl = `/uploads/${category}/${filename}`

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "فشل في معالجة وحفظ الصورة محلياً" }, { status: 500 })
  }
}