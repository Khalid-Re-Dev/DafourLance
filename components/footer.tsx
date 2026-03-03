"use client";

import { motion } from "framer-motion";
import { Youtube, Linkedin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import Logo from "@/components/logo";

interface FooterProps {
  siteTexts?: Record<string, any>;
}

export default function Footer({ siteTexts = {} }: FooterProps) {
  const { t, language, isRTL } = useLanguage();

  const footerMain = siteTexts["footer.main"];
  const footerDescription = footerMain
    ? language === "ar"
      ? footerMain.bodyAr
      : footerMain.bodyEn
    : t.footer.description;

  const quickLinks = [
    { label: t.nav.home, href: "#" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.members, href: "#members" },
  ];

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
  ];

  return (
    <footer
      className="bg-[#1f2b3b] text-white py-16 lg:py-20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col">
            {/* قسم الشعار */}
            <div className="mb-6">
              <Logo variant="footer" />
            </div>
            <p className="text-[#9ea5ae] text-sm leading-relaxed max-w-xs">
              {footerDescription}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-4 text-[#9ea5ae]">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-[#fe6a52] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">{t.footer.contactUs}</h4>
            <ul className="space-y-4 text-[#9ea5ae]">
              <li className="flex items-center gap-2">
                <span className="hover:text-white transition-colors cursor-pointer">
                  contact@daforlance.com
                </span>
              </li>
              <li dir="ltr" className={isRTL ? "text-right" : "text-left"}>
                +967 777000000
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">
              {language === "ar" ? "تابعنا" : "Follow Us"}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-11 h-11 bg-[#2a3d4e] rounded-full flex items-center justify-center hover:bg-[#fe6a52] transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.div>

        <div className="border-t border-[#2a3d4e] pt-10 text-center text-[#9ea5ae] text-sm">
          <p>© {new Date().getFullYear()} DaforLance. {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}