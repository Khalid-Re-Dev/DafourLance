import prisma from "@/lib/db"
export const dynamic = "force-dynamic"
export async function GET() {
 try {
  await prisma.user.count()
  await prisma.uploadedImage.findFirst({select:{data:true},where:{id:"health-check"}})
  return Response.json({status:"ok"},{headers:{"Cache-Control":"no-store"}})
 } catch { return Response.json({status:"unavailable"},{status:503,headers:{"Cache-Control":"no-store"}}) }
}
