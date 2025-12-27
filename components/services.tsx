"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { Code2, Palette, Megaphone, GraduationCap, Globe, LineChart } from "lucide-react"

interface ServicesProps {
  siteTexts?: Record<string, any>
}

const servicesData = {
  ar: [
    {
      icon: Code2,
      title: "تطوير المواقع",
      description: "نبني مواقع احترافية متجاوبة باستخدام أحدث التقنيات لضمان أداء مثالي وتجربة مستخدم سلسة",
    },
    {
      icon: Palette,
      title: "تصميم واجهات المستخدم",
      description: "نصمم واجهات جذابة وسهلة الاستخدام تعكس هوية علامتك التجارية وتحقق أهدافك",
    },
    {
      icon: Megaphone,
      title: "التسويق الرقمي",
      description: "استراتيجيات تسويقية متكاملة لزيادة الوعي بعلامتك التجارية والوصول لجمهورك المستهدف",
    },
    {
      icon: GraduationCap,
      title: "التدريب والتأهيل",
      description: "برامج تدريبية متخصصة لتطوير مهاراتك التقنية والإبداعية في مجال التقنية",
    },
    {
      icon: Globe,
      title: "الاستشارات الرقمية",
      description: "نقدم استشارات متخصصة لمساعدتك في التحول الرقمي واتخاذ القرارات التقنية الصحيحة",
    },
    {
      icon: LineChart,
      title: "تحليل البيانات",
      description: "نحلل بياناتك لاستخراج رؤى قيمة تساعدك في اتخاذ قرارات مدروسة وتحسين الأداء",
    },
  ],
  en: [
    {
      icon: Code2,
      title: "Web Development",
      description:
        "We build professional responsive websites using the latest technologies to ensure optimal performance and seamless user experience",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description:
        "We design attractive and easy-to-use interfaces that reflect your brand identity and achieve your goals",
    },
    {
      icon: Megaphone,
      title: "Digital Marketing",
      description: "Integrated marketing strategies to increase brand awareness and reach your target audience",
    },
    {
      icon: GraduationCap,
      title: "Training & Development",
      description:
        "Specialized training programs to develop your technical and creative skills in the technology field",
    },
    {
      icon: Globe,
      title: "Digital Consulting",
      description:
        "We provide specialized consultations to help you with digital transformation and make the right technical decisions",
    },
    {
      icon: LineChart,
      title: "Data Analytics",
      description:
        "We analyze your data to extract valuable insights that help you make informed decisions and improve performance",
    },
  ],
}

function ServiceCard({
  service,
  index,
  isRTL,
}: {
  service: (typeof servicesData.ar)[0]
  index: number
  isRTL: boolean
}) {
  const Icon = service.icon

  return (
    <motion.div
      className="group relative bg-white rounded-[20px] p-6 lg:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(254,106,82,0.15)] transition-all duration-500 cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe6a52]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]" />

      <motion.div
        className="relative w-14 h-14 lg:w-16 lg:h-16 bg-[#fef2ee] rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#fe6a52] transition-colors duration-400"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-[#fe6a52] group-hover:text-white transition-colors duration-400" />
      </motion.div>

      <div className={isRTL ? "text-right" : "text-left"}>
        <h3 className="text-lg lg:text-xl font-bold text-[#1f2b3b] mb-3 group-hover:text-[#fe6a52] transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-[#6b7280] text-sm lg:text-[15px] leading-relaxed">{service.description}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6a52] to-[#f5c842] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rtl:origin-right" />
    </motion.div>
  )
}

export default function Services({ siteTexts = {} }: ServicesProps) {
  const { t, language, isRTL } = useLanguage()
  const services = servicesData[language]

  const servicesMain = siteTexts["services.main"]
  const sectionTitle = servicesMain
    ? language === "ar"
      ? servicesMain.headingAr
      : servicesMain.headingEn
    : t.services.title
  const sectionDescription = servicesMain
    ? language === "ar"
      ? servicesMain.bodyAr
      : servicesMain.bodyEn
    : t.services.description

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section id="services" className="py-20 lg:py-28 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center mb-14 lg:mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.span
            className="inline-block text-[#fe6a52] font-semibold text-sm lg:text-base mb-3 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {language === "ar" ? "ما نقدمه" : "What We Offer"}
          </motion.span>
          <h2 className="text-3xl lg:text-[42px] font-bold text-[#1f2b3b] mb-5">{sectionTitle}</h2>
          <p className="text-[#6b7280] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">{sectionDescription}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  )
}
