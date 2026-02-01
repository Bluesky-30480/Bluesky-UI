import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils'
import { Portal } from '../primitives'
import { IconButton } from '../buttons'

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom'
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether the drawer is open */
  isOpen: boolean
  /** Callback when drawer should close */
  onClose: () => void
  /** Drawer title */
  title?: ReactNode
  /** Placement of the drawer */
  placement?: DrawerPlacement
  /** Drawer size */
  size?: DrawerSize
  /** Whether to show the close button */
  showCloseButton?: boolean
  /** Whether clicking backdrop closes drawer */
  closeOnBackdropClick?: boolean
  /** Whether pressing Escape closes drawer */
  closeOnEsc?: boolean
  /** Custom footer content */
  footer?: ReactNode
  /** Whether to prevent body scroll when open */
  lockScroll?: boolean
}

const sizeStyles: Record<DrawerPlacement, Record<DrawerSize, string>> = {
  left: {
    xs: 'w-64',
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[28rem]',
    xl: 'w-[32rem]',
    full: 'w-screen',
  },
  right: {
    xs: 'w-64',
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[28rem]',
    xl: 'w-[32rem]',
    full: 'w-screen',
  },
  top: {
    xs: 'h-32',
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
    full: 'h-screen',
  },
  bottom: {
    xs: 'h-32',
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80',
    xl: 'h-96',
    full: 'h-screen',
  },
}

const placementStyles: Record<DrawerPlacement, string> = {
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
}

const animationStyles: Record<DrawerPlacement, string> = {
  left: 'animate-in slide-in-from-left duration-300',
  right: 'animate-in slide-in-from-right duration-300',
  top: 'animate-in slide-in-from-top duration-300',
  bottom: 'animate-in slide-in-from-bottom duration-300',
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      placement = 'right',
      size = 'md',
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      footer,
      lockScroll = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
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

    // Lock body scroll
    useEffect(() => {
      if (isOpen && lockScroll) {
        const originalOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = originalOverflow
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

    if (!isOpen) return null

    const isHorizontal = placement === 'left' || placement === 'right'

    return (
      <Portal>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
            'animate-in fade-in-0 duration-200'
          )}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
        >
          {/* Drawer */}
          <div
            ref={ref}
            className={cn(
              'fixed bg-surface shadow-xl border-border flex flex-col',
              placementStyles[placement],
              sizeStyles[placement][size],
              animationStyles[placement],
              isHorizontal ? 'border-l' : 'border-t',
              placement === 'left' && 'border-l-0 border-r',
              placement === 'top' && 'border-t-0 border-b',
              className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
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
                    aria-label="Close drawer"
                    className="ml-auto -mr-2"
                  />
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
                {footer}
              </div>
            )}
          </div>
        </div>
      </Portal>
    )
  }
)

Drawer.displayName = 'Drawer'
