"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface CMSPartner {
  id: string
  nameAr: string
  nameEn: string
  logoUrl: string
  websiteUrl: string | null
}

interface PartnersProps {
  partners?: CMSPartner[]
  siteTexts?: Record<string, any>
}

const fallbackPartners = [
  { name: "قوفي", nameEn: "Qufi", isArabic: true },
  { name: "عبدالصمد القرشي", nameEn: "Abdul Samad", isArabic: true },
  { name: "BLANCO", nameEn: "BLANCO", isArabic: false },
  { name: "Nintendo", nameEn: "Nintendo", isArabic: false },
  { name: "ميني سو", nameEn: "Miniso", isArabic: true },
  { name: "ASSAF", nameEn: "ASSAF", isArabic: false },
  { name: "الـعـمـودي للــعـود", nameEn: "Alamoudi oud", isArabic: true },
  { name: "كينزا", nameEn: "kinza", isArabic: true },
  { name: "نـيـام", nameEn: "Nayam", isArabic: true },
  { name: "لادون", nameEn: "Ladoun", isArabic: true },
]

export default function Partners({ partners = [], siteTexts = {} }: PartnersProps) {
  const { t, isRTL, language } = useLanguage()

  const displayPartners =
    partners.length > 0
      ? partners.map((p) => ({
          name: language === "ar" ? p.nameAr : p.nameEn,
          logoUrl: p.logoUrl,
          websiteUrl: p.websiteUrl,
        }))
      : fallbackPartners.map((p) => ({
          name: language === "ar" ? p.name : p.nameEn,
          logoUrl: null as string | null,
          websiteUrl: null as string | null,
        }))

  const sectionTitle = siteTexts["partners.main"]
    ? language === "ar"
      ? siteTexts["partners.main"].headingAr
      : siteTexts["partners.main"].headingEn
    : t.partners.title

  const sectionDescription = siteTexts["partners.main"]
    ? language === "ar"
      ? siteTexts["partners.main"].bodyAr
      : siteTexts["partners.main"].bodyEn
    : t.partners.description

  return (
    <section id="partners" className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-block text-[#fe6a52] font-semibold text-sm lg:text-base mb-3 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {isRTL ? "شركاؤنا" : "Our Partners"}
          </motion.span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{sectionTitle}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{sectionDescription}</p>
        </motion.div>

        {/* تم تغيير grid إلى flex justify-center للتوسيط */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {displayPartners.slice(0, 5).map((partner, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center h-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-400 cursor-pointer min-w-[140px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08 }}
            >
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="max-h-12 max-w-full object-contain" />
              ) : (
                <span className="text-lg lg:text-xl font-bold text-muted-foreground hover:text-[#1f2b3b] transition-colors">{partner.name}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {displayPartners.slice(5, 10).map((partner, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center h-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-400 cursor-pointer min-w-[140px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 5) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08 }}
            >
              {partner.logoUrl ? (
                <img src={partner.logoUrl} alt={partner.name} className="max-h-12 max-w-full object-contain" />
              ) : (
                <span className="text-lg lg:text-xl font-bold text-muted-foreground hover:text-[#1f2b3b] transition-colors">{partner.name}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-3 mt-10">
          <motion.button className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-[#fe6a52] hover:text-[#fe6a52] transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center hover:border-[#fe6a52] hover:text-[#fe6a52] transition-colors">
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}