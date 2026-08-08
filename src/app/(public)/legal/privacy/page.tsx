import { Metadata } from 'next';
import { LegalPageLayout, LegalSection } from '../components';
import { legalConfig } from '../config';
import { APP_URLS } from '@/core/urls';
import { UserCheck, EyeOff, FileQuestion, History, Lock, Server, Cpu, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sendme.alt',
  description: 'Strict Zero-Knowledge architecture and data handling practices for Sendme.alt.',
  alternates: {
    canonical: `${APP_URLS.BASE_URL}/legal/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy | Sendme.alt',
    description: 'Strict Zero-Knowledge architecture and data handling practices for Sendme.alt.',
    url: `${APP_URLS.BASE_URL}/legal/privacy`,
  },
}

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction & Zero-Knowledge Commitment' },
  { id: 'data-collection', title: '2. Data Collection (What We Don\'t Collect)' },
  { id: 'architecture', title: '3. How Your Data Moves (WebRTC)' },
  { id: 'signaling-data', title: '4. Ephemeral Signaling Data' },
  { id: 'infrastructure', title: '5. Infrastructure & Security Logging' },
  { id: 'tracking', title: '6. Tracking & Third Parties' },
  { id: 'policy-updates', title: '7. Policy Modifications' },
];

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" sections={SECTIONS}>
      <LegalSection id="introduction" title={SECTIONS[0].title}>
        <p className="text-base sm:text-lg leading-relaxed">
          Welcome to <strong className="text-purple-600 dark:text-purple-400">{legalConfig.companyName}</strong>. Your privacy is not just a feature—it is the foundational premise of our architecture. 
          We operate on a strict Zero-Knowledge, peer-to-peer (P2P) framework. This Privacy Policy details exactly how your data is treated when utilizing our service.
        </p>
      </LegalSection>

      <LegalSection id="data-collection" title={SECTIONS[1].title}>
        <p className="mb-4 text-text-secondary">
          By design, our infrastructure is incapable of accessing your data. We inherently <strong className="text-text-primary">do not</strong> collect, process, or store:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <UserCheck className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">Personal Data</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">No names, email addresses, phone numbers, or account profiles are required or collected.</p>
          </div>

          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <EyeOff className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">File Contents</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">We have absolutely no visibility into the files you transfer. All data remains strictly on your device until transmitted directly to the recipient.</p>
          </div>

          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <FileQuestion className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">File Metadata</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">We do not log filenames, file sizes, or file types.</p>
          </div>

          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <History className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">Transfer Histories</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">No persistent logs of who you connect with or what you send are maintained.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="architecture" title={SECTIONS[2].title}>
        <p className="mb-4 text-text-secondary">
          {legalConfig.companyName} uses WebRTC to establish a direct connection between the sender and receiver.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="glass-card border border-border-subtle p-5 rounded-2xl border-l-4 border-l-purple-500 hover:border-purple-500/40 transition-all shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">End-to-End Encryption (E2EE)</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">All file transfers are secured via WebRTC&apos;s mandatory DTLS/SRTP encryption. We do not hold the cryptographic keys.</p>
          </div>

          <div className="glass-card border border-border-subtle p-5 rounded-2xl border-l-4 border-l-cyan-500 hover:border-cyan-500/40 transition-all shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">No Server Transit</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">Your files never pass through our backend databases, servers, or cloud storage. They go directly from device A to device B.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="signaling-data" title={SECTIONS[3].title}>
        <p className="text-text-secondary leading-relaxed">
          To broker the peer-to-peer connection, our backend functions solely as a temporary signaling server.
        </p>
        <div className="glass-card border border-purple-500/20 bg-purple-500/5 p-5 rounded-2xl mt-4">
          <div className="flex items-start gap-3">
            <Cpu className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              During the initial connection phase, we temporarily process routing metadata (such as IP addresses and WebRTC session descriptions). 
              <strong className="text-text-primary font-bold"> This data is highly ephemeral.</strong> It exists only in volatile memory for the brief seconds required to establish the connection and is atomically destroyed the moment the transfer begins, fails, or is cancelled.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="infrastructure" title={SECTIONS[4].title}>
        <p className="text-text-secondary leading-relaxed">
          To protect our signaling servers against abuse (e.g., DDoS attacks) and ensure service availability, our hosting providers may automatically collect standard web server logs.
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          This may include anonymized IP addresses, rate-limiting counters, and HTTP request headers. This data is strictly used for security, diagnostic, and performance purposes, is isolated from the file transfer process, and is routinely purged.
        </p>
      </LegalSection>

      <LegalSection id="tracking" title={SECTIONS[5].title}>
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            We do not use advertising trackers, marketing cookies, or invasive analytics. We do not sell, rent, or share any of your information with third-party marketers or data brokers under any circumstances.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="policy-updates" title={SECTIONS[6].title}>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          As our platform evolves, we may update this Privacy Policy. We reserve the right to modify these practices to comply with legal requirements or technical advancements. Continued use of the platform following any modifications constitutes acceptance of the updated policy.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
