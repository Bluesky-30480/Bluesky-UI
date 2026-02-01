import { forwardRef, useState, useRef, useEffect, KeyboardEvent, useMemo } from 'react'
import { ChevronDown, Check, X, Search } from 'lucide-react'
import { cn } from '../../utils'

export type SelectSize = 'sm' | 'md' | 'lg'
export type SelectVariant = 'default' | 'filled' | 'ghost'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps {
  /** Select options */
  options: SelectOption[]
  /** Current value (single select) */
  value?: string
  /** Current values (multi select) */
  values?: string[]
  /** Default value (uncontrolled) */
  defaultValue?: string
  /** Default values (uncontrolled, multi select) */
  defaultValues?: string[]
  /** Placeholder text */
  placeholder?: string
  /** Change handler (single select) */
  onChange?: (value: string) => void
  /** Change handler (multi select) */
  onMultiChange?: (values: string[]) => void
  /** Select size */
  size?: SelectSize
  /** Select variant */
  variant?: SelectVariant
  /** Disabled state */
  disabled?: boolean
  /** Error state */
  error?: boolean
  /** Full width */
  fullWidth?: boolean
  /** Clearable */
  clearable?: boolean
  /** Enable search/filter */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Enable multi-select */
  multiple?: boolean
  /** Max items to show in chip display */
  maxDisplayItems?: number
  /** Custom filter function */
  filterFn?: (option: SelectOption, searchTerm: string) => boolean
  /** Show option groups */
  grouped?: boolean
  /** Additional class names */
  className?: string
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
}

