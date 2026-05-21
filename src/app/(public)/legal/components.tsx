import { ReactNode } from 'react';
import Link from 'next/link';
import { legalConfig } from './config';

export function LegalHeader({ title }: { title: string }) {
  return (
    <header className="mb-12 border-b border-border-subtle pb-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary tracking-tight mb-6">
        {title}
      </h1>
      <div className="inline-flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-text-secondary bg-bg-elevated/50 p-4 rounded-xl border border-border-subtle">
        <p>
          <span className="font-semibold text-text-primary">Effective Date:</span> {legalConfig.effectiveDate}
        </p>
        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border-strong" />
        <p>
          <span className="font-semibold text-text-primary">Last Updated:</span> {legalConfig.lastUpdated}
        </p>
      </div>
    </header>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="bg-bg-elevated/30 border border-border-subtle rounded-2xl p-6 md:p-8 hover:bg-bg-elevated/50 transition-colors shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary border-b border-border-subtle pb-4 mb-6">
          {title}
        </h2>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}

export function LegalFooterNote() {
  return (
    <div className="mt-16 pt-8 text-sm text-text-muted italic bg-bg-elevated/20 p-6 rounded-xl border border-border-subtle">
      This document forms a binding agreement. By continuing to use {legalConfig.companyName}, you acknowledge that you have read, understood, and agreed to these terms in their entirety. For any legal inquiries or reports of abuse, please contact the maintainers via our official GitHub repository.
    </div>
  );
}

export function LegalPageLayout({ 
  title, 
  sections, 
  children 
}: { 
  title: string; 
  sections: { id: string; title: string }[]; 
  children: ReactNode;
}) {
  return (
    <div className="w-full">
      <LegalHeader title={title} />
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Sticky Sidebar Navigation (Desktop) / Inline Nav (Mobile) */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-12 bg-bg-surface border border-border-subtle rounded-xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Contents</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <Link 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated py-2 px-3 rounded-lg transition-colors"
                >
                  {section.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8 min-w-0">
          {children}
          <LegalFooterNote />
        </div>
      </div>
    </div>
  );
}
