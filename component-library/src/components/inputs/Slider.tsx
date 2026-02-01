import { forwardRef, useState, useRef, useCallback, useEffect, InputHTMLAttributes } from 'react'
import { cn } from '../../utils'

export type SliderSize = 'sm' | 'md' | 'lg'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  /** Slider size */
  size?: SliderSize
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Current value (single slider) */
  value?: number
  /** Current range values (range slider) */
  rangeValue?: [number, number]
  /** Default value */
  defaultValue?: number
  /** Default range values */
  defaultRangeValue?: [number, number]
  /** Change handler (single slider) */
  onChange?: (value: number) => void
  /** Change handler (range slider) */
  onRangeChange?: (value: [number, number]) => void
  /** Show value label */
  showValue?: boolean
  /** Show tooltip on thumb */
  showTooltip?: boolean | 'hover' | 'always'
  /** Show tick marks */
  showTicks?: boolean
  /** Tick interval (defaults to step) */
  tickInterval?: number
  /** Custom tick labels */
  tickLabels?: Record<number, string>
  /** Format value for display */
  formatValue?: (value: number) => string
  /** Enable range slider (two thumbs) */
  range?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<SliderSize, { track: string; thumb: string; label: string; thumbSize: number }> = {
  sm: {
    track: 'h-1',
    thumb: 'h-3.5 w-3.5',
    label: 'text-xs',
    thumbSize: 14,
  },
  md: {
    track: 'h-1.5',
    thumb: 'h-4 w-4',
    label: 'text-sm',
    thumbSize: 16,
  },
  lg: {
    track: 'h-2',
    thumb: 'h-5 w-5',
    label: 'text-sm',
    thumbSize: 20,
  },
}

