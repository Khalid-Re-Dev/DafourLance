"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import Logo from "@/components/logo"

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

  // تجهيز روابط التنقل بناءً على اللغة المختارة
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
    if (isExternal) return

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
      // تم تعديل py-4 إلى py-2.5 لتعويض تكبير الشعار والحفاظ على ارتفاع الهيدر ثابتًا
      className="bg-background/95 backdrop-blur-md py-2.5 px-6 lg:px-12 sticky top-0 z-50 border-b border-border/50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* قسم الشعار */}
        <motion.a
          href="#"
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Logo variant="header" />
        </motion.a>

        {/* روابط التنقل للشاشات الكبيرة */}
        <nav className="hidden lg:flex items-center gap-8">
          {displayNavItems.map((item, index) => (
            <motion.a
              key={item.href + index}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              onClick={(e) => handleNavClick(e, item.href, item.isExternal)}
              className="relative font-medium transition-colors text-muted-foreground hover:text-[#fe6a52]"
              whileHover={{ y: -2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* الجهة اليمنى (زر اللغة وزر التواصل) */}
        <div className="hidden lg:flex items-center gap-4">
          <motion.button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">{language === "ar" ? "English" : "العربية"}</span>
            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
          </motion.button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-[#fe6a52] hover:bg-[#e55a42] text-white rounded-full px-6 font-medium shadow-lg shadow-[#fe6a52]/20"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t.nav.contact}
            </Button>
          </motion.div>
        </div>

        {/* زر القائمة للجوال */}
        <button
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* قائمة الجوال المنسدلة */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 pb-4 border-t pt-4 overflow-hidden bg-background"
          >
            <nav className="flex flex-col gap-4">
              {displayNavItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="font-medium text-muted-foreground px-2 hover:text-[#fe6a52]"
                  onClick={(e) => handleNavClick(e, item.href, item.isExternal)}
                  initial={{ x: isRTL ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t px-2">
                <Button className="bg-[#fe6a52] text-white rounded-full w-full">
                  {t.nav.contact}
                </Button>
                <button
                  onClick={toggleLanguage}
                  className="w-full px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  {language === "ar" ? "Switch to English" : "التحويل للعربية"}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
} 