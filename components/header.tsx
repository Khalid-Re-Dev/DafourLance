"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

interface NavItem {
  id: string
  labelAr: string
  labelEn: string
  href: string
  isExternal: boolean
}

interface HeaderProps {
  navItems?: NavItem[]
}

export default function Header({ navItems = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, t, toggleLanguage, isRTL } = useLanguage()

  const displayNavItems =
    navItems.length > 0
      ? navItems.map((item) => ({
          label: language === "ar" ? item.labelAr : item.labelEn,
          href: item.href,
          isExternal: item.isExternal,
        }))
      : [
          { label: t.nav.home, href: "#", isExternal: false },
          { label: t.nav.about, href: "#about", isExternal: false },
          { label: t.nav.services, href: "#services", isExternal: false },
          { label: t.nav.consultants, href: "#consultants", isExternal: false },
          { label: t.nav.projects, href: "#projects", isExternal: false },
        ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isExternal: boolean) => {
    if (isExternal) return // Let external links work normally

    if (href.startsWith("#") && href !== "#") {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
      setMobileMenuOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-background/95 backdrop-blur-md py-4 px-6 lg:px-12 sticky top-0 z-50 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <circle cx="20" cy="20" r="18" fill="#fe6a52" />
            <path d="M14 20 Q20 12 26 20 Q20 28 14 20" fill="white" />
          </svg>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Dafor<span className="text-[#fe6a52]">L</span>ance
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {displayNavItems.map((item, index) => (
            <motion.a
              key={item.href + index}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              onClick={(e) => handleNavClick(e, item.href, item.isExternal)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="relative font-medium transition-colors text-muted-foreground hover:text-[#fe6a52]"
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-full px-6 font-medium shadow-lg shadow-[#fe6a52]/20 relative overflow-hidden group"
              onClick={(e) => {
                e.preventDefault()
                const contactSection = document.querySelector("#contact")
                if (contactSection) {
                  const headerOffset = 80
                  const elementPosition = contactSection.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" })
                }
              }}
            >
              <span className="relative z-10">{t.nav.contact}</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            </Button>
          </motion.div>

          <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">{language === "ar" ? "English" : "العربية"}</span>
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 rounded-lg hover:bg-muted/50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 pb-4 border-t pt-4 overflow-hidden"
          >
            <nav className="flex flex-col gap-4">
              {displayNavItems.map((item, index) => (
                <motion.a
                  key={item.href + index}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  onClick={(e) => handleNavClick(e, item.href, item.isExternal)}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="font-medium text-muted-foreground"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button className="bg-[#fe6a52] text-white rounded-full flex-1">{t.nav.contact}</Button>
                <button onClick={toggleLanguage} className="px-4 py-2 rounded-full border border-border text-sm">
                  {language === "ar" ? "English" : "العربية"}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
