import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: 'thin' | 'medium' | 'thick'
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'default' | 'muted' | 'primary'
}

const thicknessMap = {
  thin: {
    horizontal: 'h-px',
    vertical: 'w-px',
  },
  medium: {
    horizontal: 'h-0.5',
    vertical: 'w-0.5',
  },
  thick: {
    horizontal: 'h-1',
    vertical: 'w-1',
  },
}

const spacingMap = {
  none: '',
  xs: {
    horizontal: 'my-1',
    vertical: 'mx-1',
  },
  sm: {
    horizontal: 'my-2',
    vertical: 'mx-2',
  },
  md: {
    horizontal: 'my-4',
    vertical: 'mx-4',
  },
  lg: {
    horizontal: 'my-6',
    vertical: 'mx-6',
  },
  xl: {
    horizontal: 'my-8',
    vertical: 'mx-8',
  },
}

const variantMap = {
  solid: 'border-0',
  dashed: 'border-dashed border-0',
  dotted: 'border-dotted border-0',
}

const colorMap = {
  default: 'bg-border',
  muted: 'bg-muted',
  primary: 'bg-primary',
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      thickness = 'thin',
      spacing = 'md',
      color = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === 'horizontal'

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          variantMap[variant],
          colorMap[color],
          thicknessMap[thickness][orientation],
          isHorizontal ? 'w-full' : 'h-full self-stretch',
          spacing !== 'none' && spacingMap[spacing][orientation],
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'
