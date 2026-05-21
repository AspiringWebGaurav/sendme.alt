'use client'

import { Github, Globe } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Logo } from "@/components/Logo"

interface NavbarProps {
 variant?: "landing" | "app"
}

export function Navbar({ variant = "app" }: NavbarProps) {
 return (
 <header className={`w-full shrink-0 sticky top-0 z-50 flex items-center justify-between backdrop-blur-md bg-bg-surface/80 pt-[max(env(safe-area-inset-top),0px)] ${variant === "landing"
 ? "px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-8 sm:py-5 lg:px-12 lg:py-6 border-b border-border-strong"
 : "h-[calc(3.5rem+env(safe-area-inset-top))] sm:h-16 px-4 sm:px-6 border-b border-border-subtle"
 }`}>
 <Logo size="lg" withLink={variant === "app"} />

 {/* Right side content */}
 <div className="flex items-center justify-end">
 {variant === "landing" ? (
 <div className="flex items-center gap-3 sm:gap-4">
 <a href="https://github.com/AspiringWebGaurav" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors" title="GitHub">
 <Github className="w-4 h-4" />
 </a>
 <a href="https://www.gauravpatil.online" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors" title="Portfolio">
 <Globe className="w-4 h-4" />
 </a>
 <Link href="/transfer?mode=receive" className="hidden sm:inline-block px-5 py-2 sm:py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Receive</Link>
 <Link href="/transfer?mode=send" className="px-5 py-2 sm:py-2.5 text-sm font-medium bg-bg-surface text-text-primary border border-border-strong hover:bg-bg-elevated rounded-full transition-colors hidden sm:block">Start Sending</Link>
 <div className="h-5 w-px bg-border-strong hidden sm:block" />
 <ThemeToggle />
 </div>
 ) : (
 <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-text-muted">
 <div className="flex items-center gap-1.5 sm:gap-2 bg-success-bg px-2.5 py-1 rounded-md border border-success-bg text-success-text font-medium">
 <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success-text"></span>
 <span>P2P READY</span>
 </div>
 <div className="h-4 w-px bg-border-strong mx-1"></div>
 <ThemeToggle />
 </div>
 )}
 </div>
 </header>
 )
}
