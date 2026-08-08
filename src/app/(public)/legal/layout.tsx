'use client'

import { Navbar } from '@/layout/Navbar'
import { ScrollIndicator } from './ScrollIndicator'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="legal-scroll-container" className="h-[100dvh] w-full bg-bg-primary text-text-primary overflow-y-auto relative selection:bg-bg-elevated flex flex-col font-sans">
      {/* Background Ambient Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <ScrollIndicator />
      <Navbar variant="landing" />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 min-h-0">
        {children}
      </main>
    </div>
  )
}
