import type React from "react"
import { getSession } from "@/lib/auth"
import AdminSidebar from "@/components/admin/sidebar"
import AdminTopbar from "@/components/admin/topbar"

export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin Dashboard | DaforLance",
  description: "Manage your DaforLance website content",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

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