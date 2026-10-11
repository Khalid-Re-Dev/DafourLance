import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import sharp from "sharp"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/db"
export const runtime = "nodejs"
const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/svg+xml"])
const MAX_INPUT = 5*1024*1024, MAX_OUTPUT=1024*1024, STORAGE_BUDGET=100*1024*1024
export async function POST(request: NextRequest) {
 if (!(await getSession())) return NextResponse.json({error:"Unauthorized"},{status:401})
 try {
  if (Number(request.headers.get("content-length")) > MAX_INPUT+64*1024) return NextResponse.json({error:"Image exceeds 5 MB"},{status:413})
  const form=await request.formData(), file=form.get("file")
  if (!(file instanceof File) || !ALLOWED.has(file.type) || !file.size) return NextResponse.json({error:"Choose a JPEG, PNG, WebP or SVG image"},{status:400})
  if (file.size > MAX_INPUT) return NextResponse.json({error:"Image exceeds 5 MB"},{status:413})
  const data=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:25_000_000}).rotate().resize({width:1920,height:1920,fit:"inside",withoutEnlargement:true}).webp({quality:80}).toBuffer()
  if (data.length>MAX_OUTPUT) return NextResponse.json({error:"Please use a smaller image (optimized limit: 1 MB)"},{status:413})
  const id=randomUUID(), url=`/api/images/${id}`, filename=`${id}.webp`
  const category=String(form.get("category")||"general").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,64)
  const saved=await prisma.$transaction(async tx=>{
   await tx.$queryRaw`SELECT pg_advisory_xact_lock(74219301)::text`
   const usage=await tx.uploadedImage.aggregate({_sum:{size:true},where:{data:{not:null}}})
   if ((usage._sum.size||0)+data.length>STORAGE_BUDGET) return false
   await tx.uploadedImage.create({data:{id,filename,url,category,mimeType:"image/webp",size:data.length,data}})
   return true
  })
  if (!saved) return NextResponse.json({error:"Image storage limit reached (100 MB). Contact the administrator."},{status:507})
  return NextResponse.json({url,filename})
 } catch { return NextResponse.json({error:"Unable to process or store this image. Check the image and database connection."},{status:500}) }
}
