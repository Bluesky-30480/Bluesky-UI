import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils'
import { Portal } from '../primitives'
import { IconButton } from '../buttons'

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Modal title */
  title?: ReactNode
  /** Modal size */
  size?: ModalSize
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick?: boolean
  /** Whether pressing Escape closes modal */
  closeOnEsc?: boolean
  /** Whether to center the modal vertically */
  centered?: boolean
  /** Custom footer content */
  footer?: ReactNode
  /** Whether to prevent body scroll when open */
  lockScroll?: boolean
}

const sizeStyles: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      centered = true,
      footer,
      lockScroll = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<Element | null>(null)

    // Handle escape key
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (closeOnEsc && event.key === 'Escape') {
          onClose()
        }
      },
      [closeOnEsc, onClose]
    )

    // Handle backdrop click
    const handleBackdropClick = (event: React.MouseEvent) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose()
      }
    }

    // Lock body scroll and handle focus
    useEffect(() => {
      if (isOpen) {
        previousActiveElement.current = document.activeElement
        
        // Lock scroll
        if (lockScroll) {
          const originalOverflow = document.body.style.overflow
          document.body.style.overflow = 'hidden'
          return () => {
            document.body.style.overflow = originalOverflow
          }
        }
      }
    }, [isOpen, lockScroll])

    // Add keyboard listener
    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
          document.removeEventListener('keydown', handleKeyDown)
        }
      }
    }, [isOpen, handleKeyDown])

    // Focus modal on open
    useEffect(() => {
      if (isOpen && modalRef.current) {
        modalRef.current.focus()
      }
    }, [isOpen])

    // Restore focus on close
    useEffect(() => {
      if (!isOpen && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus()
      }
    }, [isOpen])

    if (!isOpen) return null

    return (
      <Portal>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-50 flex overflow-y-auto',
            centered ? 'items-center' : 'items-start pt-16',
            'justify-center p-4',
            'bg-black/50 backdrop-blur-sm',
            'animate-in fade-in-0 duration-200'
          )}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          {/* Modal */}
          <div
            ref={ref || modalRef}
            tabIndex={-1}
            className={cn(
              'relative w-full rounded-lg bg-surface shadow-xl border border-border',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              sizeStyles[size],
              size === 'full' && 'h-full',
              className
            )}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                {title && (
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <IconButton
                    icon={<X className="h-4 w-4" />}
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="ml-auto -mr-2"
                  />
                )}
              </div>
            )}

            {/* Body */}
            <div className={cn(
              'px-6 py-4',
              size === 'full' && 'flex-1 overflow-y-auto'
            )}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
                {footer}
              </div>
            )}
          </div>
        </div>
      </Portal>
    )
  }
)

Modal.displayName = 'Modal'

// Convenience subcomponents for composition
export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-border', className)}
      {...props}
    >
      {children}
    </div>
  )
)

ModalHeader.displayName = 'ModalHeader'

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
)

ModalBody.displayName = 'ModalBody'

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-2 px-6 py-4 border-t border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

ModalFooter.displayName = 'ModalFooter'
