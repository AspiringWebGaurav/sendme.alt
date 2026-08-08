'use client'

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { legalConfig } from './config';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  Shield, 
  FileText, 
  Scale, 
  Bookmark, 
  Check, 
  Link2,
  BookOpen
} from 'lucide-react';
import { Footer } from '@/layout/Footer';

export function LegalHeader({ title }: { title: string }) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Privacy Policy', path: '/legal/privacy', icon: Shield },
    { name: 'Terms of Service', path: '/legal/terms', icon: FileText },
    { name: 'Acceptable Use (AUP)', path: '/legal/aup', icon: Scale },
  ]

  return (
    <header className="mb-8 sm:mb-12 border-b border-border-subtle/40 pb-6 sm:pb-10">
      {/* Top Bar: Back Link + Segmented Legal Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-text-secondary hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to App
        </Link>

        <div className="flex items-center gap-1 glass-panel p-1 rounded-full border border-border-subtle shadow-xs bg-bg-surface/90 relative">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path
            const Icon = tab.icon
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors z-10 ${
                  isActive
                    ? 'text-purple-700 dark:text-purple-300 font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 rounded-full bg-purple-500/15 border border-purple-500/30 shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Title Banner & Governance Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-start gap-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-purple-500/25 text-xs font-semibold text-purple-600 dark:text-purple-400 shadow-xs bg-purple-500/5">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
          <span>Official Governance & Compliance</span>
          <Sparkles className="w-3 h-3 text-purple-400" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-tight">
          {title}
        </h1>

        <div className="inline-flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-text-secondary glass-panel p-3.5 px-5 rounded-2xl border border-border-subtle shadow-xs mt-2 bg-bg-surface/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="font-semibold text-text-primary">Effective Date:</span>
            <span>{legalConfig.effectiveDate}</span>
          </div>

          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border-subtle" />

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="font-semibold text-text-primary">Last Updated:</span>
            <span>{legalConfig.lastUpdated}</span>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false)

  const copyAnchor = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.section 
      id={id} 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-28 group"
    >
      <div className="glass-panel border border-border-subtle rounded-3xl p-6 sm:p-8 hover:border-purple-500/40 transition-all duration-300 shadow-sm hover:shadow-md bg-bg-surface/80 dark:bg-bg-surface/60">
        <div className="border-b border-border-subtle/60 pb-4 mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shrink-0" />
            <span>{title}</span>
          </h2>
          
          <button
            onClick={copyAnchor}
            title="Copy link to section"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-600 dark:hover:text-purple-300"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-text-primary dark:text-text-secondary text-xs sm:text-sm leading-relaxed space-y-4 font-normal">
          {children}
        </div>
      </div>
    </motion.section>
  );
}

export function LegalFooterNote() {
  return (
    <div className="mt-12 p-6 rounded-2xl glass-card border border-purple-500/20 bg-purple-500/5 text-xs sm:text-sm text-text-secondary leading-relaxed shadow-xs">
      <p className="font-semibold text-text-primary mb-1">⚖️ Legal Notice & Binding Agreement</p>
      This document forms a legally binding agreement. By continuing to use <strong className="text-purple-600 dark:text-purple-400">{legalConfig.companyName}</strong>, you acknowledge that you have read, understood, and agreed to these terms in their entirety. For any legal inquiries or reports of security vulnerability, please contact the maintainers via our official GitHub repository.
    </div>
  );
}

export function LegalPageLayout({ 
  title, 
  sections, 
  children 
}: { 
  title: string; 
  sections: { id: string; title: string }[]; 
  children: ReactNode;
}) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const scrollContainer = document.getElementById('legal-scroll-container')
    if (!scrollContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const progress = Math.min(100, Math.max(0, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)))
      setScrollProgress(progress)

      const scrollPosition = scrollTop + 220

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = document.getElementById(section.id)
        if (element) {
          const top = element.offsetTop
          if (scrollPosition >= top) {
            setActiveId(section.id)
            break
          }
        }
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setActiveId(id)
    const element = document.getElementById(id)
    const scrollContainer = document.getElementById('legal-scroll-container')
    if (element && scrollContainer) {
      const top = element.offsetTop - 110
      scrollContainer.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <LegalHeader title={title} />
      
      {/* GitHub Documentation-Style Layout: Sticky Left Nav + Right Document Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
        
        {/* Pinned Sticky Left Sidebar */}
        <aside className="lg:col-span-3 w-full lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
          <div className="glass-panel border border-border-subtle rounded-2xl p-5 shadow-xs bg-bg-surface/90 dark:bg-bg-surface/80">
            
            {/* Sidebar Header with Reading Progress Bar */}
            <div className="mb-4 pb-3 border-b border-border-subtle/50 flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-purple-500" />
                <span>On This Page</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">
                {scrollProgress}%
              </span>
            </div>

            {/* Reading Progress Line */}
            <div className="w-full bg-border-subtle/40 h-1 rounded-full mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full transition-all duration-150 rounded-full"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            <nav className="space-y-1.5">
              {sections.map((section, idx) => {
                const isActive = activeId === section.id
                return (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`}
                    onClick={(e) => handleLinkClick(e, section.id)}
                    className={`flex items-center gap-2.5 text-xs sm:text-sm py-2 px-3 rounded-xl transition-all group font-medium relative ${
                      isActive
                        ? 'bg-purple-600/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30 shadow-xs'
                        : 'text-text-secondary hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-500/10'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeSectionIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-purple-500"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${
                      isActive ? 'text-purple-600 dark:text-purple-400' : 'text-text-muted group-hover:text-purple-500'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Right Main Document Column (Scrolls smoothly) */}
        <div className="lg:col-span-9 space-y-6 sm:space-y-8 min-w-0 flex flex-col">
          {children}
          <LegalFooterNote />
          <div className="pt-8 mt-12 border-t border-border-subtle/40">
            <Footer />
          </div>
        </div>

      </div>

      {/* Floating Bottom Progress Pill on Desktop */}
      <AnimatePresence>
        {scrollProgress > 5 && scrollProgress < 98 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 hidden md:flex items-center gap-2 glass-panel border border-purple-500/30 px-3.5 py-2 rounded-full shadow-lg bg-bg-surface/90 backdrop-blur-xl text-xs z-40"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span className="font-semibold text-text-primary">{scrollProgress}% Read</span>
            <span className="text-text-muted">·</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">{title}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
