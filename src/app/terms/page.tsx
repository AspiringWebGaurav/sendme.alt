/**
 * sendme.alt - Terms of Service
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for sendme.alt - Read our terms and conditions. Maximum file size: 3GB. No warranty, use at your own risk.',
  openGraph: {
    title: 'Terms of Service | sendme.alt',
    description: 'Terms of Service for sendme.alt - Read our terms and conditions.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-block mb-6 sm:mb-8 text-accent hover:text-accent-light transition-colors text-sm sm:text-base"
          >
            ← Back to Home
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">Terms of Service</h1>

          <div className="space-y-6 sm:space-y-8 text-white/80 text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">1. Acceptance of Terms</h2>
              <p className="mb-2">
                By accessing or using the sendme.alt service, you confirm your acceptance of these Terms of Service. These terms constitute a legally binding agreement between you and sendme.alt regarding your use of our text and file transfer services.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">2. Nature of Service</h2>
              <p className="mb-2">
                sendme.alt is a peer-to-peer (P2P) file transfer solution leveraging WebRTC technology. We facilitate direct data transmission between user devices. We do not permanently store, view, or control the files transferred through our platform. All transfers are transient and direct.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">3. User Conduct</h2>
              <p className="mb-2">You agree to use the service in compliance with all applicable laws and regulations. You are prohibited from using the service to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Transmit any content that is illegal, infringing, or harmful.</li>
                <li>Distribute malware, viruses, or any code of a destructive nature.</li>
                <li>Interfere with or disrupt the integrity or performance of the service.</li>
                <li>Violate the intellectual property rights of others.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">4. Limitations & Disclaimers</h2>
              <p className="mb-2">
                <strong>No Warranty:</strong> The service is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied.
              </p>
              <p className="mb-2">
                <strong>Limitation of Liability:</strong> In no event shall sendme.alt or its operators be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
              </p>
              <p className="mb-2">
                <strong>File Size Limit:</strong> Transfers are limited to a maximum file size of 3GB per transfer.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">5. Intellectual Property</h2>
              <p className="mb-2">
                All rights, title, and interest in and to the service (excluding content provided by users) are and will remain the exclusive property of sendme.alt and its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">6. Modifications</h2>
              <p className="mb-2">
                We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">7. Contact Information</h2>
              <p>
                For any inquiries regarding these Terms, please contact us via my portfolio: {' '}
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
