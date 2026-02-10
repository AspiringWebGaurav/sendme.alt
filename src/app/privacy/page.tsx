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
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Privacy Commitment</h2>
              <p className="mb-2">
                Your privacy is paramount at sendme.alt. We operate on a strict "No-Logs" policy regarding your files. We do not store, view, or analyze the content of the files you transfer.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Data Collection Policy</h2>
              <p className="mb-2">
                <strong>We collect minimal data necessary for the service to function:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Volatile Connection Data:</strong> Temporary metadata (share codes, file type, file size) required to establish the peer-to-peer connection. This data is ephemeral and automatically purged after the transfer session.</li>
                <li><strong>No Personal Identifiable Information (PII):</strong> We do not require account creation, nor do we track user behavior or analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">How We Secure Your Transfers</h2>
              <p className="mb-2">
                We utilize industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>End-to-End Encryption:</strong> All data transferred is encrypted using WebRTC's Datagram Transport Layer Security (DTLS), ensuring that only the intended recipient can access the files.</li>
                <li><strong>Secure Protocols:</strong> All signaling and site traffic occur over HTTPS.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Third-Party Infrastructure</h2>
              <p className="mb-2">
                To facilitate connections, we use selected third-party services. These providers process data solely for the purpose of transmission and do not retain file content:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Signaling & NAT Traversal:</strong> We use STUN/TURN servers to help devices connect through firewalls. These servers facilitate the handshake but do not store your data.</li>
                <li><strong>Hosting:</strong> Our static site is hosted on Vercel.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">Your Rights & Contact</h2>
              <p className="mb-2">
                As we maintain no persistent user data, traditional data subject rights (access, deletion) are fulfilled by design—there is no data to delete.
              </p>
              <p>
                For privacy-related inquiries, please reach out via: {' '}
                <a
                  href="https://www.gauravpatil.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-light transition-colors"
                >
                  www.gauravpatil.online
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
