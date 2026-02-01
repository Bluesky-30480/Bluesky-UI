import { forwardRef, InputHTMLAttributes, ReactNode, createContext, useContext } from 'react'
import { cn } from '../../utils'

export type RadioSize = 'sm' | 'md' | 'lg'

// Context for RadioGroup
interface RadioGroupContextValue {
  name?: string
  value?: string
  onChange?: (value: string) => void
  size?: RadioSize
  disabled?: boolean
  error?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue>({})

// RadioGroup component
export interface RadioGroupProps {
  /** Group name for all radio buttons */
  name?: string
  /** Currently selected value */
  value?: string
  /** Default selected value (uncontrolled) */
  defaultValue?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Radio size for all items */
  size?: RadioSize
  /** Disable all radio buttons */
  disabled?: boolean
  /** Error state for all radio buttons */
  error?: boolean
  /** Direction of the group */
  direction?: 'row' | 'column'
  /** Spacing between items */
  spacing?: 'sm' | 'md' | 'lg'
  /** Children (Radio components) */
  children: ReactNode
  /** Additional class names */
  className?: string
}

const spacingStyles = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

export function RadioGroup({
  name,
  value,
  defaultValue: _defaultValue,
  onChange,
  size = 'md',
  disabled = false,
  error = false,
  direction = 'column',
  spacing = 'md',
  children,
  className,
}: RadioGroupProps) {
  // Note: defaultValue would be used for uncontrolled mode - implement if needed
  void _defaultValue
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, size, disabled, error }}>
      <div
        role="radiogroup"
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col' : 'flex-row flex-wrap',
          spacingStyles[spacing],
          className
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

// Radio component
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Radio size */
  size?: RadioSize
  /** Label text */
  label?: ReactNode
  /** Children can also be used as label */
  children?: ReactNode
  /** Description text below the label */
  description?: ReactNode
  /** Whether radio has an error state */
  error?: boolean
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<RadioSize, { radio: string; dot: string; label: string }> = {
  sm: {
    radio: 'h-4 w-4',
    dot: 'h-1.5 w-1.5',
    label: 'text-sm',
  },
  md: {
    radio: 'h-5 w-5',
    dot: 'h-2 w-2',
    label: 'text-sm',
  },
  lg: {
    radio: 'h-6 w-6',
    dot: 'h-2.5 w-2.5',
    label: 'text-base',
  },
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size: sizeProp,
      label,
      children,
      description,
      error: errorProp,
      disabled: disabledProp,
      className,
      value,
      checked,
      onChange,
      name: nameProp,
      ...props
    },
    ref
  ) => {
    const context = useContext(RadioGroupContext)
    
    const size = sizeProp ?? context.size ?? 'md'
    const error = errorProp ?? context.error ?? false
    const disabled = disabledProp ?? context.disabled ?? false
    const name = nameProp ?? context.name
    const isChecked = context.value !== undefined ? context.value === value : checked
    
    // Use children as label if label prop not provided
    const labelContent = label ?? children
    
    const sizes = sizeStyles[size]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (context.onChange && value !== undefined) {
        context.onChange(value as string)
      }
      onChange?.(e)
    }

    return (
      <label
        className={cn(
          'relative inline-flex items-start gap-2.5 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        {/* Hidden native radio - positioned within label to prevent scroll */}
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="absolute top-0 left-0 opacity-0 w-4 h-4 peer"
          {...props}
        />

        {/* Custom radio visual */}
        <span
          className={cn(
            // Base styles
            'relative flex-shrink-0 rounded-full border-2 transition-all duration-150',
            'flex items-center justify-center',
            sizes.radio,
            // Unchecked state
            'border-border bg-background',
            // Hover
            'peer-hover:border-muted-foreground/70',
            // Focus
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
            // Checked state
            'peer-checked:border-primary peer-checked:bg-primary',
            // Error state
            error && 'border-destructive peer-checked:border-destructive peer-checked:bg-destructive'
          )}
        >
          {/* Inner dot */}
          <span
            className={cn(
              'rounded-full bg-primary-foreground transition-transform duration-150',
              'scale-0 peer-checked:scale-100',
              sizes.dot
            )}
            style={{
              transform: isChecked ? 'scale(1)' : 'scale(0)'
            }}
          />
        </span>

        {/* Label and description */}
        {(labelContent || description) && (
          <span className="flex flex-col gap-0.5 pt-0.5">
            {labelContent && (
              <span className={cn('text-foreground leading-tight', sizes.label)}>
                {labelContent}
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

Radio.displayName = 'Radio'
