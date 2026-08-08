'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Lock, HardDrive, Zap, Trash2, Globe, Shield, Download, Sparkles } from 'lucide-react'
import { Github } from 'lucide-react'
import Link from 'next/link'

import { Navbar } from '@/layout/Navbar'

export function DesktopLanding() {
  return (
    <div className="w-full h-[100dvh] flex flex-col bg-bg-primary text-text-primary overflow-hidden font-sans selection:bg-bg-elevated relative">
      {/* Background Ambient Orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Nav */}
      <Navbar variant="landing" />

      {/* Main Content */}
      <main className="flex-1 w-full flex items-center justify-between px-8 lg:px-16 xl:px-24 relative z-10 max-w-7xl mx-auto min-h-0 py-6">
        {/* Left Side: Hero */}
        <div className="w-[52%] flex flex-col items-start justify-center pr-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-xs font-semibold text-text-secondary mb-6 border border-border-subtle shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enterprise Grade WebRTC</span>
            <Sparkles className="w-3 h-3 text-purple-400 ml-1" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.05] mb-6"
          >
            Secure P2P <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400">
              File Transfer.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base lg:text-lg text-text-secondary mb-8 max-w-md leading-relaxed"
          >
            No Signup. Zero Cloud Storage. Up to 10GB. Direct device-to-device tunneling ensures your data stays entirely your own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3.5 w-full flex-wrap xl:flex-nowrap"
          >
            <Link 
              href="/transfer?mode=send" 
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] group"
            >
              Send File
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/transfer?mode=receive" 
              className="flex items-center justify-center gap-2 px-7 py-3.5 glass-panel hover-glass text-text-primary rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Receive File
            </Link>

            <a 
              href="https://github.com/AspiringWebGaurav/send2me-rust-app/releases/latest" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center gap-2 px-6 py-3.5 glass-panel hover-glass text-text-secondary hover:text-text-primary rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm"
            >
              <Download className="w-4 h-4 text-purple-400" />
              Get Free PC App
            </a>
          </motion.div>
        </div>

        {/* Right Side: Features Grid */}
        <div className="w-[48%] h-full flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-3.5 w-full max-w-md"
          >
            {[
              { icon: Zap, title: "Up to 10GB", desc: "Instant direct local or global peer transfer." },
              { icon: Lock, title: "End-to-End Encrypted", desc: "Mandatory WebRTC encryption protocols." },
              { icon: HardDrive, title: "No Cloud Storage", desc: "Files fly straight between peers." },
              { icon: Trash2, title: "Auto Cleanup", desc: "Tokens destroyed upon disconnect." },
              { icon: Globe, title: "Cross Browser", desc: "Works on Chromium, Firefox, WebKit." },
              { icon: Shield, title: "Direct Tunneling", desc: "No middleman server bottleneck." },
            ].map((ft, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col p-4 rounded-2xl glass-panel hover-glass transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/20 flex items-center justify-center mb-3 shrink-0">
                  <ft.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-text-primary font-semibold text-sm mb-1">{ft.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{ft.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex items-center justify-between px-8 lg:px-16 py-4 shrink-0 border-t border-border-subtle/60 relative z-10 glass-panel bg-bg-surface/40">
        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} sendme.alt · Built by{' '}
          <a 
            href="https://www.gauravpatil.online" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-text-primary hover:text-purple-400 transition-colors"
          >
            Gaurav Patil
          </a>
        </p>
        <div className="flex items-center gap-5 text-xs">
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
