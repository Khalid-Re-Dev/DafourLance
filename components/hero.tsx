"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

interface HeroProps {
  siteTexts?: Record<string, any>
}

export default function Hero({ siteTexts = {} }: HeroProps) {
  const { t, isRTL, language } = useLanguage()

  const heroTitle = siteTexts["hero.title"]
    ? language === "ar"
      ? siteTexts["hero.title"].headingAr
      : siteTexts["hero.title"].headingEn
    : `${t.hero.title} ${t.hero.highlight} ${t.hero.titleEnd}`

  const heroDescription = siteTexts["hero.description"]
    ? language === "ar"
      ? siteTexts["hero.description"].bodyAr
      : siteTexts["hero.description"].bodyEn
    : t.hero.description

  const ctaPrimary = siteTexts["hero.cta"]
    ? language === "ar"
      ? siteTexts["hero.cta"].headingAr
      : siteTexts["hero.cta"].headingEn
    : t.hero.cta

  const ctaSecondary = siteTexts["hero.cta"]
    ? language === "ar"
      ? siteTexts["hero.cta"].bodyAr
      : siteTexts["hero.cta"].bodyEn
    : t.hero.secondary

  return (
    <section id="hero" className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`flex flex-col ${isRTL ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12 lg:gap-20`}>
          {/* Image Side with Decorative Elements */}
          <motion.div
            className="relative w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Orange curved dashed border — tight elegant gap around the image */}
            <svg
              viewBox="0 0 400 420"
              className={`absolute ${isRTL ? "-right-3" : "-left-3"} -top-3 w-[300px] h-[350px] lg:w-[365px] lg:h-[425px]`}
              fill="none"
            >
              <motion.path
                d="M340 40 C380 40 390 80 390 120 L390 280 C390 340 340 400 260 400 L140 400 C80 400 40 360 40 300 L40 180 C40 100 80 60 140 40 L340 40"
                stroke="#fe6a52"
                strokeWidth="2.5"
                strokeDasharray="12 8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>

            {/* Main Image — enlarged for better presence */}
            <motion.div
              className="relative z-10 bg-[#f5bc41] rounded-[32px] overflow-hidden w-[280px] h-[330px] lg:w-[340px] lg:h-[400px] shadow-2xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.img
                src="/professional-arab-man-in-blue-shirt-holding-tablet.jpg"
                alt="Professional consultant"
                className="w-full h-full object-cover"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Floating Elements Icons — repositioned for balance */}
            <motion.div
              className={`absolute top-4 ${isRTL ? "right-8 lg:right-2" : "left-8 lg:left-2"} bg-background rounded-full p-3 shadow-xl z-20 border border-border`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <svg className="w-5 h-5 text-[#fe6a52]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>

            <motion.div
              className={`absolute bottom-16 ${isRTL ? "left-6 lg:left-0" : "right-6 lg:right-0"} bg-background rounded-full p-3 shadow-xl z-20 border border-border`}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: -10 }}
            >
              <svg
                className="w-5 h-5 text-[#fe6a52]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </motion.div>

            <motion.div
              className={`absolute top-28 ${isRTL ? "left-4 lg:-left-2" : "right-4 lg:-right-2"} bg-background rounded-full p-3 shadow-xl z-20 border border-border`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
            >
              <svg
                className="w-5 h-5 text-[#fe6a52]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            className={`w-full lg:w-1/2 ${isRTL ? "text-right" : "text-left"}`}
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl lg:text-4xl xl:text-[2.75rem] font-bold text-foreground leading-tight mb-6">
              {siteTexts["hero.title"] ? (
                heroTitle
              ) : (
                <>
                  {t.hero.title} <span className="text-[#fe6a52]">{t.hero.highlight}</span> {t.hero.titleEnd}
                </>
              )}
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
              {heroDescription}
            </p>
            
            <motion.div
              className={`flex flex-wrap gap-4 ${isRTL ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-[#fe6a52]/25 relative overflow-hidden group">
                    <span className="relative z-10">{ctaPrimary}</span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </Button>
                </motion.div>
              */}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-full px-8 py-6 text-base font-medium shadow-lg shadow-[#fe6a52]/25 relative overflow-hidden group"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.querySelector("#services")
                    if (element) {
                      const headerOffset = 80
                      const elementPosition = element.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      })
                    }
                  }}
                >
                  <span className="relative z-10">{ctaSecondary}</span>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}