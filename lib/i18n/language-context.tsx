"use client"
import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { translations, type Language, type TranslationKeys } from './translations'
interface LanguageContextType { language: Language; t: TranslationKeys; toggleLanguage: () => void; isRTL: boolean }
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)
export function LanguageProvider({ children, initialLanguage = 'ar' }: { children: ReactNode; initialLanguage?: Language }) {
  const pathname = usePathname()
  const router = useRouter()
  const language: Language = pathname === '/en' ? 'en' : pathname === '/ar' ? 'ar' : initialLanguage
  const toggleLanguage = useCallback(() => {
    router.push(`/${language === 'ar' ? 'en' : 'ar'}${window.location.hash}`, { scroll: false })
  }, [language, router])
  const value = useMemo(() => ({ language, t: translations[language], toggleLanguage, isRTL: language === 'ar' }), [language, toggleLanguage])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
