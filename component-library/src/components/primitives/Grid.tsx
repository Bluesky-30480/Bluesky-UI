import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type GridSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type GridAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type GridJustify = 'start' | 'center' | 'end' | 'stretch'
export type GridAutoFlow = 'row' | 'column' | 'dense' | 'row dense' | 'column dense'

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number | string
  rows?: number | string
  minColumnWidth?: string
  autoFit?: boolean
  gap?: GridSpacing | number
  rowGap?: GridSpacing | number
  columnGap?: GridSpacing | number
  align?: GridAlign
  justify?: GridJustify
  autoFlow?: GridAutoFlow
  inline?: boolean
}

const spacingMap: Record<GridSpacing, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
}

const spacingXMap: Record<GridSpacing, string> = {
  none: 'gap-x-0',
  xs: 'gap-x-1',
  sm: 'gap-x-2',
  md: 'gap-x-4',
  lg: 'gap-x-6',
  xl: 'gap-x-8',
  '2xl': 'gap-x-12',
  '3xl': 'gap-x-16',
}

const spacingYMap: Record<GridSpacing, string> = {
  none: 'gap-y-0',
  xs: 'gap-y-1',
  sm: 'gap-y-2',
  md: 'gap-y-4',
  lg: 'gap-y-6',
  xl: 'gap-y-8',
  '2xl': 'gap-y-12',
  '3xl': 'gap-y-16',
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

const numericGapXMap: Record<number, string> = {
  0: 'gap-x-0',
  1: 'gap-x-1',
  2: 'gap-x-2',
  3: 'gap-x-3',
  4: 'gap-x-4',
  5: 'gap-x-5',
  6: 'gap-x-6',
  8: 'gap-x-8',
  10: 'gap-x-10',
  12: 'gap-x-12',
  16: 'gap-x-16',
}

const numericGapYMap: Record<number, string> = {
  0: 'gap-y-0',
  1: 'gap-y-1',
  2: 'gap-y-2',
  3: 'gap-y-3',
  4: 'gap-y-4',
  5: 'gap-y-5',
  6: 'gap-y-6',
  8: 'gap-y-8',
  10: 'gap-y-10',
  12: 'gap-y-12',
  16: 'gap-y-16',
}

const alignMap: Record<GridAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyMap: Record<GridJustify, string> = {
  start: 'justify-items-start',
  center: 'justify-items-center',
  end: 'justify-items-end',
  stretch: 'justify-items-stretch',
}

const autoFlowMap: Record<GridAutoFlow, string> = {
  row: 'grid-flow-row',
  column: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row dense': 'grid-flow-row-dense',
  'column dense': 'grid-flow-col-dense',
}

const resolveGapClass = (value?: GridSpacing | number, axis: 'x' | 'y' | 'both' = 'both') => {
  if (value === undefined) return undefined
  if (typeof value === 'number') {
    if (axis === 'x') return numericGapXMap[value]
    if (axis === 'y') return numericGapYMap[value]
    return numericGapMap[value]
  }
  if (axis === 'x') return spacingXMap[value]
  if (axis === 'y') return spacingYMap[value]
  return spacingMap[value]
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns,
      rows,
      minColumnWidth,
      autoFit = true,
      gap,
      rowGap,
      columnGap,
      align = 'stretch',
      justify = 'stretch',
      autoFlow = 'row',
      inline = false,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedColumns =
      columns !== undefined
        ? typeof columns === 'number'
          ? `repeat(${columns}, minmax(0, 1fr))`
          : columns
        : minColumnWidth
          ? `repeat(${autoFit ? 'auto-fit' : 'auto-fill'}, minmax(${minColumnWidth}, 1fr))`
          : undefined

    const resolvedRows =
      rows !== undefined
        ? typeof rows === 'number'
          ? `repeat(${rows}, minmax(0, 1fr))`
          : rows
        : undefined

    const resolvedStyle = {
      ...style,
      gridTemplateColumns: resolvedColumns ?? style?.gridTemplateColumns,
      gridTemplateRows: resolvedRows ?? style?.gridTemplateRows,
    }

    const gapClass = rowGap !== undefined || columnGap !== undefined ? undefined : resolveGapClass(gap)
    const rowGapClass = resolveGapClass(rowGap, 'y')
    const columnGapClass = resolveGapClass(columnGap, 'x')

    return (
      <div
        ref={ref}
        className={cn(
          inline ? 'inline-grid' : 'grid',
          gapClass,
          rowGapClass,
          columnGapClass,
          alignMap[align],
          justifyMap[justify],
          autoFlowMap[autoFlow],
          className
        )}
        style={resolvedStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'
