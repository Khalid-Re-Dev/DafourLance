"use client"

import { motion } from "framer-motion"
import { Youtube, Linkedin } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// <CHANGE> Added siteTexts prop interface
interface FooterProps {
  siteTexts?: Record<string, any>
}

export default function Footer({ siteTexts = {} }: FooterProps) {
  const { t, language, isRTL } = useLanguage()

  // <CHANGE> Get footer description from CMS if available
  const footerMain = siteTexts["footer.main"]
  const footerDescription = footerMain
    ? language === "ar"
      ? footerMain.bodyAr
      : footerMain.bodyEn
    : t.footer.description

  const quickLinks = [
    { label: t.nav.home, href: "#" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.members, href: "#members" },
  ]

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    {
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: "#",
      label: "X",
    },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  return (
    <footer className="bg-[#1f2b3b] text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? "justify-end flex-row-reverse" : "justify-start"}`}>
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="18" fill="#fe6a52" />
                <path d="M14 20 Q20 12 26 20 Q20 28 14 20" fill="white" />
              </svg>
              <span className="text-xl font-bold">
                Dafor<span className="text-[#fe6a52]">L</span>ance
              </span>
            </div>
            <p className="text-[#9ea5ae] text-sm leading-relaxed">{footerDescription}</p>
          </div>

          <div className={isRTL ? "text-right" : "text-left"}>
            <h4 className="font-bold text-lg mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 text-[#9ea5ae]">
              {quickLinks.map((link, index) => (
                <motion.li key={index} whileHover={{ x: isRTL ? -5 : 5 }}>
                  <a href={link.href} className="hover:text-[#fe6a52] transition-colors">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className={isRTL ? "text-right" : "text-left"}>
            <h4 className="font-bold text-lg mb-4">{t.footer.contactUs}</h4>
            <ul className="space-y-3 text-[#9ea5ae]">
              <li>email@email.com</li>
              <li dir="ltr" className={isRTL ? "text-right" : "text-left"}>
                +967 777000000
              </li>
            </ul>
          </div>

          <div className={isRTL ? "text-right" : "text-left"}>
            <h4 className="font-bold text-lg mb-4">{t.footer.contactUs}</h4>
            <div className={`flex gap-3 ${isRTL ? "justify-end" : "justify-start"}`}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-[#2a3d4e] rounded-full flex items-center justify-center hover:bg-[#fe6a52] transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {typeof social.icon === "function" ? <social.icon /> : <social.icon className="w-5 h-5" />}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="border-t border-[#2a3d4e] pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-[#9ea5ae] text-sm">
            © {new Date().getFullYear()} DaforLance. {t.footer.copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
