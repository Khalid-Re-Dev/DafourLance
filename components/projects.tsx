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

const fallbackProjects = [
  {
    id: "f1",
    titleAr: "مشروع افتراضي 1",
    titleEn: "Default Project 1",
    shortDescriptionAr: "وصف قصير للمشروع الافتراضي يظهر هنا.",
    shortDescriptionEn: "Short description for the default project goes here.",
    imageUrl: "/placeholder.svg",
    categoryAr: "تصميم",
    categoryEn: "Design",
    ctaLabelAr: "التفاصيل",
    ctaLabelEn: "Details",
    ctaLink: "#"
  }
]

export default function Projects({ projects, siteTexts }: ProjectsProps) {
  const { language, isRTL } = useLanguage()
  const [selectedProject, setSelectedProject] = useState<CMSProject | null>(null)

  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects

  return (
    // ✅ تمت إعادة الخلفية الحمراء الخفيفة جداً واللطيفة لتمييز القسم
    <section id="projects" className="py-20 bg-[#fef2ee] overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* ✅ العناوين موسطة تماماً وبنفس ستايل قسم الاستشاريين */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        {/* ✅ كاردات موسطة تلقائياً مهما كان عددها */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 md:gap-10"
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
              className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-[#e5e7eb] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-27px)] max-w-[420px]"
            >
              {/* صورة المشروع */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={project.imageUrl || "/placeholder.svg"}
                  alt={language === "ar" ? project.titleAr : project.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* محتوى الكارد بالتفاصيل الكاملة */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[2px] bg-[#fe6a52]" />
                  <span className="text-[#fe6a52] text-sm font-bold uppercase tracking-widest">
                    {language === "ar" ? project.categoryAr : project.categoryEn}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1f2b3b] mb-4 group-hover:text-[#fe6a52] transition-colors">
                  {language === "ar" ? project.titleAr : project.titleEn}
                </h3>
                
                {/* التفاصيل التي تم الحفاظ عليها */}
                <p className="text-[#6b7280] leading-relaxed mb-8 line-clamp-2 italic text-sm md:text-base">
                  {language === "ar" ? project.shortDescriptionAr : project.shortDescriptionEn}
                </p>
                
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-2 text-[#1f2b3b] font-bold text-sm border-b-2 border-[#fe6a52] pb-1 hover:gap-4 transition-all"
                >
                  {language === "ar" ? project.ctaLabelAr : project.ctaLabelEn}
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