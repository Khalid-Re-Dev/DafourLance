import { type NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import sharp from "sharp"
import { getSession } from "@/lib/auth"

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  // ── Auth guard ──
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const category = (formData.get("category") as string) || "general"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // ── File type validation ──
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type "${file.type}" is not allowed. Accepted types: JPEG, PNG, WebP, SVG.`,
        },
        { status: 400 },
      )
    }

    // ── File size validation ──
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the 5 MB limit.`,
        },
        { status: 400 },
      )
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
    // Sanitize filename — keep only alphanumeric, hyphens, underscores
    const originalName = file.name.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "_")
    const filename = `${timestamp}-${originalName}.webp`
    
    // تأكد من وجود المجلدات (public/uploads/category)
    // Sanitize category to prevent path traversal
    const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, "")
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeCategory)
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    
    // 4. حفظ الملف فعلياً على جهازك
    await fs.writeFile(filePath, optimizedBuffer)

    // 5. إرجاع الرابط الذي سيستخدمه الموقع لعرض الصورة
    const publicUrl = `/uploads/${safeCategory}/${filename}`

    return NextResponse.json({
      url: publicUrl,
      filename: filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process and save image" }, { status: 500 })
  }
}