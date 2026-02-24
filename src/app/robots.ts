import { MetadataRoute } from 'next'
import { APP_URLS } from '@/lib/urls'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/_next/'],
        },
        sitemap: `${APP_URLS.BASE_URL}/sitemap.xml`,
    }
}
