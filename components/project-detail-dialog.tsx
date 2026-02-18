"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

interface Project {
  id: string
  titleAr: string
  titleEn: string
  shortDescriptionAr: string
  shortDescriptionEn: string
  fullDescriptionAr?: string | null
  fullDescriptionEn?: string | null
  categoryAr?: string | null
  categoryEn?: string | null
  imageUrl: string
  galleryImages?: string | null
  ctaLabelAr: string
  ctaLabelEn: string
  ctaLink?: string | null
}

interface ProjectDetailDialogProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectDetailDialog({ project, isOpen, onClose }: ProjectDetailDialogProps) {
  const { language, isRTL } = useLanguage()

  if (!project) return null

  const title = language === "ar" ? project.titleAr : project.titleEn
  const fullDescription = language === "ar" ? project.fullDescriptionAr : project.fullDescriptionEn
  const shortDescription = language === "ar" ? project.shortDescriptionAr : project.shortDescriptionEn
  const category = language === "ar" ? project.categoryAr : project.categoryEn
  const ctaLabel = language === "ar" ? project.ctaLabelAr : project.ctaLabelEn

  // معالجة صور المعرض من نص JSON إلى مصفوفة
  let gallery: string[] = []
  try {
    if (project.galleryImages) {
      gallery = JSON.parse(project.galleryImages)
    }
  } catch (e) {
    console.error("Failed to parse gallery images", e)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* الخلفية المظلمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          
          {/* محتوى النافذة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col"
          >
            {/* الهيدر مع زر الإغلاق */}
            <div className="relative h-64 md:h-80 shrink-0">
              <img src={project.imageUrl} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className={`absolute bottom-6 px-8 w-full ${isRTL ? "text-right" : "text-left"}`}>
                <span className="inline-block px-3 py-1 bg-[#fe6a52] text-white text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                  {category || (language === "ar" ? "مشروع" : "Project")}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{title}</h2>
              </div>
            </div>

            {/* الجسم القابل للتمرير */}
            <div className={`flex-1 overflow-y-auto p-6 md:p-8 ${isRTL ? "text-right" : "text-left"}`}>
              <div className="space-y-8">
                {/* الوصف */}
                <section>
                  <h3 className="text-lg font-bold text-[#1f2b3b] mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#fe6a52] rounded-full" />
                    {language === "ar" ? "عن المشروع" : "About the Project"}
                  </h3>
                  <div className="text-[#6b7280] leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                    {fullDescription || shortDescription}
                  </div>
                </section>

                {/* معرض الصور بتنسيق شبكة احترافي */}
                {gallery.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-[#1f2b3b] mb-4 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-[#fe6a52]" />
                      {language === "ar" ? "معرض الصور" : "Gallery"}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {gallery.map((img, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          className="aspect-square rounded-xl overflow-hidden border border-[#e5e7eb] shadow-sm"
                        >
                          <img 
                            src={img} 
                            alt={`${title} gallery ${index + 1}`} 
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => window.open(img, '_blank')}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* الفوتر - زر الـ CTA */}
            {project.ctaLink && (
              <div className="p-6 border-t border-[#e5e7eb] bg-[#f9fafb] shrink-0">
                <Button
                  asChild
                  className="w-full bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-full py-6 text-lg font-bold gap-2 shadow-lg shadow-[#fe6a52]/20 transition-all"
                >
                  <a href={project.ctaLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                    {ctaLabel}
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}