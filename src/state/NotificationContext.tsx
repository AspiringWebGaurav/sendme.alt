'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
                className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
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
    const getColors = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-100'
            case 'error':
                return 'bg-rose-500/20 border-rose-500/40 text-rose-100'
            case 'warning':
                return 'bg-amber-500/20 border-amber-500/40 text-amber-100'
            case 'info':
            default:
                return 'bg-blue-500/20 border-blue-500/40 text-blue-100'
        }
    }

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case 'success': return '✅'
            case 'error': return '❌'
            case 'warning': return '⚠️'
            case 'info': return 'ℹ️'
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${getColors(notification.type)} max-w-md w-max`}
        >
            <div className="text-xl shrink-0">{getIcon(notification.type)}</div>
            <p className="text-sm font-medium leading-tight flex-1">
                {notification.message}
            </p>
            <button
                onClick={onClose}
                className="shrink-0 p-1.5 rounded-full hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
                aria-label="Close notification"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
