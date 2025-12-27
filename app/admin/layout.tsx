import type React from "react"
import { cookies } from "next/headers"
import prisma from "@/lib/db"
import AdminSidebar from "@/components/admin/sidebar"
import AdminTopbar from "@/components/admin/topbar"

export const metadata = {
  title: "Admin Dashboard | DaforLance",
  description: "Manage your DaforLance website content",
}

async function getSessionFromCookie() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("admin_session")

    if (!sessionCookie?.value) {
      return null
    }

    const [, encodedData] = sessionCookie.value.split(".")
    if (!encodedData) return null

    const sessionData = JSON.parse(Buffer.from(encodedData, "base64").toString())

    if (Date.now() - sessionData.createdAt > 24 * 60 * 60 * 1000) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionData.userId },
      select: { id: true, email: true, name: true },
    })

    return user
  } catch {
    return null
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionFromCookie()

  // إذا لم يكن هناك session، اعرض المحتوى بدون الـ dashboard wrapper
  // هذا يسمح لصفحة login بالعمل بشكل صحيح
  if (!session) {
    return <>{children}</>
  }

  // المستخدم مسجل دخول، اعرض الـ dashboard layout كامل
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar user={{ email: session.email, name: session.name }} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}