import { MetadataRoute } from 'next'
import { APP_URLS } from '@/core/urls'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${APP_URLS.BASE_URL}/sitemap.xml`,
  }
}
