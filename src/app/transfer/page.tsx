import { Suspense } from 'react'
import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { MainEngine } from '@/components/MainEngine'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function TransferPage() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-bg-primary text-text-primary overflow-hidden selection:bg-bg-elevated relative">
      {/* Background Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <Navbar variant="app" />
      <main className="flex-1 min-h-0 flex items-center justify-center relative z-10 px-4 sm:px-8 lg:px-16 py-4 w-full">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-6 h-full max-h-full animate-pulse">
              <div className="flex justify-center shrink-0 h-10" />
              <div className="relative w-full flex-1 min-h-0 rounded-2xl glass-panel" />
            </div>
          }>
            <MainEngine />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
