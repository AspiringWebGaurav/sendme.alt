import { MetadataRoute } from 'next'
import { APP_URLS } from '@/core/urls'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/legal/privacy', '/legal/terms', '/legal/aup']

  return routes.map((route) => ({
    url: `${APP_URLS.BASE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'monthly' : 'yearly',
    priority: route === '' ? 1 : 0.8,
  }))
}
