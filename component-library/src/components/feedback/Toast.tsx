import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils'
import { Portal } from '../primitives'

export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: string
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

export interface ToastProviderProps {
  children: ReactNode
  position?: ToastPosition
  defaultDuration?: number
  maxToasts?: number
}

const ToastContext = createContext<ToastContextValue | null>(null)

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
}

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-surface border-border text-foreground',
  success: 'bg-success/10 border-success/30 text-success',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  error: 'bg-error/10 border-error/30 text-error',
  info: 'bg-info/10 border-info/30 text-info',
}

export function ToastProvider({
  children,
  position = 'top-right',
  defaultDuration = 4000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutsRef = useRef<Map<string, number>>(new Map())
  const counterRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timeoutId = timeoutsRef.current.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const clear = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    timeoutsRef.current.clear()
    setToasts([])
  }, [])

  const toast = useCallback(
    (options: ToastOptions) => {
      counterRef.current += 1
      const id = `${Date.now()}-${counterRef.current}`
      const item: ToastItem = {
        id,
        variant: 'default',
        ...options,
      }

      setToasts((prev) => {
        const next = [...prev, item]
        if (next.length > maxToasts) {
          next.shift()
        }
        return next
      })

      const duration = options.duration ?? defaultDuration
      if (duration > 0) {
        const timeoutId = window.setTimeout(() => dismiss(id), duration)
        timeoutsRef.current.set(id, timeoutId)
      }

      return id
    },
    [defaultDuration, dismiss, maxToasts]
  )

  const value = useMemo(() => ({ toast, dismiss, clear }), [toast, dismiss, clear])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <Portal>
          <div
            className={cn(
              'fixed z-50 flex flex-col gap-2 pointer-events-none',
              positionStyles[position]
            )}
            role="status"
            aria-live="polite"
          >
            {toasts.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'pointer-events-auto min-w-[280px] max-w-[360px] rounded-lg border shadow-md',
                  'px-4 py-3 bg-surface text-foreground',
                  'animate-in fade-in-0 zoom-in-95 duration-150',
                  variantStyles[item.variant ?? 'default']
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {item.title && (
                      <div className="text-sm font-semibold mb-0.5">
                        {item.title}
                      </div>
                    )}
                    {item.description && (
                      <div className="text-sm opacity-90">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    className="p-1 rounded-md hover:bg-foreground/10 transition-colors"
                    aria-label="Dismiss toast"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Portal>
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}