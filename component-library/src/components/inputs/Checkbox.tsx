import { forwardRef, InputHTMLAttributes, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '../../utils'

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Checkbox size */
  size?: CheckboxSize
  /** Label text */
  label?: ReactNode
  /** Description text below the label */
  description?: ReactNode
  /** Whether checkbox has an error state */
  error?: boolean
  /** Indeterminate state (overrides checked visually) */
  indeterminate?: boolean
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<CheckboxSize, { box: string; icon: string; label: string }> = {
  sm: {
    box: 'h-4 w-4',
    icon: 'h-3 w-3',
    label: 'text-sm',
  },
  md: {
    box: 'h-5 w-5',
    icon: 'h-3.5 w-3.5',
    label: 'text-sm',
  },
  lg: {
    box: 'h-6 w-6',
    icon: 'h-4 w-4',
    label: 'text-base',
  },
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      description,
      error = false,
      indeterminate = false,
      disabled,
      className,
      checked: checkedProp,
      defaultChecked,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const isControlled = checkedProp !== undefined
    const [internalChecked, setInternalChecked] = useState(!!defaultChecked)
    const checked = isControlled ? checkedProp : internalChecked
    const sizes = sizeStyles[size]

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [ref]
    )

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate)
      }
    }, [indeterminate])

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
          'relative inline-flex items-start gap-2.5 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {/* Hidden native checkbox - positioned within label to prevent scroll */}
        <input
          ref={setRef}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="absolute top-0 left-0 opacity-0 w-4 h-4 peer"
          aria-checked={indeterminate ? 'mixed' : checked}
          {...props}
        />

        {/* Custom checkbox visual */}
        <span
          className={cn(
            // Base box styles
            'relative flex-shrink-0 rounded border-2 transition-all duration-150',
            sizes.box,
            // Unchecked state
            'border-border bg-background',
            // Hover
            'peer-hover:border-muted-foreground/70',
            // Focus
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            // Checked/Indeterminate state
            (checked || indeterminate) && 'border-primary bg-primary',
            // Error state
            error && 'border-destructive',
            error && (checked || indeterminate) && 'bg-destructive'
          )}
        >
          {/* Check icon */}
          {checked && !indeterminate && (
            <Check
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'text-primary-foreground',
                sizes.icon
              )}
              strokeWidth={3}
            />
          )}
          {/* Indeterminate icon */}
          {indeterminate && (
            <Minus
              className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'text-primary-foreground',
                sizes.icon
              )}
              strokeWidth={3}
            />
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

Checkbox.displayName = 'Checkbox'
