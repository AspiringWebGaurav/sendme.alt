import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/layout/Navbar'
import { Footer } from '@/layout/Footer'
import { APP_URLS, getCanonicalUrl } from '@/core/urls'

export const metadata: Metadata = {
    title: 'MIT License',
    description: `License information for ${APP_URLS.APP_NAME}`,
    alternates: { canonical: getCanonicalUrl('/license') }
}

export default function LicensePage() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col h-full w-full bg-zinc-950 text-zinc-50 selection:bg-zinc-800">
            <Navbar />
            <main className="flex-1 w-full overflow-y-auto p-6 sm:p-12">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/"
                        className="inline-block mb-8 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium"
                    >
                        ← Back to App
                    </Link>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-zinc-50">MIT License</h1>

                    <div className="space-y-6 text-zinc-300 text-sm sm:text-base leading-relaxed font-mono bg-zinc-900 border border-white/10 p-6 sm:p-8 rounded-2xl">
                        <p>Copyright (c) {currentYear} Gaurav Patil</p>

                        <p>
                            Permission is hereby granted, free of charge, to any person obtaining a copy
                            of this software and associated documentation files (the &quot;Software&quot;), to deal
                            in the Software without restriction, including without limitation the rights
                            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                            copies of the Software, and to permit persons to whom the Software is
                            furnished to do so, subject to the following conditions:
                        </p>

                        <p>
                            The above copyright notice and this permission notice shall be included in all
                            copies or substantial portions of the Software.
                        </p>

                        <p>
                            THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                            SOFTWARE.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
