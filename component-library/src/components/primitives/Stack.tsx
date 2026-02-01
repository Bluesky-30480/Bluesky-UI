import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  spacing?: StackSpacing
  /** Alias for spacing that accepts numbers or spacing tokens */
  gap?: number | StackSpacing
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  inline?: boolean
}

const spacingMap: Record<StackSpacing, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
}

const numericGapMap: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
}

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      spacing = 'md',
      gap,
      align = 'stretch',
      justify = 'start',
      wrap = false,
      inline = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedGap =
      typeof gap === 'number'
        ? numericGapMap[gap]
        : gap
          ? spacingMap[gap]
          : spacingMap[spacing]

    return (
      <div
        ref={ref}
        className={cn(
          inline ? 'inline-flex' : 'flex',
          direction === 'row' ? 'flex-row' : 'flex-col',
          resolvedGap,
          alignMap[align],
          justifyMap[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

// Convenience components
export const HStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>((props, ref) => (
  <Stack ref={ref} direction="row" {...props} />
))
HStack.displayName = 'HStack'

export const VStack = forwardRef<HTMLDivElement, Omit<StackProps, 'direction'>>((props, ref) => (
  <Stack ref={ref} direction="column" {...props} />
))
VStack.displayName = 'VStack'
