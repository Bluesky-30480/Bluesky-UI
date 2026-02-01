import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

type TextElement = 'p' | 'span' | 'label' | 'small' | 'strong' | 'em' | 'code' | 'pre' | 'mark' | 'del' | 'ins' | 'sub' | 'sup'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: TextElement
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error'
  align?: 'left' | 'center' | 'right' | 'justify'
  truncate?: boolean
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6
  children?: ReactNode
}

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorMap = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

const lineClampMap = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
}

export function Text({
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  align,
  truncate = false,
  lineClamp,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        sizeMap[size],
        weightMap[weight],
        colorMap[color],
        align && alignMap[align],
        truncate && 'truncate',
        lineClamp && lineClampMap[lineClamp],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
