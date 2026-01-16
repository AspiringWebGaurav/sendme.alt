/**
 * sendme.alt - Progress Bar Component
 * Copyright (c) 2026 Gaurav Patil
 * Licensed under MIT License
 * https://gauravpatil.online
 */

'use client'

import { useEffect, useRef } from 'react'
import { formatBytes, formatSpeed, formatTime } from '@/lib/transfer'
import type { ProgressInfo } from '@/types'

interface ProgressBarProps {
  progress: ProgressInfo
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  // 60 FPS progress animation using requestAnimationFrame
  useEffect(() => {
    if (!barRef.current) return

    let animationFrameId: number
    const animate = () => {
      if (barRef.current) {
        const percentage = Math.min(progress.percentage, 100)
        barRef.current.style.transform = `scaleX(${percentage / 100})`
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [progress.percentage])

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs sm:text-sm text-white/80">
        <span>{Math.round(progress.percentage)}%</span>
        <span className="hidden sm:inline">{formatSpeed(progress.speed)}</span>
        <span>
          {formatBytes(progress.bytesTransferred)} / {formatBytes(progress.totalBytes)}
        </span>
        <span className="hidden sm:inline">ETA: {formatTime(progress.eta)}</span>
      </div>
    </div>
  )
}
