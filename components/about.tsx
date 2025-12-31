"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { Eye, Flag, Target, Heart, Award, CheckCircle, Users, Zap } from "lucide-react"

interface AboutProps {
  siteTexts?: Record<string, any>
}

const aboutData = {
  ar: {
    overline: "من نحن",
    title: "من نحن",
    description:
      "دافور لانس فريق رقمي متخصص في تقديم حلول مبتكرة تمكن الشركات والمشاريع الناشئة من النمو والازدهار في العصر الرقمي.",
    pillars: [
      {
        key: "vision",
        icon: Eye,
        title: "رؤيتنا",
        description: "أن نصبح مزود الحلول الرقمية الرائد في المنطقة، معترفًا به للتميز والابتكار ورضا العملاء.",
      },
      {
        key: "mission",
        icon: Flag,
        title: "رسالتنا",
        description: "تقديم حلول رقمية متقدمة تساعد الشركات على تحقيق أهدافها من خلال الابتكار والجودة والتفاني.",
      },
      {
        key: "goals",
        icon: Target,
        title: "أهدافنا",
        items: [
          "تعزيز التعلم المستمر والتطوير المهني",
          "الحفاظ على أعلى معايير التميز التقني",
          "المساهمة في التحول الرقمي",
          "بناء شراكات طويلة الأمد",
          "تقديم حلول مبتكرة",
        ],
      },
      {
        key: "values",
        icon: Heart,
        title: "قيمنا",
        values: [
          { icon: Award, label: "الجودة" },
          { icon: CheckCircle, label: "الالتزام" },
          { icon: Users, label: "العمل الجماعي" },
          { icon: Zap, label: "الابتكار" },
        ],
      },
    ],
  },
  en: {
    overline: "About Us",
    title: "About Us",
    description:
      "DaforLance is a digital team specialized in delivering innovative solutions that help companies and startups grow and thrive in the digital era.",
    pillars: [
      {
        key: "vision",
        icon: Eye,
        title: "Our Vision",
        description:
          "To become the leading digital solutions provider in the region, recognized for excellence, innovation, and customer satisfaction.",
      },
      {
        key: "mission",
        icon: Flag,
        title: "Our Mission",
        description:
          "To deliver advanced digital solutions that help companies achieve their goals through innovation, quality, and dedication.",
      },
      {
        key: "goals",
        icon: Target,
        title: "Our Goals",
        items: [
          "Promote continuous learning and professional development",
          "Maintain the highest standards of technical excellence",
          "Contribute to digital transformation",
          "Build long-term partnerships",
          "Deliver innovative solutions",
        ],
      },
      {
        key: "values",
        icon: Heart,
        title: "Our Values",
        values: [
          { icon: Award, label: "Quality" },
          { icon: CheckCircle, label: "Commitment" },
          { icon: Users, label: "Teamwork" },
          { icon: Zap, label: "Innovation" },
        ],
      },
    ],
  },
}

