export const metadata = {
    title: 'Privacy Policy | Sendme.alt',
    description: 'Privacy Policy and Zero-Knowledge architecture details for Sendme.alt.',
}

export default function PrivacyPolicy() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-8">Privacy Policy</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Last Updated: February 25, 2026</p>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">1. Introduction</h2>
                <p>
                    Welcome to Sendme.alt (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting it through our strict adherence to a Zero-Knowledge architecture. This Privacy Policy outlines our data handling practices.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">2. Zero-Knowledge Architecture</h2>
                <p>
                    Sendme.alt is designed from the ground up as a peer-to-peer (P2P) file transfer service utilizing WebRTC.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><strong>No Server Transit:</strong> Your files are transferred directly between the sender&apos;s and receiver&apos;s devices. At no point do your files pass through, reside on, or get cached by our servers.</li>
                    <li><strong>End-to-End Encryption:</strong> All transfers are secured using WebRTC&apos;s mandatory built-in encryption protocols (DTLS and SRTP). We do not have access to the cryptographic keys used to secure your transfer.</li>
                    <li><strong>No Data Retention:</strong> Our backend strictly functions as a highly ephemeral signaling server to establish the initial connection. All signaling data, including session tokens and IP metadata used for establishing paths, is instantly destroyed via an atomic cleanup process the moment the connection completes, fails, or is cancelled.</li>
                </ul>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">3. Information We Do Not Collect</h2>
                <p>Because of our operational model, we inherently <strong>do not</strong> collect, track, or store:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Personal Identifiable Information (Names, Emails, Phone numbers)</li>
                    <li>The contents, filenames, or metadata of the files you transfer</li>
                    <li>User accounts or authentication profiles (as we require no sign-up)</li>
                    <li>Persistent logs of transfer activity</li>
                </ul>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">4. Information Collected Automatically</h2>
                <p>
                    To maintain the operational security and stability of our signaling infrastructure, our hosting providers may temporarily collect minimal diagnostic data (such as anonymized IP addresses and request headers) strictly for DDoS prevention, rate limiting, and incident response. This data is not linked to your file transfers and is routinely purged.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">5. Cookies and Tracking</h2>
                <p>
                    Sendme.alt does not use cookies, pixels, or any cross-site tracking technologies.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">6. Changes to this Policy</h2>
                <p>
                    We may update this Privacy Policy occasionally to reflect changes in our operational or legal obligations. We reserve the right to modify this document freely, and continued use of the service constitutes acceptance of these changes.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">7. Contact</h2>
                <p>
                    For privacy inquiries or compliance reporting, please contact us through the appropriate channels linked on our main application interface or GitHub repository.
                </p>
            </section>
        </div>
    )
}