const variantStyles: Record<SelectVariant, string> = {
  default: `
    bg-background border border-border
    hover:border-muted-foreground/50
    focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
  `,
  filled: `
    bg-muted border border-transparent
    hover:bg-muted/80
    focus-within:bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
  `,
  ghost: `
    bg-transparent border border-transparent
    hover:bg-muted/50
    focus-within:bg-muted/30 focus-within:border-border
  `,
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value: valueProp,
      values: valuesProp,
      defaultValue,
      defaultValues,
      placeholder = 'Select an option',
      onChange,
      onMultiChange,
      size = 'md',
      variant = 'default',
      disabled = false,
      error = false,
      fullWidth = false,
      clearable = false,
      searchable = false,
      searchPlaceholder = 'Search...',
      multiple = false,
      maxDisplayItems = 3,
      filterFn,
      grouped = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const [internalValues, setInternalValues] = useState<string[]>(defaultValues ?? [])
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [searchTerm, setSearchTerm] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Single select value
    const value = valueProp !== undefined ? valueProp : internalValue
    const selectedOption = options.find(opt => opt.value === value)
    
    // Multi select values
    const values = valuesProp !== undefined ? valuesProp : internalValues
    const selectedOptions = options.filter(opt => values.includes(opt.value))
    
    // Filter options based on search
    const defaultFilterFn = (option: SelectOption, term: string) => 
      option.label.toLowerCase().includes(term.toLowerCase())
    
    const filteredOptions = useMemo(() => {
      if (!searchTerm) return options
      const filter = filterFn || defaultFilterFn
      return options.filter(opt => filter(opt, searchTerm))
    }, [options, searchTerm, filterFn])
    
    // Group options if needed
    const groupedOptions = useMemo(() => {
      if (!grouped) return null
      const groups: Record<string, SelectOption[]> = {}
      filteredOptions.forEach(opt => {
        const groupName = opt.group || 'Other'
        if (!groups[groupName]) groups[groupName] = []
        groups[groupName].push(opt)
      })
      return groups
    }, [filteredOptions, grouped])

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
          setSearchTerm('')
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Reset highlight when opening
    useEffect(() => {
      if (isOpen) {
        const currentIndex = filteredOptions.findIndex(opt => opt.value === value)
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0)
        // Focus search input when opening
        if (searchable) {
          setTimeout(() => searchInputRef.current?.focus(), 0)
        }
      }
    }, [isOpen, filteredOptions, value, searchable])

    const handleSelect = (optionValue: string) => {
      if (multiple) {
        // Multi-select toggle
        const newValues = values.includes(optionValue)
          ? values.filter(v => v !== optionValue)
          : [...values, optionValue]
        
        if (valuesProp === undefined) {
          setInternalValues(newValues)
        }
        onMultiChange?.(newValues)
        // Don't close on multi-select
      } else {
        // Single select
        if (valueProp === undefined) {
          setInternalValue(optionValue)
        }
        onChange?.(optionValue)
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (multiple) {
        if (valuesProp === undefined) {
          setInternalValues([])
        }
        onMultiChange?.([])
      } else {
        if (valueProp === undefined) {
          setInternalValue('')
        }
        onChange?.('')
      }
    }
    
    const handleRemoveValue = (e: React.MouseEvent, valueToRemove: string) => {
      e.stopPropagation()
      const newValues = values.filter(v => v !== valueToRemove)
      if (valuesProp === undefined) {
        setInternalValues(newValues)
      }
      onMultiChange?.(newValues)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
      if (disabled) return

      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          if (isOpen && highlightedIndex >= 0) {
            const option = filteredOptions[highlightedIndex]
            if (option && !option.disabled) {
              handleSelect(option.value)
            }
          } else {
            setIsOpen(true)
          }
          break
        case ' ':
          if (!searchable || !(e.target as HTMLElement).matches('input')) {
            e.preventDefault()
            if (isOpen && highlightedIndex >= 0) {
              const option = filteredOptions[highlightedIndex]
              if (option && !option.disabled) {
                handleSelect(option.value)
              }
            } else {
              setIsOpen(true)
            }
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else {
            setHighlightedIndex(prev => {
              const next = prev + 1
              return next < filteredOptions.length ? next : prev
            })
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (isOpen) {
            setHighlightedIndex(prev => {
              const next = prev - 1
              return next >= 0 ? next : prev
            })
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          setSearchTerm('')
          break
        case 'Home':
          e.preventDefault()
          setHighlightedIndex(0)
          break
        case 'End':
          e.preventDefault()
          setHighlightedIndex(filteredOptions.length - 1)
          break
      }
    }
    
    // Render display value
    const renderDisplayValue = () => {
      if (multiple) {
        if (selectedOptions.length === 0) {
          return <span className="text-muted-foreground">{placeholder}</span>
        }
        
        const displayItems = selectedOptions.slice(0, maxDisplayItems)
        const remainingCount = selectedOptions.length - maxDisplayItems
        
        return (
          <div className="flex flex-wrap gap-1 items-center">
            {displayItems.map(opt => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveValue(e, opt.value)}
                  className="hover:bg-background rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs text-muted-foreground">
                +{remainingCount} more
              </span>
            )}
          </div>
        )
      }
      
      return (
        <span className={cn(!selectedOption && 'text-muted-foreground')}>
          {selectedOption?.label ?? placeholder}
        </span>
      )
    }
    
    // Render option list
    const renderOptions = (optionsToRender: SelectOption[], startIndex = 0) => {
      return optionsToRender.map((option, idx) => {
        const index = startIndex + idx
        const isSelected = multiple 
          ? values.includes(option.value)
          : option.value === value
        
        return (
          <li
            key={option.value}
            role="option"
            aria-selected={isSelected}
            aria-disabled={option.disabled}
            onClick={() => !option.disabled && handleSelect(option.value)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={cn(
              'flex items-center justify-between px-3 py-2 cursor-pointer',
              'transition-colors duration-75',
              index === highlightedIndex && 'bg-muted',
              isSelected && 'text-primary',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {multiple && (
              <span className={cn(
                'w-4 h-4 mr-2 border rounded flex items-center justify-center',
                isSelected ? 'bg-primary border-primary' : 'border-border'
              )}>
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </span>
            )}
            <span className="flex-1">{option.label}</span>
            {!multiple && isSelected && (
              <Check className="h-4 w-4" />
            )}
          </li>
        )
      })
    }

    return (
      <div
        ref={containerRef}
        className={cn('relative', fullWidth ? 'w-full' : 'w-auto inline-block', className)}
      >
        {/* Trigger button */}
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex items-center justify-between gap-2 rounded-md transition-colors duration-150',
            'text-left w-full',
            sizeStyles[size],
            variantStyles[variant],
            multiple && selectedOptions.length > 0 && 'h-auto min-h-10 py-1',
            error && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {renderDisplayValue()}
          <span className="flex items-center gap-1 flex-shrink-0">
            {clearable && ((multiple ? values.length > 0 : value) && !disabled) && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="p-0.5 hover:bg-muted rounded transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            )}
            <ChevronDown 
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180'
              )} 
            />
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              'absolute z-50 mt-1 w-full',
              'bg-surface border border-border rounded-md shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-100'
            )}
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setHighlightedIndex(0)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}
            
            <ul
              ref={listRef}
              role="listbox"
              aria-multiselectable={multiple}
              className="max-h-60 overflow-auto py-1"
            >
              {grouped && groupedOptions ? (
                // Render grouped options
                Object.entries(groupedOptions).map(([groupName, groupOptions], groupIdx) => {
                  const prevGroupsLength = Object.values(groupedOptions)
                    .slice(0, groupIdx)
                    .reduce((acc, g) => acc + g.length, 0)
                  
                  return (
                    <li key={groupName}>
                      <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {groupName}
                      </div>
                      <ul>
                        {renderOptions(groupOptions, prevGroupsLength)}
                      </ul>
                    </li>
                  )
                })
              ) : (
                // Render flat options
                renderOptions(filteredOptions)
              )}
              {filteredOptions.length === 0 && (
                <li className="px-3 py-2 text-muted-foreground text-sm text-center">
                  {searchTerm ? 'No matching options' : 'No options available'}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
