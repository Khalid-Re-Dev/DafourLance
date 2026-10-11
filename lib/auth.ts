import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash, timingSafeEqual } from "node:crypto"
import bcrypt from "bcryptjs"
import prisma from "./db"
import { allowRequest } from "./request-limit"
import { passwordRevision, SESSION_SECONDS, signSession, verifySession } from "./session-token"
export interface Session { userId: string; email: string; name: string | null }
const SESSION_COOKIE_NAME = "admin_session"
export async function hashPassword(password: string): Promise<string> { return bcrypt.hash(password,12) }
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
 if (/^\$2[aby]\$/.test(hashedPassword)) return bcrypt.compare(password, hashedPassword)
 const legacySecret = process.env.LEGACY_AUTH_SECRET
 if (!legacySecret || !/^[a-f0-9]{64}$/.test(hashedPassword)) return false
 return timingSafeEqual(createHash("sha256").update(password+legacySecret).digest(),Buffer.from(hashedPassword,"hex"))
}
export async function migratePasswordToBcrypt(userId: string, password: string): Promise<void> {
 await prisma.user.update({where:{id:userId},data:{password:await hashPassword(password)}})
}
export async function createSession(userId: string): Promise<string> {
 const user = await prisma.user.findUnique({where:{id:userId}})
 if (!user || user.role !== "admin") throw new Error("Unauthorized")
 return signSession(user.id,user.password)
}
export async function getSession(): Promise<Session | null> {
 const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
 if (!token) return null
 const data = verifySession(token)
 if (!data) return null
 try {
  const user = await prisma.user.findUnique({where:{id:data.userId}})
  if (!user || user.role !== "admin" || passwordRevision(user.password) !== data.revision) return null
  return {userId:user.id,email:user.email,name:user.name}
 } catch { return null }
}
export async function requireAuth(): Promise<Session> {
 const session = await getSession()
 if (!session) redirect("/admin/login")
 return session
}
export async function login(email: string,password: string): Promise<{success:boolean;error?:string}> {
 const invalid = {success:false,error:"Invalid credentials"}
 if (!email || email.length > 254 || !password || Buffer.byteLength(password)>72) return invalid
 const bucket = createHash("sha256").update(email.toLowerCase().trim()).digest("hex")
 if (!allowRequest(`login:${bucket}`,10,15*60*1000)) return {success:false,error:"Too many sign-in attempts. Please try again in 15 minutes."}
 try {
  const user = await prisma.user.findUnique({where:{email:email.toLowerCase().trim()}})
  if (!user || user.role !== "admin" || !(await verifyPassword(password,user.password))) return invalid
  if (!/^\$2[aby]\$/.test(user.password)) await migratePasswordToBcrypt(user.id,password)
  const token = await createSession(user.id)
  ;(await cookies()).set(SESSION_COOKIE_NAME,token,{httpOnly:true,secure:process.env.NODE_ENV === "production",sameSite:"lax",maxAge:SESSION_SECONDS,path:"/"})
  return {success:true}
 } catch {
  console.error("Admin login failed: check database and AUTH_SECRET configuration")
  return {success:false,error:"Sign in is temporarily unavailable. Please try again."}
 }
}
export async function logout(): Promise<void> { ;(await cookies()).delete(SESSION_COOKIE_NAME) }
