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
                By accessing and using sendme.alt, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to these terms, please do not use 
                this service.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">2. Service Description</h2>
              <p className="mb-2">
                sendme.alt is a peer-to-peer file transfer service that allows users to send files 
                directly between devices without storing files on our servers. The service uses 
                WebRTC technology to establish direct connections between users.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">3. User Responsibilities</h2>
              <p className="mb-2">You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service only for lawful purposes</li>
                <li>Not transmit any illegal, harmful, or malicious content</li>
                <li>Not attempt to disrupt or interfere with the service</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not use the service to violate any laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">4. File Size and Content Limits</h2>
              <p className="mb-2">
                The maximum file size is 3GB. You are responsible for ensuring that files you 
                transfer comply with all applicable laws and do not infringe on any rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">5. No Warranty</h2>
              <p className="mb-2">
                The service is provided &quot;as is&quot; without any warranties, expressed or implied. 
                We do not guarantee that the service will be uninterrupted, secure, or error-free. 
                File transfers are at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">6. Limitation of Liability</h2>
              <p className="mb-2">
                sendme.alt and its operators shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including loss of data, profits, or 
                business opportunities, arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">7. Prohibited Uses</h2>
              <p className="mb-2">You may not use the service to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Transfer illegal content or content that violates laws</li>
                <li>Distribute malware, viruses, or harmful software</li>
                <li>Violate intellectual property rights</li>
                <li>Harass, threaten, or harm others</li>
                <li>Spam or send unsolicited content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">8. Service Availability</h2>
              <p className="mb-2">
                We reserve the right to modify, suspend, or discontinue the service at any time 
                without notice. We are not liable for any consequences resulting from such actions.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">9. Changes to Terms</h2>
              <p className="mb-2">
                We reserve the right to modify these terms at any time. Continued use of the 
                service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-white">10. Contact</h2>
              <p>
                For questions about these terms, visit{' '}
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
