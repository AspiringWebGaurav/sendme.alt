'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Trash2, Globe, Shield, Github } from 'lucide-react'
import Link from 'next/link'

export function DesktopLanding() {
    return (
        <div className="w-full h-[100dvh] flex flex-col bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-zinc-800">
            {/* Nav */}
            <header className="w-full flex items-center justify-between px-12 py-6 shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-lg text-white">S</div>
                    <span className="font-semibold text-xl tracking-tight text-white">sendme.alt</span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
                        <Github className="w-4 h-4" />
                    </a>
                    <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Portfolio">
                        <Globe className="w-4 h-4" />
                    </a>
                    <Link href="/transfer" className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors">Receive</Link>
                    <Link href="/transfer" className="px-5 py-2.5 text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-200 rounded-full transition-colors hidden sm:block">Start Sending</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex items-center justify-between px-12 lg:px-24 relative z-10 max-w-7xl mx-auto">

                {/* Left Side: Hero */}
                <div className="w-1/2 flex flex-col items-start justify-center pr-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8"
                    >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enterprise Grade WebRTC</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6"
                    >
                        Secure P2P <br /><span className="text-zinc-500">File Transfer.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg lg:text-xl text-zinc-400 mb-10 max-w-md leading-relaxed"
                    >
                        No Signup. No Cloud. Up to 3GB. Direct device-to-device tunneling ensures your files never hit a third-party server.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex items-center gap-4 w-full"
                    >
                        <Link href="/transfer" className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-zinc-200 text-zinc-950 rounded-full font-semibold transition-all group">
                            Send File
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/transfer" className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-full font-semibold transition-all">
                            Receive File
                        </Link>
                    </motion.div>
                </div>

                {/* Right Side: Features Grid */}
                <div className="w-1/2 h-full flex items-center justify-end">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="grid grid-cols-2 gap-4 w-full max-w-lg"
                    >
                        {[
                            { icon: Zap, title: "Up to 3GB", desc: "Send massive files instantly via direct local or global peer networks." },
                            { icon: Lock, title: "End-to-End Encrypted", desc: "Data is encrypted in transit using mandatory WebRTC protocols." },
                            { icon: HardDrive, title: "No Storage", desc: "We don't hold your data. Files fly straight from you to them." },
                            { icon: Trash2, title: "Auto Cleanup", desc: "Signaling tokens are securely destroyed the moment you disconnect." },
                            { icon: Globe, title: "Cross Browser", desc: "Works seamlessly across Chromium, Firefox, and WebKit engines." },
                            { icon: Shield, title: "Direct Connect", desc: "Bypass the middleman. Complete peer-to-peer data channels." },
                        ].map((ft, idx) => (
                            <div key={idx} className="flex flex-col p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                    <ft.icon className="w-5 h-5 text-zinc-300" />
                                </div>
                                <h3 className="text-white font-medium mb-1.5">{ft.title}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">{ft.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full flex items-center justify-between px-12 py-6 shrink-0 border-t border-zinc-900 relative z-10">
                <p className="text-xs text-zinc-600">© 2026 sendme.alt · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Gaurav Patil</a></p>
                <div className="flex items-center gap-6">
                    <Link href="/legal/privacy" className="text-xs text-zinc-500 hover:text-white transition-colors">Privacy</Link>
                    <Link href="/legal/terms" className="text-xs text-zinc-500 hover:text-white transition-colors">Terms</Link>
                    <Link href="/legal/aup" className="text-xs text-zinc-500 hover:text-white transition-colors">Acceptable Use</Link>
                    <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
                        <Github className="w-3.5 h-3.5" />
                    </a>
                </div>
            </footer>
        </div>
    )
}
