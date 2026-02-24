/**
 * sendme.alt - Root Layout
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { APP_URLS, DEVELOPER_URLS, getOgImageUrl } from '@/lib/urls'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(APP_URLS.BASE_URL),
  title: {
    default: `${APP_URLS.APP_NAME} - Fast P2P File Transfer | Send Files Up to 3GB`,
    template: `%s | ${APP_URLS.APP_NAME}`,
  },
  description: APP_URLS.APP_DESCRIPTION,
  keywords: [
    'file transfer',
    'P2P file transfer',
    'WebRTC',
    'file sharing',
    'send files',
    'peer to peer',
    'direct file transfer',
    'no signup file transfer',
    'private file sharing',
    'secure file transfer',
  ],
  authors: [{ name: DEVELOPER_URLS.NAME, url: DEVELOPER_URLS.PORTFOLIO }],
  creator: DEVELOPER_URLS.NAME,
  publisher: DEVELOPER_URLS.NAME,
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URLS.BASE_URL,
    siteName: APP_URLS.APP_NAME,
    title: `${APP_URLS.APP_NAME} - Fast P2P File Transfer`,
    description: APP_URLS.APP_DESCRIPTION,
    emails: ['hello@gauravpatil.online'],
    images: [
      {
        url: getOgImageUrl(),
        secureUrl: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: `${APP_URLS.APP_NAME} Preview Graphic showing secure peer-to-peer file transfer`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_URLS.APP_NAME} - Fast P2P File Transfer`,
    description: APP_URLS.APP_DESCRIPTION,
    site: `@${DEVELOPER_URLS.TWITTER_HANDLE}`,
    creator: `@${DEVELOPER_URLS.TWITTER_HANDLE}`,
    images: [getOgImageUrl()],
  },
  alternates: {
    canonical: APP_URLS.BASE_URL,
  },
  category: 'File Transfer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: APP_URLS.APP_NAME,
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e1b4b',
}

import { NotificationProvider } from '@/contexts/NotificationContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="min-h-screen bg-[#0f172a] text-slate-50">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
