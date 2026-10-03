"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Handshake,
  Sparkles,
  Navigation,
  FileText,
  Settings,
  ChevronRight,
  Mail,        // تم إضافة استيراد أيقونة الرسائل
  PhoneCall,   // تم إضافة استيراد أيقونة معلومات التواصل
  PanelBottom, // تم إضافة استيراد أيقونة الفوتر
  Brain,       // أيقونة قاعدة معرفة الذكاء الاصطناعي
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Consultants", href: "/admin/consultants", icon: Users },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Partners", href: "/admin/partners", icon: Handshake },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Navigation", href: "/admin/navigation", icon: Navigation },
  { label: "Content", href: "/admin/content", icon: FileText },
  
  // --- الأقسام الجديدة المضافة ---
  { label: "Messages", href: "/admin/messages", icon: Mail }, 
  { label: "Contact Info", href: "/admin/contact-info", icon: PhoneCall },
  { label: "Footer Settings", href: "/admin/footer", icon: PanelBottom },
  { label: "AI Knowledge Base", href: "/admin/ai-content", icon: Brain },
  // -----------------------------

  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-[#e5e7eb] min-h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-[#e5e7eb]">
        <Link href="/admin" className="flex items-center gap-2">
          <svg viewBox="0 0 40 40" className="w-9 h-9">
            <circle cx="20" cy="20" r="18" fill="#fe6a52" />
            <path d="M14 20 Q20 12 26 20 Q20 28 14 20" fill="white" />
          </svg>
          <div>
            <span className="text-lg font-bold text-[#1f2b3b]">
              Dafor<span className="text-[#fe6a52]">L</span>ance
            </span>
            <span className="block text-xs text-[#9ca3af] -mt-0.5">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#fe6a52]/10 text-[#fe6a52]"
                    : "text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#1f2b3b]",
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#e5e7eb]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#6b7280] hover:text-[#fe6a52] transition-colors"
        >
          <span>View Live Site</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  )
}