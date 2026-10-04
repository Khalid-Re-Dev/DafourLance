import type { Metadata } from 'next'
export function siteOrigin() {
  const configured = process.env.SITE_URL
  if (!configured) return null
  try { const url = new URL(configured); return ['http:', 'https:'].includes(url.protocol) ? url.origin : null } catch { return null }
}
export function localizedMetadata(language: 'ar' | 'en'): Metadata {
  const origin = siteOrigin()
  const title = language === 'ar' ? 'Dafourlance - نحو تجربة رقمية واحترافية أفضل' : 'Dafourlance — Digital Services & Consulting'
  const description = language === 'ar' ? 'نصمم تجارب مستخدم مبتكرة، ونطور مواقع احترافية ونقدم استشارات رقمية وتدريبًا لتطوير مهاراتك التقنية والإبداعية.' : 'User experience design, professional websites, digital consulting and training to develop your technical and creative skills.'
  const canonical = origin ? `${origin}/${language}` : undefined
  return { title, description, ...(origin ? { metadataBase: new URL(origin), alternates: {
    canonical, languages: { ar: `${origin}/ar`, en: `${origin}/en`, 'x-default': `${origin}/ar` },
  } } : {}),
    robots: { index: !!origin, follow: true },
    openGraph: { title, description, type: 'website', locale: language === 'ar' ? 'ar_YE' : 'en_US',
      alternateLocale: language === 'ar' ? 'en_US' : 'ar_YE', siteName: 'Dafourlance', url: canonical,
      images: [{ url: `${origin || ''}/opengraph-image`, width: 1200, height: 630, alt: 'Dafourlance' }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${origin || ''}/opengraph-image`] },
  }
}
