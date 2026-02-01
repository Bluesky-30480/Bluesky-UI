import React, { createContext, useContext, useMemo, useState } from 'react'
import { cn } from '../../utils/cn'

export type AccordionType = 'single' | 'multiple'

interface AccordionContextValue {
  openValues: string[]
  toggleValue: (value: string) => void
  type: AccordionType
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AccordionType
  value?: string | string[]
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

export function Accordion({
  type = 'single',
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const isControlled = valueProp !== undefined
  const defaultArray = toArray(defaultValue)
  const [internalValue, setInternalValue] = useState<string[]>(defaultArray)
  const openValues = isControlled ? toArray(valueProp) : internalValue

  const toggleValue = (value: string) => {
    let nextValues: string[]
    if (type === 'single') {
      nextValues = openValues.includes(value) ? [] : [value]
    } else {
      nextValues = openValues.includes(value)
        ? openValues.filter((item) => item !== value)
        : [...openValues, value]
    }

    if (!isControlled) setInternalValue(nextValues)
    onValueChange?.(type === 'single' ? nextValues[0] ?? '' : nextValues)
  }

  const context = useMemo(
    () => ({ openValues, toggleValue, type }),
    [openValues, type]
  )

  return (
    <AccordionContext.Provider value={context}>
      <div className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const context = useAccordionContext('AccordionItem')
  const isOpen = context.openValues.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        className={cn('rounded-md border border-border bg-surface', className)}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({ className, ...props }: AccordionTriggerProps) {
  const item = useAccordionItemContext('AccordionTrigger')
  const accordion = useAccordionContext('AccordionTrigger')

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium',
        'transition-colors hover:bg-muted/60',
        className
      )}
      onClick={() => accordion.toggleValue(item.value)}
      aria-expanded={item.isOpen}
      {...props}
    />
  )
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({ className, ...props }: AccordionContentProps) {
  const item = useAccordionItemContext('AccordionContent')

  return (
    <div
      className={cn('px-4 pb-4 text-sm text-muted-foreground', className)}
      hidden={!item.isOpen}
      {...props}
    />
  )
}

const useAccordionContext = (component: string) => {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error(`${component} must be used within Accordion`)
  }
  return context
}

const useAccordionItemContext = (component: string) => {
  const context = useContext(AccordionItemContext)
  if (!context) {
    throw new Error(`${component} must be used within AccordionItem`)
  }
  return context
}

const toArray = (value?: string | string[]) => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}
