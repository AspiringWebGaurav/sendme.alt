export const metadata = {
    title: 'Terms of Service | Sendme.alt',
    description: 'Terms of Service and Limitation of Liability for Sendme.alt.',
}

export default function TermsOfService() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-8">Terms of Service</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Last Updated: February 25, 2026</p>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
                <p>
                    By accessing or using Sendme.alt (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">2. Description of Service</h2>
                <p>
                    Sendme.alt is a peer-to-peer (P2P) file transfer utility. The Service provides a temporary signaling infrastructure to broker a direct, encrypted WebRTC connection between two independent devices. We do not host, store, intercept, or process the contents of any transferred files.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">3. User Responsibilities</h2>
                <p>You agree to use the Service strictly in accordance with all applicable local, state, national, and international laws. You are solely responsible for:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>The legality, integrity, and safety of the files you choose to transfer.</li>
                    <li>Ensuring you have the legal right or copyright authorization to distribute said files.</li>
                    <li>Any damages, legal repercussions, or data loss occurring on your device as a result of using the Service.</li>
                </ul>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">4. Prohibited Uses</h2>
                <p>
                    You may not use the Service for the transmission of malware, illegal material, explicit non-consensual content, or to execute denial-of-service (DDoS) attacks against the signaling backend. For a comprehensive list of restrictions, please see our Acceptable Use Policy (AUP).
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">5. &quot;As-Is&quot; Software and Disclaimer of Warranties</h2>
                <p>
                    THE SERVICE IS PROVIDED ON AN &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE, WITH RESPECT TO THE SERVICE, INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
                <p>
                    We do not warrant that the Service will meet your requirements, achieve any intended results, be compatible or work with any other software, applications, systems, or services, operate without interruption, meet any performance or reliability standards, or be error-free.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">6. Limitation of Liability</h2>
                <p>
                    IN NO EVENT SHALL THE CREATORS, DEVELOPERS, OR HOSTS OF SENDME.ALT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">7. Service Availability</h2>
                <p>
                    We reserve the right to withdraw, amend, terminate, or throttle the Service in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.
                </p>
            </section>
        </div>
    )
}
