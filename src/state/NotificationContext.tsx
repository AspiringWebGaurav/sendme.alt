'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type NotificationType = 'success' | 'warning' | 'error' | 'info'

export interface Notification {
 id: string
 message: string
 type: NotificationType
}

interface NotificationContextProps {
 addNotification: (message: string, type: NotificationType) => void
 removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
 const [notifications, setNotifications] = useState<Notification[]>([])

 const removeNotification = useCallback((id: string) => {
 setNotifications((prev) => prev.filter((n) => n.id !== id))
 }, [])

 const addNotification = useCallback((message: string, type: NotificationType) => {
 setNotifications((prev) => {
 // Idempotency: Ignore duplicate messages
 if (prev.some((n) => n.message === message)) {
 return prev
 }

 const id = Math.random().toString(36).substring(2, 9)
 const newNotification: Notification = { id, message, type }

 // Auto-dismiss
 setTimeout(() => {
 removeNotification(id)
 }, 4000)

 return [...prev, newNotification]
 })
 }, [removeNotification])

 return (
 <NotificationContext.Provider value={{ addNotification, removeNotification }}>
 {children}

 {/* Toast Container */}
 <div
 className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[9999] flex flex-col gap-2 pointer-events-none sm:items-end"
 role="status"
 aria-live="polite"
 >
 <AnimatePresence>
 {notifications.map((notification) => (
 <Toast
 key={notification.id}
 notification={notification}
 onClose={() => removeNotification(notification.id)}
 />
 ))}
 </AnimatePresence>
 </div>
 </NotificationContext.Provider>
 )
}

function Toast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const getStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-lg shadow-emerald-950/5 dark:bg-emerald-950/90 dark:border-emerald-500/40 dark:text-emerald-50 dark:shadow-emerald-950/40',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        }
      case 'error':
        return {
          container: 'bg-rose-50/95 border-rose-300 text-rose-950 shadow-lg shadow-rose-950/5 dark:bg-rose-950/90 dark:border-rose-500/40 dark:text-rose-50 dark:shadow-rose-950/40',
          icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
        }
      case 'warning':
        return {
          container: 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-lg shadow-amber-950/5 dark:bg-amber-950/90 dark:border-amber-500/40 dark:text-amber-50 dark:shadow-amber-950/40',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        }
      case 'info':
      default:
        return {
          container: 'bg-sky-50/95 border-sky-300 text-sky-950 shadow-lg shadow-sky-950/5 dark:bg-sky-950/90 dark:border-sky-500/40 dark:text-sky-50 dark:shadow-sky-950/40',
          icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
        }
    }
  }

  const { container, icon } = getStyles(notification.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md transition-colors ${container} w-full sm:w-max sm:max-w-md`}
    >
      {icon}
      <p className="text-sm font-medium leading-tight flex-1 break-words">
        {notification.message}
      </p>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current opacity-60 hover:opacity-100 transition-all"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export function useNotification() {
 const context = useContext(NotificationContext)
 if (!context) {
 throw new Error('useNotification must be used within a NotificationProvider')
 }
 return context
}
