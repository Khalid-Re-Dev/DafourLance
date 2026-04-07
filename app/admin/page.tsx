import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, FolderKanban, Handshake, Navigation, FileText, ArrowRight } from "lucide-react"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"

async function getStats() {
  const [consultantsCount, projectsCount, partnersCount, navItemsCount] = await Promise.all([
    prisma.consultant.count(),
    prisma.project.count(),
    prisma.partner.count(),
    prisma.navItem.count(),
  ])

  return { consultantsCount, projectsCount, partnersCount, navItemsCount }
}

export default async function AdminDashboard() {
  const session = await getSession()
  
  if (!session) {
    redirect("/admin/login")
  }

  const stats = await getStats()

  const quickLinks = [
    {
      title: "Consultants",
      description: "Manage consultant profiles",
      count: stats.consultantsCount,
      icon: Users,
      href: "/admin/consultants",
      color: "#fe6a52",
    },
    {
      title: "Projects",
      description: "Manage project showcase",
      count: stats.projectsCount,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "#7cb798",
    },
    {
      title: "Partners",
      description: "Manage partner logos",
      count: stats.partnersCount,
      icon: Handshake,
      href: "/admin/partners",
      color: "#f5c842",
    },
    {
      title: "Navigation",
      description: "Edit menu items",
      count: stats.navItemsCount,
      icon: Navigation,
      href: "/admin/navigation",
      color: "#6366f1",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2b3b]">Dashboard Overview</h1>
        <p className="text-[#6b7280] mt-1">Manage all your website content from one place</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb] hover:shadow-md hover:border-[#d1d5db] transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span className="text-3xl font-bold text-[#1f2b3b]">{item.count}</span>
                </div>
                <h3 className="font-semibold text-[#1f2b3b] group-hover:text-[#fe6a52] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#9ca3af] mt-0.5">{item.description}</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-medium text-[#fe6a52] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Manage</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Content Management Card */}
      <Link href="/admin/content">
        <div className="bg-gradient-to-br from-[#1f2b3b] to-[#2d3b4f] rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Content Management</h3>
              <p className="text-white/70 mt-1">
                Edit all text content across your landing page - Hero, About, Services, and more
              </p>
            </div>
            <ArrowRight className="w-6 h-6 text-white/50" />
          </div>
        </div>
      </Link>

      {/* Quick Tips */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb]">
        <h2 className="text-lg font-semibold text-[#1f2b3b] mb-4">Quick Tips</h2>
        <ul className="space-y-3 text-[#6b7280]">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[#fe6a52] rounded-full mt-2" />
            <span>
              Use the <strong>Consultants</strong> section to add or edit team member profiles
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[#fe6a52] rounded-full mt-2" />
            <span>
              The <strong>Content</strong> section lets you edit all text on your landing page
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[#fe6a52] rounded-full mt-2" />
            <span>
              All fields support both <strong>Arabic</strong> and <strong>English</strong> content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-[#fe6a52] rounded-full mt-2" />
            <span>Changes are saved to the database and reflected on the live site immediately</span>
          </li>
        </ul>
      </div>
    </div>
  )
}