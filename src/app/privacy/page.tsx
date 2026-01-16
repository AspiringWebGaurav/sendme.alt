/**
 * sendme.alt - Privacy Policy
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for sendme.alt - Learn how we protect your privacy. No data collection, no tracking, no storage. Files transfer directly between devices.',
  openGraph: {
    title: 'Privacy Policy | sendme.alt',
    description: 'Privacy Policy for sendme.alt - Learn how we protect your privacy.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-6 sm:mb-8 text-accent hover:text-accent-light transition-colors text-sm sm:text-base"
          >
            ← Back to Home
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Privacy Policy</h1>

          <div className="space-y-6 sm:space-y-8 text-white/80 text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">What We Collect</h2>
              <p className="mb-2">
                <strong>Nothing.</strong> sendme.alt does not collect, store, or track any personal information.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No user accounts</li>
                <li>No cookies</li>
                <li>No analytics</li>
                <li>No tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">How It Works</h2>
              <p>
                Files are transferred directly between devices using peer-to-peer (WebRTC) technology. 
                Your files never touch our servers. We only facilitate the connection between sender 
                and receiver.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">What We Store</h2>
              <p className="mb-2">
                We temporarily store connection information in Firebase for up to 5 minutes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Share codes (tokens)</li>
                <li>File metadata (name, size, type)</li>
                <li>WebRTC signaling data (for connection setup)</li>
              </ul>
              <p className="mt-2">
                All data is automatically deleted after 5 minutes or when the transfer completes.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Security</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>End-to-end encrypted transfers (WebRTC DTLS)</li>
                <li>HTTPS only</li>
                <li>No file storage on servers</li>
                <li>Temporary session data only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Third-Party Services</h2>
              <p className="mb-2">We use the following services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Firebase (Google)</strong> - For real-time signaling only. No file 
                  content is stored.
                </li>
                <li>
                  <strong>Vercel</strong> - Hosting platform. No user data collected.
                </li>
                <li>
                  <strong>STUN/TURN Servers</strong> - For NAT traversal. Only connection 
                  information, no file data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Your Rights</h2>
              <p>
                Since we don't collect any personal data, there's nothing to delete, export, 
                or opt-out of. All session data is automatically deleted after 5 minutes.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Contact</h2>
              <p>
                For questions about privacy, visit{' '}
                <a
                  href="https://gauravpatil.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light transition-colors"
                >
                  gauravpatil.online
                </a>
              </p>
            </section>

            <section className="pt-6 border-t border-white/20">
              <p className="text-sm text-white/60">
                Effective from: {today}
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
