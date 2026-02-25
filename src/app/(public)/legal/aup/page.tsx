export const metadata = {
    title: 'Acceptable Use Policy | Sendme.alt',
    description: 'Acceptable Use Policy (AUP) establishing rules against abuse for Sendme.alt.',
}

export default function AcceptableUsePolicy() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-8">Acceptable Use Policy (AUP)</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Last Updated: February 25, 2026</p>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">1. Purpose</h2>
                <p>
                    This Acceptable Use Policy (&quot;Policy&quot;) outlines the acceptable use of Sendme.alt (the &quot;Service&quot;). This Policy is designed to protect us, our users, and the Internet community from irresponsible, abusive, or illegal activities.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">2. Prohibited Content</h2>
                <p>You are strictly prohibited from utilizing the Service&apos;s signaling infrastructure to broker the transfer of the following types of content:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><strong>Illegal Content:</strong> Any materials that are unlawful, illicit, or promote illegal activities under any applicable laws.</li>
                    <li><strong>Malware and Exploits:</strong> Viruses, trojans, worms, logic bombs, ransomware, or any other material which is malicious or technologically harmful.</li>
                    <li><strong>Copyright Infringement:</strong> Unauthorized distribution of copyrighted material, trade secrets, software, or proprietary information.</li>
                    <li><strong>Exploitative Material:</strong> Content depicting the exploitation of minors, non-consensual explicit media, or any abusive imagery.</li>
                </ul>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">3. Network Abuse</h2>
                <p>We maintain strict rate limits to ensure fair availability of the Service. You agree not to engage in the following activities:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li><strong>Denial of Service:</strong> Intentionally overloading, flooding, or executing DDoS attacks against our signaling APIs or database endpoints.</li>
                    <li><strong>Automated Abuse:</strong> Rapidly generating transferring tokens, spamming WebRTC offers, or scraping the API via automated bots or scripts without explicit permission.</li>
                    <li><strong>Reverse Engineering:</strong> Attempting to probe, scan, or test the vulnerability of the system or network or to breach security or authentication measures.</li>
                </ul>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-white">4. Enforcement</h2>
                <p>
                    Because of our strict Zero-Knowledge architecture, we cannot technically monitor or audit the physical files passing peer-to-peer. Our enforcement of this Policy is therefore limited to the *signaling metadata*.
                </p>
                <p>
                    However, we maintain the sovereign right to permanently IP-ban or block access to the Service for any user discovered willfully violating this Acceptable Use Policy, engaging in network abuse, or threatening the operational continuity of our signaling servers.
                </p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">5. Reporting Abuse</h2>
                <p>
                    Given our decentralized approach, if you receive harmful or illegal files, please discard them and report the sender to your local cybercrime authorities. If you identify a network vulnerability or abuse of our signaling endpoints, please contact the developer via our GitHub repository.
                </p>
            </section>
        </div>
    )
}