function PillarCard({
  pillar,
  index,
  isRTL,
}: {
  pillar: {
    key: string
    icon: any
    title: string
    description?: string
    items?: string[]
    values?: { icon: any; label: string }[]
  }
  index: number
  isRTL: boolean
}) {
  const Icon = pillar.icon
  const isGoals = pillar.key === "goals"
  const isValues = pillar.key === "values"

  return (
    <motion.div
      className="group relative bg-white rounded-[20px] p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(254,106,82,0.12)] transition-all duration-500 cursor-pointer overflow-hidden h-full"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, boxShadow: "0 16px 48px rgba(254,106,82,0.15)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe6a52]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]" />

      <motion.div
        className="relative w-14 h-14 bg-[#fef2ee] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#fe6a52] transition-colors duration-400"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon className="w-7 h-7 text-[#fe6a52] group-hover:text-white transition-colors duration-400" />
      </motion.div>

      <h3
        className={`text-xl font-bold text-[#1f2b3b] mb-4 group-hover:text-[#fe6a52] transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}
      >
        {pillar.title}
      </h3>

      {!isGoals && !isValues && pillar.description && (
        <p className={`text-[#6b7280] text-[15px] leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
          {pillar.description}
        </p>
      )}

      {isGoals && pillar.items && (
        <ul className={`space-y-2.5 ${isRTL ? "text-right" : "text-left"}`}>
          {pillar.items.map((item, i) => (
            <motion.li
              key={i}
              className={`flex items-start gap-2.5 text-[#6b7280] text-[14px] leading-relaxed ${isRTL ? "flex-row-reverse" : ""}`}
              initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
            >
              <Target className="w-4 h-4 text-[#fe6a52] mt-0.5 shrink-0" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      )}

      {isValues && pillar.values && (
        <div className="grid grid-cols-2 gap-3">
          {pillar.values.map((value, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-2 bg-[#f9fafb] rounded-xl px-3 py-2.5 group/value hover:bg-[#fef2ee] transition-colors duration-300 ${isRTL ? "flex-row-reverse" : ""}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              <value.icon className="w-4 h-4 text-[#fe6a52]" />
              <span className="text-[#1f2b3b] text-sm font-medium">{value.label}</span>
            </motion.div>
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6a52] to-[#f5c842] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rtl:origin-right" />
    </motion.div>
  )
}

export default function About({ siteTexts = {} }: AboutProps) {
  const { language, isRTL } = useLanguage()

  const aboutMain = siteTexts["about.main"]
  const aboutVision = siteTexts["about.vision"]
  const aboutMission = siteTexts["about.mission"]
  const aboutGoals = siteTexts["about.goals"]
  const aboutValues = siteTexts["about.values"]

  const content = {
    overline: language === "ar" ? "من نحن" : "About Us",
    title: aboutMain
      ? language === "ar"
        ? aboutMain.headingAr
        : aboutMain.headingEn
      : language === "ar"
        ? "من نحن"
        : "About Us",
    description: aboutMain
      ? language === "ar"
        ? aboutMain.bodyAr
        : aboutMain.bodyEn
      : language === "ar"
        ? "دافور لانس فريق رقمي متخصص في تقديم حلول مبتكرة تمكن الشركات والمشاريع الناشئة من النمو والازدهار في العصر الرقمي."
        : "DaforLance is a digital team specialized in delivering innovative solutions that help companies and startups grow and thrive in the digital era.",
    pillars: [
      {
        key: "vision",
        icon: Eye,
        title: aboutVision
          ? language === "ar"
            ? aboutVision.headingAr
            : aboutVision.headingEn
          : language === "ar"
            ? "رؤيتنا"
            : "Our Vision",
        description: aboutVision
          ? language === "ar"
            ? aboutVision.bodyAr
            : aboutVision.bodyEn
          : language === "ar"
            ? "أن نصبح مزود الحلول الرقمية الرائد في المنطقة، معترفًا به للتميز والابتكار ورضا العملاء."
            : "To become the leading digital solutions provider in the region, recognized for excellence, innovation, and customer satisfaction.",
      },
      {
        key: "mission",
        icon: Flag,
        title: aboutMission
          ? language === "ar"
            ? aboutMission.headingAr
            : aboutMission.headingEn
          : language === "ar"
            ? "رسالتنا"
            : "Our Mission",
        description: aboutMission
          ? language === "ar"
            ? aboutMission.bodyAr
            : aboutMission.bodyEn
          : language === "ar"
            ? "تقديم حلول رقمية متقدمة تساعد الشركات على تحقيق أهدافها من خلال الابتكار والجودة والتفاني."
            : "To deliver advanced digital solutions that help companies achieve their goals through innovation, quality, and dedication.",
      },
      {
        key: "goals",
        icon: Target,
        title: aboutGoals
          ? language === "ar"
            ? aboutGoals.headingAr
            : aboutGoals.headingEn
          : language === "ar"
            ? "أهدافنا"
            : "Our Goals",
        items: aboutGoals
          ? (language === "ar" ? aboutGoals.bodyAr : aboutGoals.bodyEn)?.split("\n") || []
          : language === "ar"
            ? [
                "تعزيز التعلم المستمر والتطوير المهني",
                "الحفاظ على أعلى معايير التميز التقني",
                "المساهمة في التحول الرقمي",
                "بناء شراكات طويلة الأمد",
                "تقديم حلول مبتكرة",
              ]
            : [
                "Promote continuous learning and professional development",
                "Maintain the highest standards of technical excellence",
                "Contribute to digital transformation",
                "Build long-term partnerships",
                "Deliver innovative solutions",
              ],
      },
      {
        key: "values",
        icon: Heart,
        title: aboutValues
          ? language === "ar"
            ? aboutValues.headingAr
            : aboutValues.headingEn
          : language === "ar"
            ? "قيمنا"
            : "Our Values",
        values:
          language === "ar"
            ? [
                { icon: Award, label: "الجودة" },
                { icon: CheckCircle, label: "الالتزام" },
                { icon: Users, label: "العمل الجماعي" },
                { icon: Zap, label: "الابتكار" },
              ]
            : [
                { icon: Award, label: "Quality" },
                { icon: CheckCircle, label: "Commitment" },
                { icon: Users, label: "Teamwork" },
                { icon: Zap, label: "Innovation" },
              ],
      },
    ],
  }

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#f9fafb] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#fe6a52]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#f5c842]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <motion.div
          className={`max-w-3xl mb-16 lg:mb-20 mx-auto text-center ${isRTL ? "text-right mr-auto" : "text-left ml-auto"}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-block text-[#fe6a52] font-semibold text-sm lg:text-base mb-3 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {content.overline}
          </motion.span>
          <h2 className="text-3xl lg:text-[42px] font-bold text-[#1f2b3b] mb-6">{content.title}</h2>
          <p className="text-[#6b7280] text-base lg:text-lg leading-relaxed">{content.description}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
          }}
        >
          {content.pillars.map((pillar, index) => (
            <PillarCard key={pillar.key} pillar={pillar} index={index} isRTL={isRTL} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
