"use client";

import { motion } from "framer-motion";
import {
  Youtube,
  Linkedin,
  Instagram,
  Facebook,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import Logo from "@/components/logo";

interface FooterConfigData {
  phone?: string | null;
  phone2?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  copyrightAr?: string | null;
  copyrightEn?: string | null;
}

interface FooterProps {
  siteTexts?: Record<string, any>;
  footerConfig?: FooterConfigData | null;
}

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer({
  siteTexts = {},
  footerConfig,
}: FooterProps) {
  const { t, language, isRTL } = useLanguage();

  // Description: footerConfig → siteTexts → translations fallback
  const footerDescription = footerConfig
    ? language === "ar"
      ? footerConfig.descriptionAr
      : footerConfig.descriptionEn
    : siteTexts["footer.main"]
      ? language === "ar"
        ? siteTexts["footer.main"].bodyAr
        : siteTexts["footer.main"].bodyEn
      : t.footer.description;

  // Copyright: footerConfig → translations fallback
  const copyrightText = footerConfig
    ? language === "ar"
      ? footerConfig.copyrightAr
      : footerConfig.copyrightEn
    : t.footer.copyright;

  // Address from config
  const address = footerConfig
    ? language === "ar"
      ? footerConfig.addressAr
      : footerConfig.addressEn
    : null;

  // Contact info from config (with fallbacks)
  const contactEmail = footerConfig?.email || "contact@daforlance.com";
  const contactPhone = footerConfig?.phone || "+967 777000000";
  const contactPhone2 = footerConfig?.phone2;

  const quickLinks = [
    { label: t.nav.home, href: "#" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.members, href: "#members" },
  ];

  // Build social links dynamically from config
  const socialLinks = [
    footerConfig?.linkedinUrl
      ? { icon: Linkedin, href: footerConfig.linkedinUrl, label: "LinkedIn" }
      : null,
    footerConfig?.twitterUrl
      ? { icon: XIcon, href: footerConfig.twitterUrl, label: "X" }
      : null,
    footerConfig?.youtubeUrl
      ? { icon: Youtube, href: footerConfig.youtubeUrl, label: "YouTube" }
      : null,
    footerConfig?.instagramUrl
      ? { icon: Instagram, href: footerConfig.instagramUrl, label: "Instagram" }
      : null,
    footerConfig?.facebookUrl
      ? { icon: Facebook, href: footerConfig.facebookUrl, label: "Facebook" }
      : null,
  ].filter(Boolean) as { icon: any; href: string; label: string }[];

  // Fallback if no config exists: show placeholder social links
  const displaySocialLinks =
    socialLinks.length > 0
      ? socialLinks
      : [
          { icon: Linkedin, href: "#", label: "LinkedIn" },
          { icon: XIcon, href: "#", label: "X" },
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
                <Mail className="w-4 h-4 text-[#fe6a52] shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white transition-colors"
                  dir="ltr"
                >
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#fe6a52] shrink-0" />
                <a
                  href={`tel:${contactPhone}`}
                  className="hover:text-white transition-colors"
                  dir="ltr"
                >
                  {contactPhone}
                </a>
              </li>
              {contactPhone2 && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#fe6a52] shrink-0" />
                  <a
                    href={`tel:${contactPhone2}`}
                    className="hover:text-white transition-colors"
                    dir="ltr"
                  >
                    {contactPhone2}
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#fe6a52] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">
              {language === "ar" ? "تابعنا" : "Follow Us"}
            </h4>
            <div className="flex gap-4">
              {displaySocialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target={social.href !== "#" ? "_blank" : undefined}
                    rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                    className="w-11 h-11 bg-[#2a3d4e] rounded-full flex items-center justify-center hover:bg-[#fe6a52] transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="border-t border-[#2a3d4e] pt-10 text-center text-[#9ea5ae] text-sm">
          <p>
            © {new Date().getFullYear()} DaforLance.{" "}
            {copyrightText || t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}