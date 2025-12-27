"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { translations, type Language, type TranslationKeys } from "./translations"

interface LanguageContextType {
  language: Language
  t: TranslationKeys
  toggleLanguage: () => void
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"))
  }, [])

  const value: LanguageContextType = {
    language,
    t: translations[language],
    toggleLanguage,
    isRTL: language === "ar",
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
