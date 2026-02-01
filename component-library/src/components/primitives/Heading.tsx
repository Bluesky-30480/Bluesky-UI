import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  color?: 'default' | 'muted' | 'primary'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
}

const sizeMap = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-3xl',
  '3xl': 'text-4xl',
  '4xl': 'text-5xl',
}

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
}

const colorMap = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
}

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

// Default sizes for each heading level
const defaultSizeByLevel: Record<HeadingLevel, HeadingProps['size']> = {
  h1: '3xl',
  h2: '2xl',
  h3: 'xl',
  h4: 'lg',
  h5: 'md',
  h6: 'sm',
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as: Component = 'h2',
      size,
      weight = 'bold',
      color = 'default',
      align,
      truncate = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size || defaultSizeByLevel[Component]

    return (
      <Component
        ref={ref}
        className={cn(
          'tracking-tight',
          resolvedSize && sizeMap[resolvedSize],
          weightMap[weight],
          colorMap[color],
          align && alignMap[align],
          truncate && 'truncate',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Heading.displayName = 'Heading'
