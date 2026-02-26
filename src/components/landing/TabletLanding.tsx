'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Trash2, Globe, Shield, Github } from 'lucide-react'
import Link from 'next/link'

export function TabletLanding() {
    return (
        <div className="w-full h-[100dvh] flex flex-col bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-zinc-800">
            {/* Nav */}
            <header className="w-full flex items-center justify-between px-8 py-5 shrink-0 relative z-10 border-b border-zinc-900">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-sm text-white">S</div>
                    <span className="font-semibold text-lg tracking-tight text-white">sendme.alt</span>
                </div>
                <div className="flex items-center gap-3">
                    <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
                        <Github className="w-4 h-4" />
                    </a>
                    <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Portfolio">
                        <Globe className="w-4 h-4" />
                    </a>
                    <Link href="/transfer" className="px-5 py-2 text-sm font-medium bg-white text-zinc-950 hover:bg-zinc-200 rounded-full transition-colors">Start Sending</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col items-center justify-center p-8 relative z-10 max-w-3xl mx-auto overflow-y-auto mt-4">

                {/* Hero */}
                <div className="w-full flex flex-col items-center text-center max-w-2xl mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6"
                    >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Enterprise Grade WebRTC</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl font-bold tracking-tight text-white leading-tight mb-4"
                    >
                        Secure P2P File Transfer.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-lg"
                    >
                        No Signup. No Cloud. Up to 3GB. Direct device-to-device tunneling ensures your data stays yours.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-row items-center justify-center gap-4 w-full"
                    >
                        <Link href="/transfer" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 rounded-full font-semibold transition-all group w-48">
                            Send File
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/transfer" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-full font-semibold transition-all w-48">
                            Receive File
                        </Link>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full"
                    >
                        {[
                            { icon: Zap, title: "Up to 3GB", desc: "Massive files instantly." },
                            { icon: Lock, title: "E2E Encrypted", desc: "Data strictly encrypted in transit." },
                            { icon: HardDrive, title: "No Storage", desc: "Files fly straight to peer." },
                            { icon: Trash2, title: "Auto Cleanup", desc: "Tokens destroyed securely." },
                            { icon: Globe, title: "Cross Browser", desc: "Chromium, Firefox, WebKit." },
                            { icon: Shield, title: "Direct Connect", desc: "Complete peer-to-peer channel." },
                        ].map((ft, idx) => (
                            <div key={idx} className="flex flex-col p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 items-center text-center">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                                    <ft.icon className="w-4 h-4 text-zinc-300" />
                                </div>
                                <h3 className="text-white text-sm font-medium mb-1">{ft.title}</h3>
                                <p className="text-[11px] text-zinc-500 leading-relaxed">{ft.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full flex flex-row items-center justify-between px-8 py-5 shrink-0 border-t border-zinc-900 relative z-10">
                <p className="text-xs text-zinc-600">© 2026 sendme.alt · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">Gaurav Patil</a></p>
                <div className="flex items-center gap-4">
                    <Link href="/legal/privacy" className="text-[11px] text-zinc-500 hover:text-white transition-colors">Privacy</Link>
                    <Link href="/legal/terms" className="text-[11px] text-zinc-500 hover:text-white transition-colors">Terms</Link>
                    <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
                        <Github className="w-3.5 h-3.5" />
                    </a>
                </div>
            </footer>
        </div>
    )
}
