import { Suspense } from "react"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { getConsultants, getProjects, getPartners, getNavItems, getAllSiteTexts } from "@/lib/cms"

export default async function Home() {
  // Fetch all CMS data in parallel
  const [consultants, projects, partners, navItems, siteTexts] = await Promise.all([
    getConsultants(),
    getProjects(),
    getPartners(),
    getNavItems(),
    getAllSiteTexts(),
  ])

  return (
    <LanguageProvider>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <PageContent
          consultants={consultants}
          projects={projects}
          partners={partners}
          navItems={navItems}
          siteTexts={siteTexts}
        />
      </Suspense>
    </LanguageProvider>
  )
}

function PageContent({
  consultants,
  projects,
  partners,
  navItems,
  siteTexts,
}: {
  consultants: Awaited<ReturnType<typeof getConsultants>>
  projects: Awaited<ReturnType<typeof getProjects>>
  partners: Awaited<ReturnType<typeof getPartners>>
  navItems: Awaited<ReturnType<typeof getNavItems>>
  siteTexts: Awaited<ReturnType<typeof getAllSiteTexts>>
}) {
  return (
    <PageContentClient
      consultants={consultants}
      projects={projects}
      partners={partners}
      navItems={navItems}
      siteTexts={siteTexts}
    />
  )
}

// Client component to handle RTL/language effects
import PageContentClient from "@/components/page-content-client"
