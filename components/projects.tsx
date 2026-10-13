"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import ProjectDetailDialog from "./project-detail-dialog"

interface CMSProject {
  id: string
  titleAr: string
  titleEn: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  fullDescriptionAr?: string | null
  fullDescriptionEn?: string | null
  categoryAr: string | null
  categoryEn: string | null
  imageUrl: string
  galleryImages?: string | null
  ctaLabelAr: string
  ctaLabelEn: string
  ctaLink: string | null
}

interface ProjectsProps {
  projects?: CMSProject[]
  siteTexts?: Record<string, any>
}

export default function Projects({ projects, siteTexts }: ProjectsProps) {
  const { language, isRTL } = useLanguage()
  const [selectedProject, setSelectedProject] = useState<CMSProject | null>(null)

  const [showAll, setShowAll] = useState(false)
  const allProjects = projects ?? []
  const displayProjects = showAll ? allProjects : allProjects.slice(0, 4)
  const DirectionArrow = isRTL ? ArrowLeft : ArrowRight

  return (
    <section id="projects" className="py-14 lg:py-20 bg-[#fef2ee] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-2xl text-start">
            <span className="text-[#fe6a52] text-sm font-bold tracking-wider mb-2 block uppercase">
              {siteTexts?.["projects.sub"]?.[`heading${language.charAt(0).toUpperCase() + language.slice(1)}`] ||
               (language === "ar" ? "سابقة الأعمال" : "OUR PORTFOLIO")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1f2b3b] mb-4">
              {siteTexts?.["projects.main"]?.[`heading${language.charAt(0).toUpperCase() + language.slice(1)}`] ||
               (language === "ar" ? "مشاريعنا المتميزة" : "Featured Projects")}
            </h2>
            <p className="text-[#6b7280] text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
              {siteTexts?.["projects.main"]?.[`body${language.charAt(0).toUpperCase() + language.slice(1)}`] ||
               (language === "ar" ? "نحن فخورون بتقديم حلول مبتكرة تلبي تطلعات عملائنا." : "We are proud to deliver innovative solutions that meet our aspirations.")}
            </p>
          </div>
          {allProjects.length > 4 && (
            <button type="button" onClick={() => setShowAll(value => !value)}
              aria-expanded={showAll} aria-controls="project-grid"
              className="self-start sm:self-auto shrink-0 inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm text-[#1f2b3b] shadow-sm hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#fe6a52]">
              {showAll ? (language === "ar" ? "عرض أقل" : "Show less") : (language === "ar" ? "مشاهدة الكل" : "View all")}
              <DirectionArrow className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </motion.div>
        <motion.div
          id="project-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {displayProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 }
              }}
              className="group flex min-w-0 flex-col bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              {/* صورة المشروع */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img loading="lazy" decoding="async"
                  src={project.imageUrl || "/placeholder.svg"}
                  alt={language === "ar" ? project.titleAr : project.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {(language === "ar" ? project.categoryAr : project.categoryEn) && (
                  <span className="absolute top-3 end-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#fe6a52] shadow-sm">
                    {language === "ar" ? project.categoryAr : project.categoryEn}
                  </span>
                )}
              </div>

              {/* Project summary; full content remains in the dialog. */}
              <div className="flex flex-1 flex-col p-5 text-start">
                <h3 className="text-base font-bold text-[#1f2b3b] mb-2 group-hover:text-[#fe6a52] transition-colors">
                  {language === "ar" ? project.titleAr : project.titleEn}
                </h3>

                {/* التفاصيل التي تم الحفاظ عليها */}
                <p className="text-[#6b7280] leading-relaxed mb-4 line-clamp-2 text-sm">
                  {language === "ar" ? project.shortDescriptionAr : project.shortDescriptionEn}
                </p>

                <button
                  onClick={() => setSelectedProject(project)}
                  type="button" className="mt-auto self-start inline-flex items-center gap-2 text-[#fe6a52] font-medium text-sm rounded focus-visible:outline-2 focus-visible:outline-[#fe6a52]"
                >
                  {(language === "ar" ? project.ctaLabelAr : project.ctaLabelEn) || (language === "ar" ? "عرض التفاصيل" : "View details")}
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectDetailDialog
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  )
}
