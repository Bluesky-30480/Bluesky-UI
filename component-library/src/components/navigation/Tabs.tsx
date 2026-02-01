import React, { createContext, useContext, useMemo, useState } from 'react'
import { cn } from '../../utils/cn'

type TabsOrientation = 'horizontal' | 'vertical'

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
  orientation: TabsOrientation
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
}

export function Tabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: TabsProps) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const value = isControlled ? valueProp ?? '' : internalValue

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onValueChange?.(next)
  }

  const context = useMemo(
    () => ({ value, setValue, orientation }),
    [value, orientation]
  )

  return (
    <TabsContext.Provider value={context}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, ...props }: TabsListProps) {
  const context = useTabsContext('TabsList')
  return (
    <div
      role="tablist"
      aria-orientation={context.orientation}
      className={cn(
        'inline-flex items-center gap-2 rounded-md bg-muted/50 p-1',
        context.orientation === 'vertical' && 'flex-col items-start',
        className
      )}
      {...props}
    />
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const context = useTabsContext('TabsTrigger')
  const isActive = context.value === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => context.setValue(value)}
      className={cn(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-surface text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    />
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const context = useTabsContext('TabsContent')
  const isActive = context.value === value

  return (
    <div
      role="tabpanel"
      hidden={!isActive}
      className={cn('mt-4', className)}
      {...props}
    />
  )
}

const useTabsContext = (component: string) => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error(`${component} must be used within Tabs`)
  }
  return context
}
