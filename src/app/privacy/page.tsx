import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { APP_URLS, DEVELOPER_URLS, getCanonicalUrl } from '@/core/urls'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: `Privacy Policy for ${APP_URLS.APP_NAME}`,
    alternates: { canonical: getCanonicalUrl('/privacy') }
}

export default function PrivacyPage() {
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

                    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-zinc-50">Privacy Policy</h1>

                    <div className="space-y-8 text-zinc-300 text-sm sm:text-base leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">Privacy Commitment</h2>
                            <p>
                                Your privacy is paramount at {APP_URLS.APP_NAME}. We operate on a strict &quot;No-Logs&quot; policy regarding your files. We do not store, view, or analyze the content of the files you transfer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">Data Collection Policy</h2>
                            <p className="mb-3">
                                <strong className="text-zinc-100">We collect minimal data necessary for the service to function:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                                <li><strong className="text-zinc-300">Volatile Connection Data:</strong> Temporary metadata (share codes, file type, file size) required to establish the peer-to-peer connection. This data is ephemeral and automatically purged after the transfer session.</li>
                                <li><strong className="text-zinc-300">No Personal Identifiable Information (PII):</strong> We do not require account creation, nor do we track user behavior or analytics.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">How We Secure Your Transfers</h2>
                            <p className="mb-3">
                                We utilize industry-standard security measures:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                                <li><strong className="text-zinc-300">End-to-End Encryption:</strong> All data transferred is encrypted using WebRTC&apos;s Datagram Transport Layer Security (DTLS), ensuring that only the intended recipient can access the files.</li>
                                <li><strong className="text-zinc-300">Secure Protocols:</strong> All signaling and site traffic occur over HTTPS.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">Third-Party Infrastructure</h2>
                            <p className="mb-3">
                                To facilitate connections, we use selected third-party services. These providers process data solely for the purpose of transmission and do not retain file content:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                                <li><strong className="text-zinc-300">Signaling & NAT Traversal:</strong> We use STUN/TURN servers to help devices connect through firewalls. These servers facilitate the handshake but do not store your data.</li>
                                <li><strong className="text-zinc-300">Hosting:</strong> Our static site is hosted on Vercel.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-zinc-100">Your Rights & Contact</h2>
                            <p className="mb-4">
                                As we maintain no persistent user data, traditional data subject rights (access, deletion) are fulfilled by design—there is no data to delete.
                            </p>
                            <p>
                                For privacy-related inquiries, please reach out via: {' '}
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
