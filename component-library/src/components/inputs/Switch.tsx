import { forwardRef, InputHTMLAttributes, ReactNode, useCallback, useState } from 'react'
import { cn } from '../../utils'

export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Switch size */
  size?: SwitchSize
  /** Label text */
  label?: ReactNode
  /** Description text below the label */
  description?: ReactNode
  /** Whether switch has an error state */
  error?: boolean
  /** Show on/off labels inside switch */
  showLabels?: boolean
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<SwitchSize, { track: string; thumb: string; translate: string; label: string }> = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
    label: 'text-sm',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
    label: 'text-sm',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
    label: 'text-base',
  },
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      label,
      description,
      error = false,
      showLabels = false,
      disabled,
      className,
      checked: checkedProp,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const isControlled = checkedProp !== undefined
    const [internalChecked, setInternalChecked] = useState(!!defaultChecked)
    const checked = isControlled ? checkedProp : internalChecked
    const sizes = sizeStyles[size]

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalChecked(event.target.checked)
        }
        onChange?.(event)
      },
      [isControlled, onChange]
    )

    return (
      <label
        className={cn(
          'relative inline-flex items-start gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {/* Hidden native checkbox - positioned within label to prevent scroll */}
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          className="absolute top-0 left-0 opacity-0 w-4 h-4 peer"
          aria-checked={checked}
          onChange={handleChange}
          {...props}
        />

        {/* Switch track */}
        <span
          className={cn(
            // Base track styles
            'relative inline-flex flex-shrink-0 items-center rounded-full',
            'transition-colors duration-200',
            sizes.track,
            // Unchecked state
            'bg-muted',
            // Hover
            'peer-hover:bg-muted/80',
            // Checked state
            'peer-checked:bg-primary peer-checked:hover:bg-primary/90',
            // Focus
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            // Error state
            error && 'bg-destructive/30 peer-checked:bg-destructive'
          )}
        >
          {/* Thumb */}
          <span
            className={cn(
              // Base thumb styles
              'pointer-events-none inline-block rounded-full',
              'bg-white shadow-sm',
              'transition-transform duration-200 ease-in-out',
              'translate-x-0.5',
              sizes.thumb,
              // Checked state - translate to the right
              checked && sizes.translate
            )}
          />

          {/* Optional on/off labels */}
          {showLabels && (
            <>
              <span
                className={cn(
                  'absolute left-1.5 text-[10px] font-medium text-primary-foreground',
                  'transition-opacity duration-200',
                  checked ? 'opacity-100' : 'opacity-0'
                )}
              >
                ON
              </span>
              <span
                className={cn(
                  'absolute right-1 text-[10px] font-medium text-muted-foreground',
                  'transition-opacity duration-200',
                  checked ? 'opacity-0' : 'opacity-100'
                )}
              >
                OFF
              </span>
            </>
          )}
        </span>

        {/* Label and description */}
        {(label || description) && (
          <span className="flex flex-col gap-0.5 pt-0.5">
            {label && (
              <span className={cn('text-foreground leading-tight', sizes.label)}>
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground leading-tight">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    )
  }
)

Switch.displayName = 'Switch'
