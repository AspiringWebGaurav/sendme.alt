import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { APP_URLS, DEVELOPER_URLS, getCanonicalUrl } from '@/core/urls'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: `Terms of Service for ${APP_URLS.APP_NAME}`,
    alternates: { canonical: getCanonicalUrl('/terms') }
}

export default function TermsPage() {
    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-50 selection:bg-zinc-800">
            <Navbar />
            <main className="flex-1 w-full overflow-y-auto p-6 sm:p-12">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/"
                        className="inline-block mb-8 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium"
                    >
                        ← Back to App
                    </Link>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-zinc-50">Terms of Service</h1>

                    <div className="space-y-8 text-zinc-300 text-sm sm:text-base leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the {APP_URLS.APP_NAME} service, you confirm your acceptance of these Terms of Service. These terms constitute a legally binding agreement between you and {APP_URLS.APP_NAME} regarding your use of our text and file transfer services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">2. Nature of Service</h2>
                            <p>
                                {APP_URLS.APP_NAME} is a peer-to-peer (P2P) file transfer solution leveraging WebRTC technology. We facilitate direct data transmission between user devices. We do not permanently store, view, or control the files transferred through our platform. All transfers are transient and direct.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">3. User Conduct</h2>
                            <p className="mb-2">You agree to use the service in compliance with all applicable laws and regulations. You are prohibited from using the service to:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                                <li>Transmit any content that is illegal, infringing, or harmful.</li>
                                <li>Distribute malware, viruses, or any code of a destructive nature.</li>
                                <li>Interfere with or disrupt the integrity or performance of the service.</li>
                                <li>Violate the intellectual property rights of others.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">4. Limitations & Disclaimers</h2>
                            <p className="mb-3">
                                <strong className="text-zinc-100">No Warranty:</strong> The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. We expressly disclaim all warranties of any kind, whether express or implied.
                            </p>
                            <p className="mb-3">
                                <strong className="text-zinc-100">Limitation of Liability:</strong> In no event shall {APP_URLS.APP_NAME} or its operators be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
                            </p>
                            <p>
                                <strong className="text-zinc-100">File Size Limit:</strong> Transfers are limited to a maximum file size of 3GB per transfer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">5. Intellectual Property</h2>
                            <p>
                                All rights, title, and interest in and to the service (excluding content provided by users) are and will remain the exclusive property of {APP_URLS.APP_NAME} and its licensors.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">6. Modifications</h2>
                            <p>
                                We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">7. Contact Information</h2>
                            <p>
                                For any inquiries regarding these Terms, please contact us via my portfolio: {' '}
                                <a
                                    href={DEVELOPER_URLS.PORTFOLIO}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark transition-colors font-medium"
                                >
                                    {DEVELOPER_URLS.PORTFOLIO.replace('https://', '').replace('http://', '')}
                                </a>
                            </p>
                        </section>

                        <section className="pt-8 mt-12 border-t border-white/10">
                            <p className="text-xs text-zinc-500">
                                Effective from: {today}
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
