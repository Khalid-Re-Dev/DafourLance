"use client"

import { useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Services from "@/components/services"
import Consultants from "@/components/consultants"
import Projects from "@/components/projects"
import Partners from "@/components/partners"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

interface PageContentClientProps {
  consultants: any[]
  projects: any[]
  partners: any[]
  navItems: any[]
  siteTexts: Record<string, any>
  footerConfig: any
}

export default function PageContentClient({
  consultants,
  projects,
  partners,
  navItems,
  siteTexts,
  footerConfig,
}: PageContentClientProps) {
  const { isRTL, language } = useLanguage()

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [isRTL, language])

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-background overflow-x-hidden">
      <Header navItems={navItems} />
      <Hero siteTexts={siteTexts} />
      <About siteTexts={siteTexts} />
      <Services siteTexts={siteTexts} />
      <Consultants consultants={consultants} siteTexts={siteTexts} />
      <Projects projects={projects} siteTexts={siteTexts} />
      <Partners partners={partners} siteTexts={siteTexts} />
      <Contact siteTexts={siteTexts} footerConfig={footerConfig} />
      <Footer siteTexts={siteTexts} footerConfig={footerConfig} />
    </main>
  )
}
