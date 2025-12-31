import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import SmartAssistant from "@/components/smart-assistant"
import { LanguageProvider } from "@/lib/i18n/language-context"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "Dafourlance - نحو تجربة رقمية واحترافية أفضل",
  description:
    "نصمم تجارب مستخدم مبتكرة. نطور مواقع احترافية نقدم استشارات رقمية وندربك لتطوير مهاراتك التقنية والإبداعية",
  keywords: ["digital services", "consulting", "web development", "UI/UX design", "خدمات رقمية", "استشارات", "تصميم"],
  authors: [{ name: "Dafourlance" }],
  creator: "Dafourlance",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    title: "Dafourlance - Digital Services & Consulting Platform",
    description:
      "We design innovative user experiences. We develop professional websites and provide digital consulting.",
    siteName: "Dafourlance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dafourlance - Digital Services & Consulting Platform",
    description:
      "We design innovative user experiences. We develop professional websites and provide digital consulting.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fe6a52",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <Analytics />
          <SmartAssistant />
        </LanguageProvider>
      </body>
    </html>
  )
}
