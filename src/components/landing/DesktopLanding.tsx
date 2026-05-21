'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Trash2, Globe, Shield } from 'lucide-react'
import { Github } from 'lucide-react'
import Link from 'next/link'

import { Navbar } from '@/layout/Navbar'

export function DesktopLanding() {
 return (
 <div className="w-full h-[100dvh] flex flex-col bg-bg-primary text-text-primary overflow-hidden font-sans selection:bg-bg-elevated">
 {/* Nav */}
 <Navbar variant="landing" />

 {/* Main Content */}
 <main className="flex-1 w-full flex items-center justify-between px-12 lg:px-24 relative z-10 max-w-7xl mx-auto">

 {/* Left Side: Hero */}
 <div className="w-1/2 flex flex-col items-start justify-center pr-12">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border-subtle text-xs font-medium text-text-secondary mb-8"
 >
 <Shield className="w-3.5 h-3.5 text-emerald-400" />
 <span>Enterprise Grade WebRTC</span>
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className="text-5xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.05] mb-6"
 >
 Secure P2P <br /><span className="text-text-muted">File Transfer.</span>
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="text-lg lg:text-xl text-text-secondary mb-10 max-w-md leading-relaxed"
 >
 No Signup. No Cloud. Up to 10GB. Direct device-to-device tunneling ensures your files never hit a third-party server.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.3 }}
 className="flex items-center gap-4 w-full"
 >
 <Link href="/transfer?mode=send" className="flex items-center justify-center gap-2 px-8 py-4 bg-text-primary hover:bg-text-secondary text-text-inverse rounded-full font-semibold transition-all group">
 Send File
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 <Link href="/transfer?mode=receive" className="flex items-center justify-center gap-2 px-8 py-4 bg-bg-surface border border-border-subtle hover:bg-bg-elevated text-text-primary rounded-full font-semibold transition-all">
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
 { icon: Zap, title: "Up to 10GB", desc: "Send massive files instantly via direct local or global peer networks." },
 { icon: Lock, title: "End-to-End Encrypted", desc: "Data is encrypted in transit using mandatory WebRTC protocols." },
 { icon: HardDrive, title: "No Storage", desc: "We don't hold your data. Files fly straight from you to them." },
 { icon: Trash2, title: "Auto Cleanup", desc: "Signaling tokens are securely destroyed the moment you disconnect." },
 { icon: Globe, title: "Cross Browser", desc: "Works seamlessly across Chromium, Firefox, and WebKit engines." },
 { icon: Shield, title: "Direct Connect", desc: "Bypass the middleman. Complete peer-to-peer data channels." },
 ].map((ft, idx) => (
 <div key={idx} className="flex flex-col p-5 rounded-2xl bg-bg-surface/50 border border-border-subtle/50">
 <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
 <ft.icon className="w-5 h-5 text-text-secondary" />
 </div>
 <h3 className="text-text-primary font-medium mb-1.5">{ft.title}</h3>
 <p className="text-xs text-text-muted leading-relaxed">{ft.desc}</p>
 </div>
 ))}
 </motion.div>
 </div>
 </main>

 {/* Footer */}
 <footer className="w-full flex items-center justify-between px-12 py-6 shrink-0 border-t border-border-strong relative z-10">
 <p className="text-xs text-text-secondary">© 2026 sendme.alt · Made by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="relative font-semibold text-text-primary hover:text-transparent bg-clip-text bg-gradient-to-r from-color-primary to-color-accent transition-all duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:bg-gradient-to-r after:from-color-primary after:to-color-accent after:transition-transform after:duration-300 after:ease-in-out">Gaurav Patil</a></p>
 <div className="flex items-center gap-6">
 <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-text-primary transition-colors">Privacy</Link>
 <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-text-primary transition-colors">Terms</Link>
 <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-xs text-text-muted hover:text-text-primary transition-colors">Acceptable Use</Link>
 <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors" title="GitHub">
 <Github className="w-3.5 h-3.5" />
 </a>
 </div>
 </footer>
 </div>
 )
}
