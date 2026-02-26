import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NotificationProvider } from '@/state/NotificationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL('https://sendme-alt.vercel.app'),
    title: {
        default: 'Sendme.alt — Secure P2P File Transfer',
        template: '%s | Sendme.alt'
    },
    description: 'Blazing fast peer-to-peer encrypted file transfer. No servers, no file limits, no sign-up required. Share files instantly across any device.',
    keywords: ['file transfer', 'p2p', 'peer-to-peer', 'encrypted', 'webrtc', 'send files', 'large files', 'secure transfer', 'zero knowledge'],
    authors: [{ name: 'Gaurav Patil', url: 'https://gauravpatil.online' }],
    creator: 'Gaurav Patil',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://sendme-alt.vercel.app',
        title: 'Sendme.alt — Secure P2P File Transfer',
        description: 'Blazing fast peer-to-peer encrypted file transfer. No servers, no file limits, no sign-up required.',
        siteName: 'Sendme.alt',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sendme.alt — Secure P2P File Transfer',
        description: 'Blazing fast peer-to-peer encrypted file transfer. No servers, no file limits, no sign-up required.',
        creator: '@gauravpatil',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: '/manifest.json',
    icons: {
        icon: [
            { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: [
            { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
    },
    appleWebApp: {
        title: 'Sendme.alt',
        statusBarStyle: 'black-translucent',
        capable: true,
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#fafafa' },
        { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    ],
}

import { ThemeProvider } from '@/components/ThemeProvider'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-bg-primary dark:bg-zinc-950 text-text-primary dark:text-zinc-50 overflow-hidden h-[100dvh] w-screen m-0 p-0 transition-colors duration-300`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <NotificationProvider>
                        {children}
                    </NotificationProvider>
                    <ServiceWorkerRegistration />
                </ThemeProvider>
            </body>
        </html>
    )
}
