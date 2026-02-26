'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Shield, Github, Globe } from 'lucide-react'
import Link from 'next/link'

export function MobileLanding() {
    return (
        <div className="w-full h-[100dvh] flex flex-col bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-zinc-800">
            {/* Nav */}
            <header className="w-full flex items-center justify-between px-5 py-4 shrink-0 relative z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white">S</div>
                    <span className="font-semibold text-base tracking-tight text-white">sendme.alt</span>
                </div>
                <div className="flex items-center gap-3">
                    <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="GitHub">
                        <Github className="w-4 h-4" />
                    </a>
                    <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Portfolio">
                        <Globe className="w-4 h-4" />
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col items-center px-5 pt-8 pb-3 relative z-10 overflow-y-auto">
                <div className="w-full flex flex-col items-center text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-zinc-400 mb-5"
                    >
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Enterprise Grade WebRTC</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-4xl font-bold tracking-tight text-white leading-[1.1] mb-4"
                    >
                        Secure P2P<br />File Transfer.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-[15px] text-zinc-400 mb-8 leading-relaxed px-2"
                    >
                        No Signup. No Cloud. Up to 3GB. Direct device-to-device tunneling.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="flex flex-col gap-3 w-full max-w-xs"
                    >
                        <Link href="/transfer" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white active:bg-zinc-200 text-zinc-950 rounded-full font-semibold transition-colors w-full">
                            Send File
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/transfer" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 border border-zinc-800 active:bg-zinc-800 text-white rounded-full font-semibold transition-colors w-full">
                            Receive File
                        </Link>
                    </motion.div>
                </div>

                {/* Features Mini Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="w-full max-w-xs flex flex-col gap-2.5 mt-auto mb-4"
                >
                    {[
                        { icon: Zap, title: "Up to 3GB Instantly", desc: "No middleman limit" },
                        { icon: Lock, title: "E2E Encrypted", desc: "Strict WebRTC security" },
                        { icon: HardDrive, title: "No Cloud Storage", desc: "Files stay yours" },
                    ].map((ft, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                <ft.icon className="w-4 h-4 text-zinc-300" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-white text-[13px] font-medium leading-none mb-1">{ft.title}</span>
                                <span className="text-[11px] text-zinc-500 leading-none">{ft.desc}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="w-full flex flex-col items-center gap-3 px-5 py-5 shrink-0 border-t border-zinc-900 relative z-10 bg-zinc-950">
                <div className="flex items-center justify-center gap-6">
                    <Link href="/legal/privacy" className="text-[11px] text-zinc-600 active:text-white transition-colors">Privacy</Link>
                    <Link href="/legal/terms" className="text-[11px] text-zinc-600 active:text-white transition-colors">Terms</Link>
                    <Link href="/legal/aup" className="text-[11px] text-zinc-600 active:text-white transition-colors">Acceptable Use</Link>
                </div>
                <p className="text-[10px] text-zinc-600">Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-zinc-400 active:text-white transition-colors">Gaurav Patil</a> · <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-zinc-400 active:text-white transition-colors">GitHub</a></p>
            </footer>
        </div>
    )
}
