"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface ContactProps {
  siteTexts?: Record<string, any>
}

export default function Contact({ siteTexts = {} }: ContactProps) {
  const { t, isRTL, language } = useLanguage()
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const contactMain = siteTexts["contact.main"]
  const sectionTitle = contactMain
    ? language === "ar"
      ? contactMain.headingAr
      : contactMain.headingEn
    : t.contact.title

  const contactItems = [
    { icon: Phone, title: t.contact.callNow, value: "+967 777000000", color: "bg-[#fe6a52]" },
    { icon: MessageCircle, title: t.contact.whatsapp, value: "+967 777000000", color: "bg-[#25d366]" },
    { icon: Mail, title: t.contact.email, value: "email@email.com", color: "bg-[#fe6a52]" },
  ]

  const getInputClass = (fieldName: string) =>
    `rounded-xl border-border bg-background h-12 transition-all duration-300 ${
      isRTL ? "text-right" : "text-left"
    } ${focusedField === fieldName ? "border-[#fe6a52] ring-2 ring-[#fe6a52]/20" : ""}`

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gradient-to-b from-[#fbd8cc] via-[#fce8e2] to-[#fef6f3]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder={t.contact.firstName}
                className={getInputClass("firstName")}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
              />
              <Input
                placeholder={t.contact.lastName}
                className={getInputClass("lastName")}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder={t.contact.emailField}
                type="email"
                className={getInputClass("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
              <Input
                placeholder={t.contact.phone}
                type="tel"
                className={getInputClass("phone")}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <Textarea
              placeholder={t.contact.message}
              className={`rounded-xl border-border bg-background min-h-[140px] mb-6 resize-none transition-all duration-300 ${
                isRTL ? "text-right" : "text-left"
              } ${focusedField === "message" ? "border-[#fe6a52] ring-2 ring-[#fe6a52]/20" : ""}`}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
            />
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full py-6 text-base font-medium relative overflow-hidden group">
                <span className="relative z-10">{t.contact.send}</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </Button>
            </motion.div>
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
                <motion.div
                  key={index}
                  className={`flex items-center gap-4 ${isRTL ? "flex-row" : "flex-row-reverse"}`}
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
                    <p className="text-muted-foreground" dir="ltr">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
