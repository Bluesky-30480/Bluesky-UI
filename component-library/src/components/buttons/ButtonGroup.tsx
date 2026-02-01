import React, { type HTMLAttributes, isValidElement } from 'react'
import { cn } from '../../utils/cn'

export type ButtonGroupSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: ButtonGroupSpacing
  orientation?: ButtonGroupOrientation
  isAttached?: boolean
}

const spacingMap: Record<ButtonGroupSpacing, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
  '2xl': 'gap-8',
}

const getAttachedClass = (index: number, lastIndex: number, orientation: ButtonGroupOrientation) => {
  if (orientation === 'vertical') {
    if (index === 0) return 'rounded-b-none'
    if (index === lastIndex) return 'rounded-t-none'
    return 'rounded-none'
  }
  if (index === 0) return 'rounded-r-none'
  if (index === lastIndex) return 'rounded-l-none'
  return 'rounded-none'
}

export function ButtonGroup({
  spacing = 'sm',
  orientation = 'horizontal',
  isAttached = false,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  const childArray = React.Children.toArray(children)
  const lastIndex = childArray.length - 1

  const resolvedChildren = isAttached
    ? childArray.map((child, index) => {
        if (!isValidElement(child)) return child
        return React.cloneElement(child, {
          className: cn(child.props.className, getAttachedClass(index, lastIndex, orientation)),
        })
      })
    : children

  return (
    <div
      className={cn(
        orientation === 'vertical' ? 'inline-flex flex-col' : 'inline-flex flex-row',
        isAttached ? 'gap-0' : spacingMap[spacing],
        isAttached && (orientation === 'vertical' ? 'divide-y divide-border' : 'divide-x divide-border'),
        className
      )}
      {...props}
    >
      {resolvedChildren}
    </div>
  )
}
