import { MetadataRoute } from 'next'
import { APP_URLS } from '@/lib/urls'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: APP_URLS.APP_NAME,
        short_name: APP_URLS.APP_NAME,
        description: APP_URLS.APP_DESCRIPTION,
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#3B82F6',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
