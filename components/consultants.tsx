"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import ConsultantDetailModal from "@/components/consultant-detail-modal"

interface CMSConsultant {
  id: string
  nameAr: string
  nameEn: string
  roleAr: string
  roleEn: string
  descriptionAr: string | null
  descriptionEn: string | null
  imageUrl: string | null
  isFeatured: boolean
}

interface ConsultantsProps {
  consultants?: CMSConsultant[]
  siteTexts?: Record<string, any>
}

// Fallback static data
const fallbackConsultantData = {
  ar: [
    { name: "محمد عبدالرحيم", role: "مصمم واجهة وتجربة المستخدم" },
    { name: "فهد أحمد", role: "مصمم واجهة وتجربة المستخدم" },
    { name: "حسن محمد", role: "مصمم واجهة وتجربة المستخدم" },
    { name: "محمد خالد", role: "مصمم واجهة وتجربة المستخدم" },
  ],
  en: [
    { name: "Mohammed Abdulrahim", role: "UI/UX Designer" },
    { name: "Fahd Ahmed", role: "UI/UX Designer" },
    { name: "Hassan Mohammed", role: "UI/UX Designer" },
    { name: "Mohammed Khaled", role: "UI/UX Designer" },
  ],
}

function ConsultantCard({
  consultant,
  language,
  t,
  onViewDetails,
}: {
  consultant: {
    name: string
    role: string
    description?: string
    imageUrl?: string | null
  }
  language: "ar" | "en"
  t: any
  onViewDetails: () => void
}) {
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)

  return (
    <motion.div
      className="relative bg-white overflow-hidden cursor-pointer rounded-[24px] shadow-[0_10px_35px_rgba(0,0,0,0.12)]"
      style={{ aspectRatio: "0.60" }}
      onHoverStart={() => setIsCardHovered(true)}
      onHoverEnd={() => setIsCardHovered(false)}
      whileHover={{
        y: -6,
        boxShadow: "0 16px 50px rgba(0,0,0,0.18)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 0 }}
      >
        <polygon points="0,0 100,0 100,40 0,50" fill="#1f2b3b" />
        <polygon points="0,50 100,40 100,41.5 0,51.5" fill="#fe6a52" />
        <polygon points="0,51.5 100,41.5 100,100 0,100" fill="#ffffff" />
      </svg>

      <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ top: "18%" }}>
        <motion.div
          className="bg-[#1f2b3b] flex items-center justify-center border-[3px] border-white w-[160px] h-[160px] rounded-[22px] shadow-[0_8px_25px_rgba(0,0,0,0.25)] overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {consultant.imageUrl ? (
            <img
              src={consultant.imageUrl || "/placeholder.svg"}
              alt={consultant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg width="58" height="58" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7.5" r="3.5" fill="white" />
              <ellipse cx="12" cy="17" rx="7" ry="4.5" fill="white" />
            </svg>
          )}
        </motion.div>
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 flex flex-col items-center text-center px-5 pb-6 z-[1]"
        style={{ top: "50%" }}
      >
        <h3 className="text-[#1f2b3b] font-bold text-lg mt-8">{consultant.name}</h3>

        <div className="mt-2.5 px-4 py-1.5 bg-[#fff0eb] rounded-full">
          <span className="text-[#fe6a52] text-xs font-medium">{consultant.role}</span>
        </div>

        <p className="text-[#6b7280] leading-relaxed mt-3.5 text-xs line-clamp-3 px-1">
          {consultant.description || t.consultants.cardDescription}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: isCardHovered ? 1 : 0,
            y: isCardHovered ? 0 : 15,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails()
            }}
            className="relative mt-4 w-full max-w-[180px] py-2.5 bg-[#fe6a52] text-white text-sm font-semibold rounded-full shadow-md overflow-hidden"
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 6px 20px rgba(254, 106, 82, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ transform: "skewX(-20deg)" }}
              initial={{ x: "-150%" }}
              animate={{ x: isButtonHovered ? "150%" : "-150%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">{t.consultants.viewDetails}</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Consultants({ consultants = [], siteTexts = {} }: ConsultantsProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedConsultant, setSelectedConsultant] = useState<CMSConsultant | null>(null)
  const { t, language } = useLanguage()

  // Keep the full CMS objects for the modal, build display objects for the cards
  const hasCMSData = consultants.length > 0

  const displayConsultants = hasCMSData
    ? consultants.map((c) => ({
        id: c.id,
        name: language === "ar" ? c.nameAr : c.nameEn,
        role: language === "ar" ? c.roleAr : c.roleEn,
        description: language === "ar" ? c.descriptionAr || "" : c.descriptionEn || "",
        imageUrl: c.imageUrl,
      }))
    : fallbackConsultantData[language].map((c, i) => ({
        id: `fallback-${i}`,
        ...c,
        description: t.consultants.cardDescription,
        imageUrl: null,
      }))

  const sectionTitle = siteTexts["consultants.main"]
    ? language === "ar"
      ? siteTexts["consultants.main"].headingAr
      : siteTexts["consultants.main"].headingEn
    : t.consultants.title

  const sectionDescription = siteTexts["consultants.main"]
    ? language === "ar"
      ? siteTexts["consultants.main"].bodyAr
      : siteTexts["consultants.main"].bodyEn
    : t.consultants.description

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  function handleViewDetails(index: number) {
    if (hasCMSData && consultants[index]) {
      setSelectedConsultant(consultants[index])
    }
  }

  return (
    <section
      id="consultants"
      className="py-20 lg:py-28"
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 50%, #f0f1f3 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl lg:text-[40px] font-bold text-[#1f2b3b] mb-5">{sectionTitle}</h2>
          <p className="text-[#6b7280] text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">{sectionDescription}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {displayConsultants.slice(0, 4).map((consultant, index) => (
            <motion.div key={consultant.id} variants={cardVariants}>
              <ConsultantCard
                consultant={consultant}
                language={language}
                t={t}
                onViewDetails={() => handleViewDetails(index)}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center gap-2.5 mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {[0, 1, 2, 3].map((dot) => (
            <motion.button
              key={dot}
              onClick={() => setActiveSlide(dot)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === dot ? "bg-[#fe6a52] w-7" : "bg-[#d9d9d9] hover:bg-[#c0c0c0] w-2.5"
              }`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </motion.div>
      </div>

      {/* Consultant Detail Modal */}
      <ConsultantDetailModal
        consultant={selectedConsultant}
        isOpen={!!selectedConsultant}
        onClose={() => setSelectedConsultant(null)}
      />
    </section>
  )
}
