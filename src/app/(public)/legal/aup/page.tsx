import { LegalPageLayout, LegalSection } from '../components';
import { legalConfig } from '../config';

export const metadata = {
  title: 'Acceptable Use Policy | Sendme.alt',
  description: 'Strict Acceptable Use Policy (AUP) establishing zero-tolerance rules against abuse.',
}

const SECTIONS = [
  { id: 'purpose', title: '1. Purpose & Enforcement Scope' },
  { id: 'zero-tolerance-content', title: '2. Zero-Tolerance Content' },
  { id: 'network-abuse', title: '3. System & Network Abuse' },
  { id: 'spam', title: '4. Spam & Unauthorized Sharing' },
  { id: 'reporting', title: '5. Incident Reporting & Law Enforcement' },
];

export default function AcceptableUsePolicy() {
  return (
    <LegalPageLayout title="Acceptable Use Policy (AUP)" sections={SECTIONS}>
      <LegalSection id="purpose" title={SECTIONS[0].title}>
        <p>
          This Acceptable Use Policy (&quot;Policy&quot;) establishes a zero-tolerance framework for the use of <strong>{legalConfig.companyName}</strong>. By utilizing our signaling infrastructure, you agree to comply entirely with these strict constraints.
        </p>
        <p className="mt-4">
          While our Zero-Knowledge architecture prevents us from directly auditing the contents of the physical files you transfer, we heavily monitor our signaling endpoints. We possess the capability and the sovereign right to permanently ban network access for any entity identified as abusing the platform.
        </p>
      </LegalSection>

      <LegalSection id="zero-tolerance-content" title={SECTIONS[1].title}>
        <p className="mb-4">
          You are unequivocally prohibited from utilizing our Service to broker the transfer of the following materials. Violation will result in immediate termination of access:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-error">
            <h3 className="font-bold text-text-primary mb-2">Illegal Content</h3>
            <p className="text-sm">Any materials that violate local, state, federal, or international law, including the promotion of terrorism, illegal arms, or illicit narcotics.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-error">
            <h3 className="font-bold text-text-primary mb-2">Malware & System Exploits</h3>
            <p className="text-sm">Distributing viruses, trojans, ransomware, logic bombs, or any malicious code engineered to compromise hardware, software, or network security.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-error">
            <h3 className="font-bold text-text-primary mb-2">Exploitative & Extreme Material</h3>
            <p className="text-sm">Any content depicting the exploitation of minors, non-consensual explicit media, or extreme real-world violence.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-error">
            <h3 className="font-bold text-text-primary mb-2">Piracy & Copyright Abuse</h3>
            <p className="text-sm">Engaging in the unauthorized distribution of copyrighted works, proprietary software (warez), trade secrets, or stolen databases.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="network-abuse" title={SECTIONS[2].title}>
        <p className="mb-4">
          Our infrastructure exists to facilitate peer-to-peer handshakes. You agree not to degrade or weaponize this infrastructure. The following actions are strictly banned:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-warning">
            <h3 className="font-bold text-text-primary mb-2">Denial of Service (DoS/DDoS)</h3>
            <p className="text-sm">Intentionally overloading, flooding, or executing volumetric attacks against our signaling APIs or WebRTC STUN/TURN servers.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-warning">
            <h3 className="font-bold text-text-primary mb-2">Automated Exploitation</h3>
            <p className="text-sm">Utilizing scripts, bots, or scrapers to rapidly generate transfer tokens, spam WebRTC offers, or harvest connection metadata.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl border-l-4 border-l-color-warning">
            <h3 className="font-bold text-text-primary mb-2">Platform Weaponization</h3>
            <p className="text-sm">Using the Service as a command-and-control (C2) channel or attempting to reverse-engineer our endpoints to bypass rate limits.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="spam" title={SECTIONS[3].title}>
        <p>
          {legalConfig.companyName} is built for intentional, consent-driven file sharing. You may not use the Service to distribute unsolicited mass messages, spam files, or trick unaware users into accepting unwanted payloads.
        </p>
      </LegalSection>

      <LegalSection id="reporting" title={SECTIONS[4].title}>
        <p>
          Because we do not host user data, we cannot comply with takedown requests for specific files. However, we aggressively enforce IP-level bans against abusers of our signaling network.
        </p>
        <p className="mt-4">
          If you receive dangerous files, immediately discard them and report the sender to your local cybersecurity authorities. To report critical network abuse or API exploitation, please alert our security team via our official GitHub repository. We cooperate fully with law enforcement regarding systemic network attacks.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
