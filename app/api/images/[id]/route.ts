import prisma from "@/lib/db"
export const runtime = "nodejs"
export async function GET(_request: Request,{params}:{params:Promise<{id:string}>}) {
 const {id}=await params
 if (!/^[a-f0-9-]{36}$/.test(id)) return new Response(null,{status:404})
 try {
  const image=await prisma.uploadedImage.findUnique({where:{id},select:{data:true}})
  if (!image?.data) return new Response(null,{status:404})
  return new Response(new Uint8Array(image.data),{headers:{"Content-Type":"image/webp","Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"}})
 } catch { return new Response(null,{status:503,headers:{"Cache-Control":"no-store"}}) }
}
