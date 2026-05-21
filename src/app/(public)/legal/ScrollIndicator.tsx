'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.scrollTop > 50) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    // Since the scroll container is the parent div, not the window, we need to attach the listener to it.
    // The parent div is exactly the immediate parent of this component in the layout.
    const scrollContainer = document.getElementById('legal-scroll-container')
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      // Check initial state in case already scrolled
      if (scrollContainer.scrollTop > 50) {
        setIsVisible(false)
      }
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-50 text-text-muted"
        >
          <span className="text-xs font-medium uppercase tracking-widest mb-1 opacity-70">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 opacity-70" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
