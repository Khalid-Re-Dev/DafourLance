import { Suspense } from "react"
import ServiceIcon from "@/components/service-icon"
import { notFound } from "next/navigation"
import { localizedMetadata, siteOrigin } from "@/lib/seo"
import { getConsultants, getProjects, getPartners, getServices, getNavItems, getAllSiteTexts, getFooterConfig } from "@/lib/cms"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return localizedMetadata(lang === 'en' ? 'en' : 'ar')
}
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (lang !== 'ar' && lang !== 'en') notFound()
  const origin = siteOrigin()
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
    <>
      {origin && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization', name: 'Dafourlance', url: origin,
      }).replace(/</g, '\\u003c') }} />}
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <PageContent
          consultants={consultants}
          projects={projects}
          partners={partners}
          services={services.map(service => ({ ...service, iconNode: <ServiceIcon name={service.icon} /> }))}
          navItems={navItems}
          siteTexts={siteTexts}
          footerConfig={footerConfig}
        />
      </Suspense>
    </>
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
