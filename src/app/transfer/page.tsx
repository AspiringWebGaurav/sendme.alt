import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { MainEngine } from '@/components/MainEngine'
import { ErrorBoundary } from '@/components/ErrorBoundary'

type AppMode = 'send' | 'receive'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  const initialMode: AppMode = mode === 'receive' ? 'receive' : 'send'

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-bg-primary text-text-primary overflow-hidden selection:bg-bg-elevated relative">
      {/* Background Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <Navbar variant="app" />
      <main className="flex-1 min-h-0 flex items-center justify-center relative z-10 px-3 py-2 sm:px-6 sm:py-4 lg:p-6 w-full max-w-4xl mx-auto">
        <ErrorBoundary>
          <MainEngine initialMode={initialMode} />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
