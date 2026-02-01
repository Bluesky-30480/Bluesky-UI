import { forwardRef, HTMLAttributes, ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Alert variant/type */
  variant?: AlertVariant
  /** Alert title */
  title?: ReactNode
  /** Alert description */
  description?: ReactNode
  /** Custom icon (overrides default) */
  icon?: ReactNode
  /** Hide the icon */
  hideIcon?: boolean
  /** Show close button */
  closable?: boolean
  /** Close callback */
  onClose?: () => void
  /** Solid background style */
  solid?: boolean
}

const variantStyles: Record<AlertVariant, { container: string; icon: string; solidContainer: string }> = {
  info: {
    container: 'bg-info/10 border-info/30 text-info',
    icon: 'text-info',
    solidContainer: 'bg-info text-white',
  },
  success: {
    container: 'bg-success/10 border-success/30 text-success',
    icon: 'text-success',
    solidContainer: 'bg-success text-white',
  },
  warning: {
    container: 'bg-warning/10 border-warning/30 text-warning',
    icon: 'text-warning',
    solidContainer: 'bg-warning text-white',
  },
  error: {
    container: 'bg-error/10 border-error/30 text-error',
    icon: 'text-error',
    solidContainer: 'bg-error text-white',
  },
}

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      title,
      description,
      icon,
      hideIcon = false,
      closable = false,
      onClose,
      solid = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant]
    const displayIcon = icon ?? defaultIcons[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex gap-3 p-4 rounded-lg border',
          solid ? styles.solidContainer : styles.container,
          className
        )}
        {...props}
      >
        {/* Icon */}
        {!hideIcon && (
          <div className={cn('flex-shrink-0', !solid && styles.icon)}>
            {displayIcon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className={cn('font-semibold', description && 'mb-1')}>
              {title}
            </h5>
          )}
          {description && (
            <p className={cn('text-sm', solid ? 'text-white/90' : 'text-foreground/80')}>
              {description}
            </p>
          )}
          {children}
        </div>

        {/* Close button */}
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex-shrink-0 p-1 rounded-md transition-colors',
              solid 
                ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                : 'hover:bg-foreground/10'
            )}
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'
