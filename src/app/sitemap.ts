import { MetadataRoute } from 'next'
import { APP_URLS } from '@/lib/urls'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: APP_URLS.BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        }
    ]
}
