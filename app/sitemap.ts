import type { MetadataRoute } from 'next'
import { siteOrigin } from '@/lib/seo'
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin()
  if (!origin) return []
  return ['ar', 'en'].map(lang => ({ url: `${origin}/${lang}`, alternates: {
    languages: { ar: `${origin}/ar`, en: `${origin}/en` },
  } }))
}
