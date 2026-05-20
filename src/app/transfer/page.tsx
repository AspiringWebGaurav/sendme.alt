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
        <div className="flex flex-col h-[100dvh] w-full bg-zinc-950 text-zinc-50 overflow-hidden selection:bg-zinc-800">
            <Navbar variant="app" />
            <main className="flex-1 min-h-0 flex items-center justify-center relative px-4 py-2 sm:p-6 lg:p-8">
                <ErrorBoundary>
                    <MainEngine initialMode={initialMode} />
                </ErrorBoundary>
            </main>
            <Footer />
        </div>
    )
}
