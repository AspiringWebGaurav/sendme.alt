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
    images: [
      {
        url: getOgImageUrl(),
        width: 1200,
        height: 630,
        alt: `${APP_URLS.APP_NAME} - Fast P2P File Transfer`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_URLS.APP_NAME} - Fast P2P File Transfer`,
    description: APP_URLS.APP_DESCRIPTION,
    creator: `@${DEVELOPER_URLS.TWITTER_HANDLE}`,
  },
  alternates: {
    canonical: APP_URLS.BASE_URL,
  },
  category: 'File Transfer',
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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
