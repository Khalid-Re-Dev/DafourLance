"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface CMSProject {
  id: string
  titleAr: string
  titleEn: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  categoryAr: string | null
  categoryEn: string | null
  imageUrl: string
  ctaLabelAr: string
  ctaLabelEn: string
  ctaLink: string | null
}

interface ProjectsProps {
  projects?: CMSProject[]
  siteTexts?: Record<string, any>
}

// Fallback static data
const fallbackProjectsData = {
  ar: [
    {
      id: "1",
      title: "منصة التجارة الإلكترونية",
      description: "متجر إلكتروني متكامل مع نظام دفع آمن وتجربة تسوق سلسة",
      image: "/ecommerce-platform-dark-modern-interface.jpg",
      category: "تطوير ويب",
      ctaLabel: "عرض التفاصيل",
    },
    {
      id: "2",
      title: "تطبيق إدارة المهام",
      description: "تطبيق ذكي لإدارة المشاريع والمهام بواجهة عصرية وسهلة",
      image: "/task-management-app-colorful-ui-dashboard.jpg",
      category: "تطبيقات",
      ctaLabel: "عرض التفاصيل",
    },
    {
      id: "3",
      title: "موقع الشركة التعريفي",
      description: "موقع احترافي يعكس هوية الشركة ويعرض خدماتها بشكل مميز",
      image: "/corporate-website-modern-sleek-design.jpg",
      category: "تصميم UI/UX",
      ctaLabel: "عرض التفاصيل",
    },
    {
      id: "4",
      title: "لوحة تحكم تحليلية",
      description: "لوحة تحكم متقدمة لتحليل البيانات وعرض الإحصائيات بشكل مرئي",
      image: "/analytics-dashboard-charts-graphs-dark-theme.jpg",
      category: "تحليل بيانات",
      ctaLabel: "عرض التفاصيل",
    },
  ],
  en: [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "A complete online store with secure payment system and seamless shopping experience",
      image: "/ecommerce-platform-dark-modern-interface.jpg",
      category: "Web Development",
      ctaLabel: "View Details",
    },
    {
      id: "2",
      title: "Task Management App",
      description: "Smart application for managing projects and tasks with a modern interface",
      image: "/task-management-app-colorful-ui-dashboard.jpg",
      category: "Applications",
      ctaLabel: "View Details",
    },
    {
      id: "3",
      title: "Corporate Website",
      description: "Professional website that reflects the company identity",
      image: "/corporate-website-modern-sleek-design.jpg",
      category: "UI/UX Design",
      ctaLabel: "View Details",
    },
    {
      id: "4",
      title: "Analytics Dashboard",
      description: "Advanced dashboard for data analysis and visual statistics",
      image: "/analytics-dashboard-charts-graphs-dark-theme.jpg",
      category: "Data Analytics",
      ctaLabel: "View Details",
    },
  ],
}

function ProjectCard({
  project,
  index,
  isRTL,
}: {
  project: {
    title: string
    description: string
    image: string
    category: string
    ctaLabel: string
    ctaLink?: string | null
  }
  index: number
  isRTL: boolean
}) {
  return (
    <motion.div
      className="group relative bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(31,43,59,0.15)] transition-all duration-500 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
    >
      <div className="relative h-48 lg:h-52 overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2b3b]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <motion.div
          className={`absolute top-4 ${isRTL ? "right-4" : "left-4"} bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full`}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <span className="text-[#fe6a52] text-xs font-semibold">{project.category}</span>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1 }}
        >
          <motion.button
            className="bg-white text-[#1f2b3b] px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:bg-[#fe6a52] hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {project.ctaLabel}
          </motion.button>
        </motion.div>
      </div>

      <div className={`p-6 ${isRTL ? "text-right" : "text-left"}`}>
        <h3 className="text-lg lg:text-xl font-bold text-[#1f2b3b] mb-2 group-hover:text-[#fe6a52] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-[#6b7280] text-sm leading-relaxed mb-5">{project.description}</p>
        <motion.button
          className={`flex items-center gap-2 text-[#fe6a52] font-semibold text-sm group/btn ${isRTL ? "flex-row-reverse" : ""}`}
          whileHover={{ x: isRTL ? -5 : 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span className="border-b-2 border-transparent group-hover/btn:border-[#fe6a52] transition-all duration-300">
            {project.ctaLabel}
          </span>
          {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function Projects({ projects = [], siteTexts = {} }: ProjectsProps) {
  const { t, language, isRTL } = useLanguage()
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const displayProjects =
    projects.length > 0
      ? projects.map((p) => ({
          id: p.id,
          title: language === "ar" ? p.titleAr : p.titleEn,
          description: language === "ar" ? p.shortDescriptionAr : p.shortDescriptionEn,
          category: language === "ar" ? p.categoryAr || "" : p.categoryEn || "",
          image: p.imageUrl,
          ctaLabel: language === "ar" ? p.ctaLabelAr : p.ctaLabelEn,
          ctaLink: p.ctaLink,
        }))
      : fallbackProjectsData[language]

  const sectionTitle = siteTexts["projects.main"]
    ? language === "ar"
      ? siteTexts["projects.main"].headingAr
      : siteTexts["projects.main"].headingEn
    : t.projects.title

  const sectionDescription = siteTexts["projects.main"]
    ? language === "ar"
      ? siteTexts["projects.main"].bodyAr
      : siteTexts["projects.main"].bodyEn
    : t.projects.description

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section id="projects" className="py-20 lg:py-28 bg-[#fef2ee]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-14 gap-6"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <motion.span
              className="inline-block text-[#fe6a52] font-semibold text-sm lg:text-base mb-3 tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {language === "ar" ? "أعمالنا" : "Our Work"}
            </motion.span>
            <h2 className="text-3xl lg:text-[42px] font-bold text-[#1f2b3b] mb-4">{sectionTitle}</h2>
            <p className="text-[#6b7280] text-base lg:text-lg max-w-xl leading-relaxed">{sectionDescription}</p>
          </div>
          <motion.button
            className={`flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg text-[#1f2b3b] font-semibold transition-all duration-300 group ${isRTL ? "flex-row-reverse" : ""}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{t.projects.viewAll}</span>
            <Arrow className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {displayProjects.slice(0, 4).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  )
}