// Tooltip component for thumb
function Tooltip({ 
  value, 
  visible, 
  formatValue 
}: { 
  value: number
  visible: boolean
  formatValue: (v: number) => string
}) {
  return (
    <div
      className={cn(
        'absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-xs whitespace-nowrap transition-opacity',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      {formatValue(value)}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
    </div>
  )
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      size = 'md',
      min = 0,
      max = 100,
      step = 1,
      value: valueProp,
      rangeValue: rangeValueProp,
      defaultValue = 0,
      defaultRangeValue,
      onChange,
      onRangeChange,
      showValue = false,
      showTooltip = false,
      showTicks = false,
      tickInterval,
      tickLabels,
      formatValue = (v) => v.toString(),
      range = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue)
    const [internalRangeValue, setInternalRangeValue] = useState<[number, number]>(
      defaultRangeValue ?? [min, max]
    )
    const [hoveredThumb, setHoveredThumb] = useState<'min' | 'max' | null>(null)
    const [draggingThumb, setDraggingThumb] = useState<'min' | 'max' | null>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    
    // Single slider value
    const value = valueProp !== undefined ? valueProp : internalValue
    const percentage = ((value - min) / (max - min)) * 100
    
    // Range slider values
    const rangeValue = rangeValueProp !== undefined ? rangeValueProp : internalRangeValue
    const minPercentage = ((rangeValue[0] - min) / (max - min)) * 100
    const maxPercentage = ((rangeValue[1] - min) / (max - min)) * 100
    
    const sizes = sizeStyles[size]
    
    // Calculate ticks
    const ticks = showTicks ? (() => {
      const interval = tickInterval ?? step
      const tickValues: number[] = []
      for (let v = min; v <= max; v += interval) {
        tickValues.push(v)
      }
      // Ensure max is included
      if (tickValues[tickValues.length - 1] !== max) {
        tickValues.push(max)
      }
      return tickValues
    })() : []

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      if (valueProp === undefined) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    }, [valueProp, onChange])
    
    // Handle range slider thumb drag
    const handleRangeThumbDrag = useCallback((e: React.MouseEvent | MouseEvent, thumb: 'min' | 'max') => {
      if (!trackRef.current || disabled) return
      
      const rect = trackRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const percent = x / rect.width
      let newValue = min + percent * (max - min)
      
      // Snap to step
      newValue = Math.round(newValue / step) * step
      newValue = Math.max(min, Math.min(max, newValue))
      
      let newRangeValue: [number, number]
      if (thumb === 'min') {
        newRangeValue = [Math.min(newValue, rangeValue[1] - step), rangeValue[1]]
      } else {
        newRangeValue = [rangeValue[0], Math.max(newValue, rangeValue[0] + step)]
      }
      
      if (rangeValueProp === undefined) {
        setInternalRangeValue(newRangeValue)
      }
      onRangeChange?.(newRangeValue)
    }, [disabled, min, max, step, rangeValue, rangeValueProp, onRangeChange])
    
    // Setup drag handlers
    useEffect(() => {
      if (!draggingThumb) return
      
      const handleMouseMove = (e: MouseEvent) => {
        handleRangeThumbDrag(e, draggingThumb)
      }
      
      const handleMouseUp = () => {
        setDraggingThumb(null)
      }
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }, [draggingThumb, handleRangeThumbDrag])
    
    // Should show tooltip
    const shouldShowTooltip = (thumb: 'min' | 'max' | 'single') => {
      if (!showTooltip) return false
      if (showTooltip === 'always') return true
      return thumb === 'single' 
        ? hoveredThumb === 'min' || draggingThumb === 'min'
        : hoveredThumb === thumb || draggingThumb === thumb
    }
    
    // Render single slider
    if (!range) {
      return (
        <div className={cn('relative w-full', className)}>
          {/* Value label */}
          {showValue && (
            <div className={cn(
              'mb-2 text-muted-foreground',
              sizes.label
            )}>
              {formatValue(value)}
            </div>
          )}

          {/* Slider container */}
          <div className="relative flex items-center">
            {/* Track */}
            <div
              ref={trackRef}
              className={cn(
                'relative w-full rounded-full bg-muted',
                sizes.track,
                disabled && 'opacity-50'
              )}
            >
              {/* Filled track */}
              <div
                className={cn(
                  'absolute h-full rounded-full bg-primary',
                  disabled && 'bg-muted-foreground'
                )}
                style={{ width: `${percentage}%` }}
              />
              
              {/* Ticks */}
              {showTicks && ticks.map(tick => (
                <div
                  key={tick}
                  className="absolute top-1/2 w-0.5 h-2 -translate-y-1/2 bg-border"
                  style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
                />
              ))}
            </div>

            {/* Native range input (invisible but functional) */}
            <input
              ref={ref}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleChange}
              disabled={disabled}
              className={cn(
                'absolute inset-0 w-full h-full opacity-0 cursor-pointer',
                disabled && 'cursor-not-allowed'
              )}
              onMouseEnter={() => setHoveredThumb('min')}
              onMouseLeave={() => setHoveredThumb(null)}
              {...props}
            />

            {/* Custom thumb */}
            <div
              className={cn(
                'absolute rounded-full bg-white border-2 border-primary shadow-sm',
                'pointer-events-none transition-transform',
                sizes.thumb,
                disabled && 'border-muted-foreground'
              )}
              style={{
                left: `calc(${percentage}% - ${sizes.thumbSize / 2}px)`,
              }}
            >
              {showTooltip && (
                <Tooltip 
                  value={value} 
                  visible={shouldShowTooltip('single')} 
                  formatValue={formatValue}
                />
              )}
            </div>
          </div>

          {/* Tick labels */}
          {showTicks && (
            <div className="relative mt-2">
              {ticks.map(tick => (
                <span
                  key={tick}
                  className={cn('absolute -translate-x-1/2 text-muted-foreground', sizes.label)}
                  style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
                >
                  {tickLabels?.[tick] ?? tick}
                </span>
              ))}
            </div>
          )}

          {/* Min/Max labels (if no ticks) */}
          {!showTicks && (
            <div className="flex justify-between mt-1">
              <span className={cn('text-muted-foreground', sizes.label)}>{min}</span>
              <span className={cn('text-muted-foreground', sizes.label)}>{max}</span>
            </div>
          )}
        </div>
      )
    }
    
    // Render range slider
    return (
      <div className={cn('relative w-full', className)}>
        {/* Value label */}
        {showValue && (
          <div className={cn(
            'mb-2 text-muted-foreground',
            sizes.label
          )}>
            {formatValue(rangeValue[0])} – {formatValue(rangeValue[1])}
          </div>
        )}

        {/* Slider container */}
        <div className="relative flex items-center h-5">
          {/* Track */}
          <div
            ref={trackRef}
            className={cn(
              'relative w-full rounded-full bg-muted',
              sizes.track,
              disabled && 'opacity-50'
            )}
          >
            {/* Filled track (between thumbs) */}
            <div
              className={cn(
                'absolute h-full bg-primary',
                disabled && 'bg-muted-foreground'
              )}
              style={{ 
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`
              }}
            />
            
            {/* Ticks */}
            {showTicks && ticks.map(tick => (
              <div
                key={tick}
                className="absolute top-1/2 w-0.5 h-2 -translate-y-1/2 bg-border"
                style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
              />
            ))}
          </div>

          {/* Min thumb */}
          <div
            className={cn(
              'absolute rounded-full bg-white border-2 border-primary shadow-sm cursor-grab',
              'transition-transform hover:scale-110',
              sizes.thumb,
              disabled && 'border-muted-foreground cursor-not-allowed',
              draggingThumb === 'min' && 'cursor-grabbing scale-110'
            )}
            style={{
              left: `calc(${minPercentage}% - ${sizes.thumbSize / 2}px)`,
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              if (!disabled) setDraggingThumb('min')
            }}
            onMouseEnter={() => setHoveredThumb('min')}
            onMouseLeave={() => !draggingThumb && setHoveredThumb(null)}
          >
            {showTooltip && (
              <Tooltip 
                value={rangeValue[0]} 
                visible={shouldShowTooltip('min')} 
                formatValue={formatValue}
              />
            )}
          </div>
          
          {/* Max thumb */}
          <div
            className={cn(
              'absolute rounded-full bg-white border-2 border-primary shadow-sm cursor-grab',
              'transition-transform hover:scale-110',
              sizes.thumb,
              disabled && 'border-muted-foreground cursor-not-allowed',
              draggingThumb === 'max' && 'cursor-grabbing scale-110'
            )}
            style={{
              left: `calc(${maxPercentage}% - ${sizes.thumbSize / 2}px)`,
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              if (!disabled) setDraggingThumb('max')
            }}
            onMouseEnter={() => setHoveredThumb('max')}
            onMouseLeave={() => !draggingThumb && setHoveredThumb(null)}
          >
            {showTooltip && (
              <Tooltip 
                value={rangeValue[1]} 
                visible={shouldShowTooltip('max')} 
                formatValue={formatValue}
              />
            )}
          </div>
        </div>

        {/* Tick labels */}
        {showTicks && (
          <div className="relative mt-2">
            {ticks.map(tick => (
              <span
                key={tick}
                className={cn('absolute -translate-x-1/2 text-muted-foreground', sizes.label)}
                style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
              >
                {tickLabels?.[tick] ?? tick}
              </span>
            ))}
          </div>
        )}

        {/* Min/Max labels (if no ticks) */}
        {!showTicks && (
          <div className="flex justify-between mt-1">
            <span className={cn('text-muted-foreground', sizes.label)}>{min}</span>
            <span className={cn('text-muted-foreground', sizes.label)}>{max}</span>
          </div>
        )}
      </div>
    )
  }
)

Slider.displayName = 'Slider'
