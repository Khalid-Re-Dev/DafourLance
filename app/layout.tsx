import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import DeferredAssistant from '@/components/deferred-assistant'
import MotionProvider from '@/components/motion-provider'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from '@/lib/i18n/language-context'
const cairo = localFont({
  src: [ { path: '../public/fonts/cairo-arabic.woff2', weight: '200 1000', style: 'normal' },
    { path: '../public/fonts/cairo-latin.woff2', weight: '200 1000', style: 'normal' } ],
  display: 'swap', variable: '--font-cairo', fallback: ['Arial'],
})
export const metadata: Metadata = { title: 'Dafourlance', description: 'Digital services and consulting' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#fe6a52' }
export default async function RootLayout({ children }: { children: ReactNode }) {
  const language = (await headers()).get('x-site-language') === 'en' ? 'en' : 'ar'
  return <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <body className={`${cairo.variable} font-sans antialiased`}>
      <LanguageProvider initialLanguage={language}><MotionProvider>
        {children}<DeferredAssistant /><Toaster position="top-right" richColors />
      </MotionProvider></LanguageProvider>
      <Analytics />
    </body>
  </html>
}
