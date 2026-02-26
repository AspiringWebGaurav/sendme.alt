import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { MainEngine } from '@/components/MainEngine'

export default function Home() {
    return (
        <div className="flex flex-col h-[100dvh] w-full bg-zinc-950 text-zinc-50 overflow-hidden selection:bg-zinc-800">
            <Navbar />
            <main className="flex-1 min-h-0 flex items-center justify-center relative px-4 py-2 sm:p-6 lg:p-8">
                <MainEngine />
            </main>
            <Footer />
        </div>
    )
}
