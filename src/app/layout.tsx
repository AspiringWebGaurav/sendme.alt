/**
 * sendme.alt - Root Layout
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.send2me.site'),
  title: {
    default: 'sendme.alt - Fast P2P File Transfer | Send Files Up to 3GB',
    template: '%s | sendme.alt',
  },
  description: 'Blazing fast peer-to-peer file transfer. Send files up to 3GB directly between devices. No signup, no cloud storage, just fast transfers. Free forever.',
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
  authors: [{ name: 'Gaurav Patil', url: 'https://gauravpatil.online' }],
  creator: 'Gaurav Patil',
  publisher: 'Gaurav Patil',
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
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.send2me.site',
    siteName: 'sendme.alt',
    title: 'sendme.alt - Fast P2P File Transfer',
    description: 'Send files up to 3GB directly between devices. No signup required. Free forever.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'sendme.alt - Fast P2P File Transfer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sendme.alt - Fast P2P File Transfer',
    description: 'Send files up to 3GB directly between devices. No signup required.',
    creator: '@gauravpatil',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.send2me.site',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>{children}</body>
    </html>
  )
}
