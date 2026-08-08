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
    <header className="w-full shrink-0 sticky top-0 z-50 backdrop-blur-md bg-transparent border-b border-border-subtle/30 pt-[env(safe-area-inset-top)]">
      <div className="w-full h-14 sm:h-18 lg:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">



        <Logo size="lg" withLink={variant === "app"} />

        {/* Right side content */}
        <div className="flex items-center justify-end">
          {variant === "landing" ? (
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <a 
                href="https://github.com/AspiringWebGaurav" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 sm:p-2.5 text-text-muted hover:text-text-primary rounded-full hover:bg-bg-elevated/60 transition-colors" 
                title="GitHub"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.gauravpatil.online" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 sm:p-2.5 text-text-muted hover:text-text-primary rounded-full hover:bg-bg-elevated/60 transition-colors" 
                title="Portfolio"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              
              <Link 
                href="/transfer?mode=receive" 
                className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60 rounded-full transition-colors"
              >
                Receive
              </Link>

              <Link 
                href="/transfer?mode=send" 
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs sm:text-sm font-semibold text-text-inverse bg-text-primary hover:opacity-90 rounded-full transition-opacity shadow-sm hover:shadow-md"
              >
                Start Sending
              </Link>
              
              <div className="h-5 w-px bg-border-subtle mx-1 hidden sm:block" />
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono text-text-muted">
              <div className="flex items-center gap-1.5 bg-success-bg/80 px-3 py-1.5 rounded-full border border-success-text/20 text-success-text font-medium text-[11px] sm:text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-success-text animate-pulse"></span>
                <span>P2P READY</span>
              </div>
              <div className="h-5 w-px bg-border-subtle mx-1"></div>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

