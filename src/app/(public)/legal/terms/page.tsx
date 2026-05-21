import { LegalPageLayout, LegalSection } from '../components';
import { legalConfig } from '../config';

export const metadata = {
  title: 'Terms of Service | Sendme.alt',
  description: 'Strict Terms of Service and Limitation of Liability for Sendme.alt.',
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
        <p>
          By accessing and using <strong>{legalConfig.companyName}</strong> (the &quot;Service&quot;), you enter into a legally binding agreement to abide by these Terms of Service. If you do not agree with any provision of these terms, you must immediately cease use of the Service.
        </p>
      </LegalSection>

      <LegalSection id="service-description" title={SECTIONS[1].title}>
        <p>
          {legalConfig.companyName} operates strictly as an ephemeral peer-to-peer (P2P) file transfer utility. We provide the temporary signaling infrastructure required to broker a direct, encrypted connection between two independent client devices. 
        </p>
        <p className="mt-4">
          <strong>We are not a cloud storage provider.</strong> We do not host, intercept, archive, or process the contents of any files transferred through the Service.
        </p>
      </LegalSection>

      <LegalSection id="user-liability" title={SECTIONS[2].title}>
        <p className="mb-4">
          You acknowledge that all file transfers are conducted entirely at your own risk. By using the Service, you accept absolute responsibility for:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl">
            <h3 className="font-bold text-text-primary mb-2">Content Legality</h3>
            <p className="text-sm">Ensuring that all data you transmit complies fully with applicable local, national, and international laws.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl">
            <h3 className="font-bold text-text-primary mb-2">Intellectual Property</h3>
            <p className="text-sm">Holding the legal right, license, or copyright authorization to distribute the files you share.</p>
          </div>
          <div className="bg-bg-surface border border-border-subtle p-5 rounded-xl">
            <h3 className="font-bold text-text-primary mb-2">Device Security</h3>
            <p className="text-sm">Protecting your own hardware from potential threats (e.g., malware or viruses) that you may receive from other peers.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="prohibited-conduct" title={SECTIONS[3].title}>
        <p>
          Any abuse of our infrastructure will result in immediate termination of access. You are strictly prohibited from using the Service to transfer malicious payloads, illegal materials, or to conduct any form of network abuse against our servers. 
        </p>
        <p className="mt-4">
          For explicit definitions of banned activities and content, you must review our comprehensive <strong>Acceptable Use Policy (AUP)</strong>.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer" title={SECTIONS[4].title}>
        <p className="uppercase text-xs font-bold tracking-wider text-color-warning mb-3">Please read carefully</p>
        <div className="bg-color-warning/10 border border-color-warning/30 p-6 rounded-xl">
          <p className="font-bold text-text-primary text-lg leading-snug">
            THE SERVICE IS PROVIDED ON AN &quot;AS-IS&quot; AND &quot;AS-AVAILABLE&quot; BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE.
          </p>
          <p className="mt-4 text-sm text-text-secondary">
            We make no guarantee that the Service will be secure, uninterrupted, error-free, or function across all network topologies (e.g., restrictive NATs/Firewalls). We do not warrant the safety or integrity of any files you receive.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="limitation-liability" title={SECTIONS[5].title}>
        <div className="bg-color-error/10 border border-color-error/30 p-6 rounded-xl">
          <p className="font-bold text-text-primary text-lg leading-snug">
            IN NO EVENT SHALL {legalConfig.companyName}, ITS CREATORS, CONTRIBUTORS, OR HOSTS BE HELD LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
          </p>
          <p className="mt-4 text-sm text-text-secondary">
            This includes, without limitation, loss of profits, data, hardware damage, network compromise, or legal repercussions resulting from your use of, or inability to use, the Service. Your sole remedy for dissatisfaction is to stop using the platform.
          </p>
        </div>
      </LegalSection>

      <LegalSection id="termination" title={SECTIONS[6].title}>
        <p>
          We retain the unilateral right to throttle, restrict, suspend, or permanently terminate the Service, or any individual&apos;s access to it, at our sole discretion, without prior notice or liability.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
