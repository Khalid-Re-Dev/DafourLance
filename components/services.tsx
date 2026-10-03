"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ServiceData {
  id: string
  icon: string
  titleAr: string
  titleEn: string
  descriptionAr: string | null
  descriptionEn: string | null
  order: number
  isActive: boolean
  isFeatured: boolean
}

interface ServicesProps {
  siteTexts?: Record<string, any>
  services?: ServiceData[]
}

function getIconComponent(name: string): LucideIcon {
  return (LucideIcons[name as keyof typeof LucideIcons] as LucideIcon) ?? LucideIcons.Sparkles
}

function ServiceCard({
  service,
  index,
  isRTL,
  language,
}: {
  service: ServiceData
  index: number
  isRTL: boolean
  language: "ar" | "en"
}) {
  const Icon = getIconComponent(service.icon)
  const title = language === "ar" ? service.titleAr : service.titleEn
  const description = language === "ar" ? (service.descriptionAr || "") : (service.descriptionEn || "")

  return (
    <motion.div
      className="group relative bg-white rounded-[20px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(254,106,82,0.15)] transition-all duration-500 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe6a52]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]" />

      <motion.div
        className="relative w-14 h-14 lg:w-16 lg:h-16 bg-[#fef2ee] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#fe6a52] transition-colors duration-400"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-[#fe6a52] group-hover:text-white transition-colors duration-400" aria-hidden="true" />
      </motion.div>

      <div className={isRTL ? "text-right" : "text-left"}>
        <h3 className="text-lg lg:text-xl font-bold text-[#1f2b3b] mb-3 group-hover:text-[#fe6a52] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[#6b7280] text-sm lg:text-[15px] leading-relaxed">{description}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6a52] to-[#f5c842] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rtl:origin-right" />
    </motion.div>
  )
}

export default function Services({ siteTexts = {}, services = [] }: ServicesProps) {
  const { t, language, isRTL } = useLanguage()

  const servicesMain = siteTexts["services.main"]
  const sectionTitle = servicesMain
    ? language === "ar"
      ? servicesMain.headingAr
      : servicesMain.headingEn
    : t.services.title
  const sectionDescription = servicesMain
    ? language === "ar"
      ? servicesMain.bodyAr
      : servicesMain.bodyEn
    : t.services.description

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <section id="services" className="py-14 lg:py-20 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center mb-14 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.span
            className="inline-block text-[#fe6a52] font-semibold text-sm lg:text-base mb-3 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {language === "ar" ? "" : "What We Offer"}
          </motion.span>
          <h2 className="text-3xl lg:text-[42px] font-bold text-[#1f2b3b] mb-5">{sectionTitle}</h2>
          <p className="text-[#6b7280] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">{sectionDescription}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} isRTL={isRTL} language={language} />
          ))}
        </div>
      </div>
    </section>
  )
}
