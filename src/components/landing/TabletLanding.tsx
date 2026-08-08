'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Trash2, Globe, Shield, Download, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Github } from 'lucide-react'

import { Navbar } from '@/layout/Navbar'

export function TabletLanding() {
  return (
    <div className="w-full h-[100dvh] flex flex-col bg-bg-primary text-text-primary overflow-hidden font-sans selection:bg-bg-elevated relative">
      {/* Background Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Nav */}
      <Navbar variant="landing" />

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-between p-6 sm:p-8 relative z-10 max-w-3xl mx-auto min-h-0">
        {/* Hero */}
        <div className="w-full flex flex-col items-center text-center my-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-semibold text-text-secondary mb-5 border border-border-subtle shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise Grade WebRTC</span>
            <Sparkles className="w-3 h-3 text-purple-400 ml-1" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight mb-4"
          >
            Secure P2P <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400">
              File Transfer.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-text-secondary mb-8 leading-relaxed max-w-md"
          >
            No Signup. Zero Cloud Storage. Up to 10GB. Direct device-to-device tunneling ensures your data stays entirely your own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-row items-center justify-center gap-3 w-full max-w-lg"
          >
            <Link 
              href="/transfer?mode=send" 
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full font-semibold transition-all duration-300 shadow-md shadow-purple-500/20 text-sm group"
            >
              Send File
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/transfer?mode=receive" 
              className="flex-1 flex items-center justify-center gap-2 py-3 glass-panel hover-glass text-text-primary rounded-full font-semibold transition-all duration-300 text-sm"
            >
              Receive File
            </Link>

            <a 
              href="https://github.com/AspiringWebGaurav/send2me-rust-app/releases" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 flex items-center justify-center gap-1.5 py-3 glass-panel hover-glass text-text-secondary hover:text-text-primary rounded-full font-medium transition-all duration-300 text-xs whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              Get PC App
            </a>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="w-full mt-auto pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-3 w-full"
          >
            {[
              { icon: Zap, title: "Up to 10GB", desc: "Instant peer connection." },
              { icon: Lock, title: "E2E Encrypted", desc: "Strict WebRTC protocol." },
              { icon: HardDrive, title: "No Cloud", desc: "Direct device tunnel." },
              { icon: Trash2, title: "Auto Cleanup", desc: "Tokens destroyed." },
              { icon: Globe, title: "Cross Browser", desc: "Works everywhere." },
              { icon: Shield, title: "Direct Peer", desc: "Zero middleman." },
            ].map((ft, idx) => (
              <div key={idx} className="flex flex-col p-3.5 rounded-2xl glass-panel hover-glass items-center text-center">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2">
                  <ft.icon className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-text-primary text-xs font-semibold mb-0.5">{ft.title}</h3>
                <p className="text-[10px] text-text-muted leading-tight">{ft.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-row items-center justify-between px-6 py-3 shrink-0 border-t border-border-subtle/60 relative z-10 glass-panel bg-bg-surface/40">
        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} sendme.alt · Made by{' '}
          <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-text-primary hover:text-purple-400 transition-colors">
            Gaurav Patil
          </a>
        </p>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Privacy</Link>
          <Link href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Terms</Link>
          <Link href="/legal/aup" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Acceptable Use</Link>
          <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors" title="GitHub">
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  )
}
