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
      <main className="flex-1 min-h-0 flex items-center justify-center relative z-10 px-4 sm:px-8 lg:px-16 py-4 w-full">
        <ErrorBoundary>
          <MainEngine initialMode={initialMode} />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
