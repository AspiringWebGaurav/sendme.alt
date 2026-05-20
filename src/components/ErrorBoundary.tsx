'use client'

import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
 children: ReactNode
 fallback?: ReactNode
}

interface ErrorBoundaryState {
 hasError: boolean
 error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
 super(props)
 this.state = { hasError: false, error: null }
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
 return { hasError: true, error }
 }

 componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
 console.error('[ErrorBoundary]', error, errorInfo)
 }

 render() {
 if (this.state.hasError) {
 if (this.props.fallback) return this.props.fallback

 return (
 <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8">
 <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
 <span className="text-2xl">⚠️</span>
 </div>
 <h2 className="text-xl font-semibold text-text-primary">
 Something went wrong
 </h2>
 <p className="text-sm text-text-secondary text-center max-w-md">
 An unexpected error occurred. Please try again.
 </p>
 <button
 onClick={() => this.setState({ hasError: false, error: null })}
 className="px-6 py-2.5 bg-accent-primary hover:bg-accent-hover :bg-primary-dark text-text-primary rounded-full font-medium transition-colors"
 >
 Try Again
 </button>
 </div>
 )
 }

 return this.props.children
 }
}