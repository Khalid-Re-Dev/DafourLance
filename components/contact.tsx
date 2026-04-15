"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
// استيراد الأكشن
import { submitContactForm } from "@/app/actions/submit-contact"

interface ContactProps {
  siteTexts?: Record<string, any>
  footerConfig?: {
    phone?: string | null
    phone2?: string | null
    email?: string | null
    whatsapp?: string | null
  } | null
}

export default function Contact({ siteTexts = {}, footerConfig }: ContactProps) {
  const { t, isRTL, language } = useLanguage()
  const [focusedField, setFocusedField] = useState<string | null>(null)

  // حالات الإرسال
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const contactMain = siteTexts["contact.main"]
  const sectionTitle = contactMain
    ? language === "ar"
      ? contactMain.headingAr
      : contactMain.headingEn
    : t.contact.title

  const contactItems = [
    { icon: Phone, type: "phone" as const, title: t.contact.callNow, value: footerConfig?.phone || "+967 777000000", color: "bg-[#fe6a52]" },
    { icon: MessageCircle, type: "whatsapp" as const, title: t.contact.whatsapp, value: footerConfig?.whatsapp || "+967 777000000", color: "bg-[#25d366]" },
    { icon: Mail, type: "email" as const, title: t.contact.email, value: footerConfig?.email || "email@email.com", color: "bg-[#fe6a52]" },
  ]

  // دالة توليد رابط التواصل المناسب حسب نوع وسيلة الاتصال
  function getContactHref(type: "phone" | "whatsapp" | "email", value: string): string {
    switch (type) {
      case "phone": {
        // إزالة المسافات لإنشاء رابط هاتف صالح
        const cleanPhone = value.replace(/\s+/g, "")
        return `tel:${cleanPhone}`
      }
      case "whatsapp": {
        // إزالة كل شيء عدا الأرقام وعلامة + لإنشاء رابط واتساب صالح
        const cleanWhatsapp = value.replace(/[^\d+]/g, "").replace(/^\+/, "")
        return `https://wa.me/${cleanWhatsapp}`
      }
      case "email":
        return `mailto:${value}`
    }
  }

  const getInputClass = (fieldName: string) =>
    `rounded-xl border-border bg-background h-12 transition-all duration-300 ${isRTL ? "text-right" : "text-left"
    } ${focusedField === fieldName ? "border-[#fe6a52] ring-2 ring-[#fe6a52]/20" : ""}`

  // دالة معالجة الفورم
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    const formData = new FormData(e.currentTarget)
    const result = await submitContactForm(formData)

    setIsSubmitting(false)
    if (result.success) {
      setSubmitStatus("success")
        ; (e.target as HTMLFormElement).reset()
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } else {
      setSubmitStatus("error")
    }
  }


  return (
    <section id="contact" className="py-14 lg:py-20 bg-gradient-to-b from-[#fbd8cc] via-[#fce8e2] to-[#fef6f3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className={`mb-12 ${isRTL ? "text-right" : "text-left"}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="inline-block text-[#fe6a52] font-semibold text-sm lg:text-base mb-3 tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {isRTL ? "تواصل" : "Get in Touch"}
          </motion.span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{sectionTitle}</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            className={`bg-card rounded-3xl p-8 shadow-xl ${isRTL ? "order-1 lg:order-2" : "order-1"}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  name="firstName"
                  placeholder={t.contact.firstName}
                  required
                  className={getInputClass("firstName")}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                />
                <Input
                  name="lastName"
                  placeholder={t.contact.lastName}
                  required
                  className={getInputClass("lastName")}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  name="email"
                  placeholder={t.contact.emailField}
                  type="email"
                  required
                  className={getInputClass("email")}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
                <Input
                  name="phone"
                  placeholder={t.contact.phone}
                  type="tel"
                  className={getInputClass("phone")}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <Textarea
                name="message"
                placeholder={t.contact.message}
                required
                className={`rounded-xl border-border bg-background min-h-[140px] mb-6 resize-none transition-all duration-300 ${isRTL ? "text-right" : "text-left"
                  } ${focusedField === "message" ? "border-[#fe6a52] ring-2 ring-[#fe6a52]/20" : ""}`}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
              />

              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full py-6 text-base font-medium relative overflow-hidden group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      <span className="relative z-10">{t.contact.send}</span>
                    )}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                  </Button>
                </motion.div>

                {/* عرض رسالة النجاح أو الخطأ */}
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm font-bold text-center">
                      {isRTL ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!"}
                    </motion.p>
                  )}
                  {submitStatus === "error" && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm font-bold text-center">
                      {isRTL ? "حدث خطأ أثناء الإرسال" : "Error sending message"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          <motion.div
            className={`${isRTL ? "text-right order-2 lg:order-1" : "text-left order-2"}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">{t.contact.bookTitle}</h3>
            <p className="text-muted-foreground mb-10">
              <span className="text-[#fe6a52] font-medium">{t.contact.bookHighlight}</span> {t.contact.bookDescription}
            </p>

            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={getContactHref(item.type, item.value)}
                  target={item.type === "whatsapp" ? "_blank" : undefined}
                  rel={item.type === "whatsapp" ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-4 cursor-pointer no-underline ${isRTL ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: isRTL ? -5 : 5 }}
                >
                  <motion.div
                    className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center shrink-0 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-muted-foreground" dir="ltr" style={{ textAlign: isRTL ? "right" : "left" }}>
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}