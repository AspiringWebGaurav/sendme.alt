import { XCircle } from 'lucide-react'

interface CancelButtonProps {
 onCancel: () => void
 label?: string
}

export function CancelButton({ onCancel, label = 'Cancel' }: CancelButtonProps) {
 return (
  <button
  onClick={onCancel}
  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-bg-elevated hover:bg-error-bg/80 text-text-secondary hover:text-error-text transition-all duration-300 hover:scale-105 active:scale-90 text-xs font-medium border border-border-subtle hover:border-error-text/30 shadow-sm hover:shadow-md backdrop-blur-md shrink-0 group"
  title={label}
  >
  <XCircle className="w-3.5 h-3.5 shrink-0" />
  <span className="hidden sm:inline">Cancel</span>
  </button>
 )
}
