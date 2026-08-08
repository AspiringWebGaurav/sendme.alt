'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Shield, Download, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Navbar } from '@/layout/Navbar'

export function MobileLanding() {
  return (
    <div className="w-full h-[100dvh] flex flex-col bg-bg-primary text-text-primary overflow-hidden font-sans selection:bg-bg-elevated relative">
      {/* Mobile Ambient Glow Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Nav */}
      <Navbar variant="landing" />

      {/* Main Content — STRICT OVERFLOW HIDDEN */}
      <main className="flex-1 w-full flex flex-col items-center justify-between px-4 py-2 relative z-10 min-h-0 overflow-hidden">
        <div className="w-full flex flex-col items-center text-center my-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-[10px] font-semibold text-text-secondary mb-2.5 border border-border-subtle shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>WebRTC Encrypted P2P</span>
            <Sparkles className="w-3 h-3 text-purple-400" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-2xl xs:text-3xl font-extrabold tracking-tight text-text-primary leading-[1.1] mb-2"
          >
            Secure P2P <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400">
              File Transfer.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-xs text-text-secondary mb-4 leading-relaxed px-2 max-w-xs"
          >
            No Signup. Zero Cloud Storage. Up to 10GB. Direct device tunneling.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col gap-2 w-full max-w-xs"
          >
            <Link 
              href="/transfer?mode=send" 
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold transition-transform active:scale-[0.98] shadow-md shadow-purple-500/20 text-xs sm:text-sm w-full"
            >
              Send File
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link 
              href="/transfer?mode=receive" 
              className="flex items-center justify-center gap-2 px-5 py-3 glass-panel active:bg-bg-elevated text-text-primary rounded-xl font-semibold transition-transform active:scale-[0.98] text-xs sm:text-sm w-full"
            >
              Receive File
            </Link>

            <a 
              href="https://github.com/AspiringWebGaurav/send2me-rust-app/releases" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-1.5 px-4 py-2 glass-card active:bg-bg-elevated text-text-muted hover:text-text-primary text-[11px] rounded-lg font-medium transition-colors w-full"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              Get Free PC App
            </a>
          </motion.div>
        </div>

        {/* Compact 3-Card Mini Grid for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-full max-w-xs grid grid-cols-3 gap-1.5 shrink-0 my-2"
        >
          {[
            { icon: Zap, title: "10GB", desc: "No Limit" },
            { icon: Lock, title: "E2E", desc: "Encrypted" },
            { icon: HardDrive, title: "Zero Cloud", desc: "Direct P2P" },
          ].map((ft, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-2 rounded-xl glass-panel text-center border border-border-subtle/50">
              <ft.icon className="w-3.5 h-3.5 text-purple-400 mb-1" />
              <span className="text-text-primary text-[11px] font-semibold leading-tight">{ft.title}</span>
              <span className="text-[9px] text-text-muted leading-tight">{ft.desc}</span>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Mobile Footer */}
      <footer className="w-full flex flex-col items-center gap-1.5 px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shrink-0 border-t border-border-subtle/60 relative z-10 glass-panel bg-bg-surface/50">
        <div className="flex items-center justify-center gap-4">
          <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[10px] text-text-muted active:text-text-primary transition-colors">Privacy</Link>
          <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-[10px] text-text-muted active:text-text-primary transition-colors">Terms</Link>
          <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-[10px] text-text-muted active:text-text-primary transition-colors">Acceptable Use</Link>
        </div>
        <p className="text-[10px] text-text-muted">
          Built by <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-primary hover:text-purple-400">Gaurav Patil</a> · <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary">GitHub</a>
        </p>
      </footer>
    </div>
  )
}
