'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

import { Navbar } from '@/layout/Navbar'

export function MobileLanding() {
 return (
 <div className="w-full h-[100dvh] flex flex-col bg-bg-primary text-text-primary overflow-hidden font-sans selection:bg-bg-elevated">
 {/* Nav */}
 <Navbar variant="landing" />

 {/* Main Content */}
 <main className="flex-1 w-full flex flex-col items-center px-5 pt-8 pb-3 relative z-10 overflow-y-auto">
 <div className="w-full flex flex-col items-center text-center mb-8">
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.4 }}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface border border-border-subtle text-[10px] font-medium text-text-secondary mb-5"
 >
 <Shield className="w-3 h-3 text-emerald-400" />
 <span>Enterprise Grade WebRTC</span>
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.1 }}
 className="text-4xl font-bold tracking-tight text-text-primary leading-[1.1] mb-4"
 >
 Secure P2P<br />File Transfer.
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.2 }}
 className="text-[15px] text-text-secondary mb-8 leading-relaxed px-2"
 >
 No Signup. No Cloud. Up to 10GB. Direct device-to-device tunneling.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.3 }}
 className="flex flex-col gap-3 w-full max-w-xs"
 >
 <Link href="/transfer?mode=send" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-text-primary active:bg-text-secondary text-text-inverse rounded-full font-semibold transition-colors w-full">
 Send File
 <ArrowRight className="w-4 h-4" />
 </Link>
 <Link href="/transfer?mode=receive" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-bg-surface border border-border-subtle active:bg-bg-elevated text-text-primary rounded-full font-semibold transition-colors w-full">
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
 { icon: Zap, title: "Up to 10GB Instantly", desc: "No middleman limit" },
 { icon: Lock, title: "E2E Encrypted", desc: "Strict WebRTC security" },
 { icon: HardDrive, title: "No Cloud Storage", desc: "Files stay yours" },
 ].map((ft, idx) => (
 <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-bg-surface/40 border border-border-subtle/50">
 <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center shrink-0">
 <ft.icon className="w-4 h-4 text-text-secondary" />
 </div>
 <div className="flex flex-col text-left">
 <span className="text-text-primary text-[13px] font-medium leading-none mb-1">{ft.title}</span>
 <span className="text-[11px] text-text-muted leading-none">{ft.desc}</span>
 </div>
 </div>
 ))}
 </motion.div>
 </main>

 {/* Footer */}
 <footer className="w-full flex flex-col items-center gap-3 px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shrink-0 border-t border-border-strong relative z-10 bg-bg-primary">
 <div className="flex items-center justify-center gap-6">
 <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted active:text-text-primary transition-colors">Privacy</Link>
 <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted active:text-text-primary transition-colors">Terms</Link>
 <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted active:text-text-primary transition-colors">Acceptable Use</Link>
 </div>
 <p className="text-[10px] text-text-muted">Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="relative font-semibold text-text-primary hover:text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-gradient-to-r after:from-color-primary after:to-color-accent after:transition-transform after:duration-300 after:ease-in-out">Gaurav Patil</a> · <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary active:text-text-primary transition-colors">GitHub</a></p>
 </footer>
 </div>
 )
}
