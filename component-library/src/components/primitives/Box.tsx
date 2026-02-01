import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  border?: boolean
  background?: 'none' | 'surface' | 'elevated' | 'overlay'
}

const paddingMap = {
  none: '',
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-12',
}

const marginMap = {
  none: '',
  xs: 'm-1',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-6',
  xl: 'm-8',
  '2xl': 'm-12',
}

const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

const shadowMap = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

const backgroundMap = {
  none: '',
  surface: 'bg-surface',
  elevated: 'bg-elevated',
  overlay: 'bg-overlay',
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    {
      as: Component = 'div',
      padding = 'none',
      margin = 'none',
      rounded = 'none',
      shadow = 'none',
      border = false,
      background = 'none',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          paddingMap[padding],
          marginMap[margin],
          roundedMap[rounded],
          shadowMap[shadow],
          backgroundMap[background],
          border && 'border border-border',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Box.displayName = 'Box'
