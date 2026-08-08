import { Metadata } from 'next';
import { LegalPageLayout, LegalSection } from '../components';
import { legalConfig } from '../config';
import { APP_URLS } from '@/core/urls';
import { FileCheck, ShieldAlert, Laptop, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Sendme.alt',
  description: 'Strict Terms of Service and Limitation of Liability for Sendme.alt.',
  alternates: {
    canonical: `${APP_URLS.BASE_URL}/legal/terms`,
  },
  openGraph: {
    title: 'Terms of Service | Sendme.alt',
    description: 'Strict Terms of Service and Limitation of Liability for Sendme.alt.',
    url: `${APP_URLS.BASE_URL}/legal/terms`,
  },
}

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'service-description', title: '2. Description of the Service' },
  { id: 'user-liability', title: '3. User Responsibility & Liability' },
  { id: 'prohibited-conduct', title: '4. Prohibited Conduct' },
  { id: 'disclaimer', title: '5. Disclaimer of Warranties' },
  { id: 'limitation-liability', title: '6. Limitation of Liability' },
  { id: 'termination', title: '7. Service Modification & Termination' },
];

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" sections={SECTIONS}>
      <LegalSection id="acceptance" title={SECTIONS[0].title}>
        <p className="text-base sm:text-lg leading-relaxed">
          By accessing and using <strong className="text-purple-600 dark:text-purple-400">{legalConfig.companyName}</strong> (the &quot;Service&quot;), you enter into a legally binding agreement to abide by these Terms of Service. If you do not agree with any provision of these terms, you must immediately cease use of the Service.
        </p>
      </LegalSection>

      <LegalSection id="service-description" title={SECTIONS[1].title}>
        <p className="text-text-secondary leading-relaxed">
          {legalConfig.companyName} operates strictly as an ephemeral peer-to-peer (P2P) file transfer utility. We provide the temporary signaling infrastructure required to broker a direct, encrypted connection between two independent client devices. 
        </p>
        <div className="glass-card border border-purple-500/20 bg-purple-500/5 p-4 rounded-2xl mt-4">
          <p className="text-xs sm:text-sm text-text-primary font-medium">
            <strong>We are not a cloud storage provider.</strong> We do not host, intercept, archive, or process the contents of any files transferred through the Service.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="user-liability" title={SECTIONS[2].title}>
        <p className="mb-4 text-text-secondary">
          You acknowledge that all file transfers are conducted entirely at your own risk. By using the Service, you accept absolute responsibility for:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-4 h-4 text-purple-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">Content Legality</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">Ensuring that all data you transmit complies fully with applicable local, national, and international laws.</p>
          </div>

          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-cyan-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">Intellectual Property</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">Holding the legal right, license, or copyright authorization to distribute the files you share.</p>
          </div>

          <div className="glass-card border border-border-subtle p-5 rounded-2xl hover:border-purple-500/30 transition-all shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-text-primary text-sm sm:text-base">Device Security</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">Protecting your own hardware from potential threats (e.g., malware or viruses) that you may receive from other peers.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="prohibited-conduct" title={SECTIONS[3].title}>
        <p className="text-text-secondary leading-relaxed">
          Any abuse of our infrastructure will result in immediate termination of access. You are strictly prohibited from using the Service to transfer malicious payloads, illegal materials, or to conduct any form of network abuse against our servers. 
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          For explicit definitions of banned activities and content, you must review our comprehensive <strong>Acceptable Use Policy (AUP)</strong>.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" title={SECTIONS[4].title}>
        <p className="uppercase text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> Please read carefully
        </p>
        <div className="glass-card bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl">
          <p className="font-extrabold text-text-primary text-base sm:text-lg leading-snug">
            THE SERVICE IS PROVIDED ON AN &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE.
          </p>
          <p className="mt-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            We make no guarantee that the Service will be secure, uninterrupted, error-free, or function across all network topologies (e.g., restrictive NATs/Firewalls). We do not warrant the safety or integrity of any files you receive.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="limitation-liability" title={SECTIONS[5].title}>
        <div className="glass-card bg-rose-500/10 border border-rose-500/30 p-6 rounded-2xl">
          <p className="font-extrabold text-text-primary text-base sm:text-lg leading-snug flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>IN NO EVENT SHALL {legalConfig.companyName}, ITS CREATORS, CONTRIBUTORS, OR HOSTS BE HELD LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</span>
          </p>
          <p className="mt-4 text-xs sm:text-sm text-text-secondary leading-relaxed">
            This includes, without limitation, loss of profits, data, hardware damage, network compromise, or legal repercussions resulting from your use of, or inability to use, the Service. Your sole remedy for dissatisfaction is to stop using the platform.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="termination" title={SECTIONS[6].title}>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          We retain the unilateral right to throttle, restrict, suspend, or permanently terminate the Service, or any individual&apos;s access to it, at our sole discretion, without prior notice or liability.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
