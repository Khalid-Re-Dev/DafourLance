import { Suspense } from "react"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { getConsultants, getProjects, getPartners, getServices, getNavItems, getAllSiteTexts, getFooterConfig } from "@/lib/cms"

export default async function Home() {
  // Fetch all CMS data in parallel
  const [consultants, projects, partners, services, navItems, siteTexts, footerConfig] = await Promise.all([
    getConsultants(),
    getProjects(),
    getPartners(),
    getServices(),
    getNavItems(),
    getAllSiteTexts(),
    getFooterConfig(),
  ])

  return (
    <LanguageProvider>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <PageContent
          consultants={consultants}
          projects={projects}
          partners={partners}
          services={services}
          navItems={navItems}
          siteTexts={siteTexts}
          footerConfig={footerConfig}
        />
      </Suspense>
    </LanguageProvider>
  )
}

function PageContent({
  consultants,
  projects,
  partners,
  services,
  navItems,
  siteTexts,
  footerConfig,
}: {
  consultants: Awaited<ReturnType<typeof getConsultants>>
  projects: Awaited<ReturnType<typeof getProjects>>
  partners: Awaited<ReturnType<typeof getPartners>>
  services: Awaited<ReturnType<typeof getServices>>
  navItems: Awaited<ReturnType<typeof getNavItems>>
  siteTexts: Awaited<ReturnType<typeof getAllSiteTexts>>
  footerConfig: Awaited<ReturnType<typeof getFooterConfig>>
}) {
  return (
    <PageContentClient
      consultants={consultants}
      projects={projects}
      partners={partners}
      services={services}
      navItems={navItems}
      siteTexts={siteTexts}
      footerConfig={footerConfig}
    />
  )
}

// Client component to handle RTL/language effects
import PageContentClient from "@/components/page-content-client"
