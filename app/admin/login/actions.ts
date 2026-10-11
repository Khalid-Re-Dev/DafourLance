"use server"
import { redirect } from "next/navigation"
import { login, logout } from "@/lib/auth"
export async function loginAction(formData: FormData) {
 const email=formData.get("email"), password=formData.get("password")
 if (typeof email !== "string" || typeof password !== "string") return {success:false,error:"Invalid credentials"}
 return login(email,password)
}
export async function logoutAction(): Promise<void> { await logout(); redirect("/admin/login") }
