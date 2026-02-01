import React, { useState } from 'react'
import { cn } from '../../utils/cn'

const palette = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#fb7185']

const normalize = (values: number[]) => {
  const max = Math.max(1, ...values)
  return values.map((v) => v / max)
}

// Tooltip component
interface TooltipState {
  visible: boolean
  x: number
  y: number
  label: string
  value: string
}

function ChartTooltip({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip.visible) return null
  
  return (
    <div 
      className="absolute z-50 px-2 py-1 bg-foreground text-background text-xs rounded shadow-lg pointer-events-none"
      style={{ 
        left: tooltip.x, 
        top: tooltip.y, 
        transform: 'translate(-50%, -100%) translateY(-8px)' 
      }}
    >
      <div className="font-medium">{tooltip.label}</div>
      <div>{tooltip.value}</div>
    </div>
  )
}

// Legend component
interface LegendItem {
  label: string
  color: string
  active?: boolean
}

interface LegendProps {
  items: LegendItem[]
  onToggle?: (index: number) => void
  className?: string
}

function ChartLegend({ items, onToggle, className }: LegendProps) {
  return (
    <div className={cn('flex flex-wrap gap-3 text-xs', className)}>
      {items.map((item, index) => (
        <button
          key={item.label}
          onClick={() => onToggle?.(index)}
          className={cn(
            'flex items-center gap-1.5 transition-opacity',
            item.active === false && 'opacity-40'
          )}
        >
          <span 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

export function ChartContainer({ title, description, className, children, ...props }: ChartContainerProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      {title && <div className="text-sm font-semibold text-foreground">{title}</div>}
      {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  labels?: string[]
  height?: number
  showTooltip?: boolean
  showGrid?: boolean
  showDots?: boolean
  animated?: boolean
  formatValue?: (value: number) => string
}

export function LineChart({ 
  data, 
  labels,
  height = 160, 
  showTooltip = true,
  showGrid = true,
  showDots = true,
  animated = true,
  formatValue = (v) => v.toString(),
  className, 
  ...props 
}: LineChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', value: '' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const norm = normalize(data)
  const points = norm.map((v, i) => ({
    x: (i / Math.max(1, data.length - 1)) * 100,
    y: (1 - v) * 100,
    value: data[i],
    label: labels?.[i] ?? `Point ${i + 1}`
  }))
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  return (
    <div className={cn('w-full relative', className)} {...props}>
      <svg viewBox="0 0 100 100" style={{ height }} className="w-full">
        {/* Grid lines */}
        {showGrid && (
          <g className="text-border" stroke="currentColor" strokeWidth="0.5" opacity="0.3">
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} />
            ))}
          </g>
        )}
        
        {/* Line */}
        <path 
          d={pathD}
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? 'animate-[draw_1s_ease-out_forwards]' : ''}
          style={animated ? { strokeDasharray: 1000, strokeDashoffset: 1000 } : undefined}
        />
        
        {/* Dots */}
        {showDots && points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={hoveredIndex === i ? 4 : 2.5}
            fill="hsl(var(--primary))"
            className="transition-all duration-150 cursor-pointer"
            onMouseEnter={(e) => {
              setHoveredIndex(i)
              if (showTooltip) {
                const rect = (e.target as SVGElement).getBoundingClientRect()
                setTooltip({
                  visible: true,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  label: point.label,
                  value: formatValue(point.value)
                })
              }
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
              setTooltip(t => ({ ...t, visible: false }))
            }}
          />
        ))}
      </svg>
      
      {showTooltip && (
        <div className="fixed z-50" style={{ left: 0, top: 0, pointerEvents: 'none' }}>
          <ChartTooltip tooltip={tooltip} />
        </div>
      )}
    </div>
  )
}

export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  labels?: string[]
  height?: number
  showTooltip?: boolean
  formatValue?: (value: number) => string
}

export function AreaChart({ 
  data, 
  labels,
  height = 160, 
  showTooltip = true,
  formatValue = (v) => v.toString(),
  className, 
  ...props 
}: AreaChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', value: '' })
  
  const norm = normalize(data)
  const points = norm.map((v, i) => ({
    x: (i / Math.max(1, data.length - 1)) * 100,
    y: (1 - v) * 100,
    value: data[i],
    label: labels?.[i] ?? `Point ${i + 1}`
  }))
  
  const line = points.map(p => `${p.x},${p.y}`).join(' ')
  const area = `0,100 ${line} 100,100`
  
  return (
    <div className={cn('w-full relative', className)} {...props}>
      <svg viewBox="0 0 100 100" style={{ height }} className="w-full">
        <polygon points={area} fill="hsl(var(--primary) / 0.2)" />
        <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" points={line} />
        
        {/* Hover areas */}
        {points.map((point, i) => (
          <rect
            key={i}
            x={point.x - 5}
            y={0}
            width={10}
            height={100}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={(e) => {
              if (showTooltip) {
                const rect = (e.target as SVGElement).getBoundingClientRect()
                setTooltip({
                  visible: true,
                  x: rect.left + rect.width / 2,
                  y: rect.top + (point.y / 100) * rect.height,
                  label: point.label,
                  value: formatValue(point.value)
                })
              }
            }}
            onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
          />
        ))}
      </svg>
      
      {showTooltip && (
        <div className="fixed z-50" style={{ left: 0, top: 0, pointerEvents: 'none' }}>
          <ChartTooltip tooltip={tooltip} />
        </div>
      )}
    </div>
  )
}

export interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  height?: number
}

export function Sparkline({ data, height = 48, className, ...props }: SparklineProps) {
  const points = normalize(data).map((v, i) => `${(i / Math.max(1, data.length - 1)) * 100},${(1 - v) * 100}`)
  return (
    <div className={cn('w-full', className)} {...props}>
      <svg viewBox="0 0 100 100" style={{ height }} className="w-full">
        <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="3" points={points.join(' ')} />
      </svg>
    </div>
  )
}

export interface BarChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  data: number[]
  labels?: string[]
  showTooltip?: boolean
  showValues?: boolean
  horizontal?: boolean
  formatValue?: (value: number) => string
  onClick?: (index: number, value: number) => void
}

export function BarChart({ 
  data, 
  labels,
  showTooltip = true,
  showValues = false,
  horizontal = false,
  formatValue = (v) => v.toString(),
  onClick,
  className, 
  ...props 
}: BarChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', value: '' })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const norm = normalize(data)
  
  if (horizontal) {
    return (
      <div className={cn('space-y-2 relative', className)} {...props}>
        {norm.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            {labels && <span className="text-xs text-muted-foreground w-20 truncate">{labels[i]}</span>}
            <div 
              className={cn(
                'h-6 rounded transition-all duration-200',
                hoveredIndex === i ? 'bg-primary' : 'bg-primary/70'
              )}
              style={{ width: `${v * 100}%` }}
              onMouseEnter={(e) => {
                setHoveredIndex(i)
                if (showTooltip) {
                  const rect = (e.target as HTMLElement).getBoundingClientRect()
                  setTooltip({
                    visible: true,
                    x: rect.right,
                    y: rect.top + rect.height / 2,
                    label: labels?.[i] ?? `Bar ${i + 1}`,
                    value: formatValue(data[i])
                  })
                }
              }}
              onMouseLeave={() => {
                setHoveredIndex(null)
                setTooltip(t => ({ ...t, visible: false }))
              }}
              onClick={() => onClick?.(i, data[i])}
            />
            {showValues && <span className="text-xs text-muted-foreground">{formatValue(data[i])}</span>}
          </div>
        ))}
        {showTooltip && <ChartTooltip tooltip={tooltip} />}
      </div>
    )
  }
  
  return (
    <div className={cn('flex items-end gap-2 h-40 relative', className)} {...props}>
      {norm.map((v, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 rounded-md transition-all duration-200 cursor-pointer',
            hoveredIndex === i ? 'bg-primary' : 'bg-primary/70'
          )}
          style={{ height: `${v * 100}%` }}
          onMouseEnter={(e) => {
            setHoveredIndex(i)
            if (showTooltip) {
              const rect = (e.target as HTMLElement).getBoundingClientRect()
              setTooltip({
                visible: true,
                x: rect.left + rect.width / 2,
                y: rect.top,
                label: labels?.[i] ?? `Bar ${i + 1}`,
                value: formatValue(data[i])
              })
            }
          }}
          onMouseLeave={() => {
            setHoveredIndex(null)
            setTooltip(t => ({ ...t, visible: false }))
          }}
          onClick={() => onClick?.(i, data[i])}
        />
      ))}
      {showTooltip && <ChartTooltip tooltip={tooltip} />}
    </div>
  )
}

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  labels?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  formatValue?: (value: number) => string
  onSliceClick?: (index: number, value: number) => void
}

export function PieChart({ 
  data, 
  labels,
  showLegend = true,
  showTooltip = true,
  formatValue = (v) => v.toString(),
  onSliceClick,
  className, 
  ...props 
}: PieChartProps) {
  const [activeSlices, setActiveSlices] = useState<boolean[]>(data.map(() => true))
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', value: '' })
  
  const activeData = data.map((v, i) => activeSlices[i] ? v : 0)
  const total = activeData.reduce((a, b) => a + b, 0) || 1
  
  let current = 0
  const stops = activeData.map((value, index) => {
    const start = (current / total) * 360
    current += value
    const end = (current / total) * 360
    return `${activeSlices[index] ? palette[index % palette.length] : 'transparent'} ${start}deg ${end}deg`
  })

  const legendItems: LegendItem[] = data.map((_, i) => ({
    label: labels?.[i] ?? `Slice ${i + 1}`,
    color: palette[i % palette.length],
    active: activeSlices[i]
  }))
  
  const toggleSlice = (index: number) => {
    setActiveSlices(prev => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)} {...props}>
      <div
        className="h-40 w-40 rounded-full cursor-pointer relative"
        style={{ background: `conic-gradient(${stops.join(', ')})` }}
        onMouseMove={(e) => {
          if (!showTooltip) return
          const rect = (e.target as HTMLElement).getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
          if (angle < 0) angle += 360
          
          let cumulative = 0
          for (let i = 0; i < activeData.length; i++) {
            const sliceAngle = (activeData[i] / total) * 360
            if (angle <= cumulative + sliceAngle && activeSlices[i]) {
              setTooltip({
                visible: true,
                x: e.clientX,
                y: e.clientY,
                label: labels?.[i] ?? `Slice ${i + 1}`,
                value: `${formatValue(data[i])} (${Math.round((data[i] / total) * 100)}%)`
              })
              return
            }
            cumulative += sliceAngle
          }
        }}
        onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
        onClick={(e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
          if (angle < 0) angle += 360
          
          let cumulative = 0
          for (let i = 0; i < activeData.length; i++) {
            const sliceAngle = (activeData[i] / total) * 360
            if (angle <= cumulative + sliceAngle) {
              onSliceClick?.(i, data[i])
              return
            }
            cumulative += sliceAngle
          }
        }}
      />
      
      {showLegend && (
        <ChartLegend items={legendItems} onToggle={toggleSlice} />
      )}
      
      {showTooltip && (
        <div className="fixed z-50" style={{ left: 0, top: 0, pointerEvents: 'none' }}>
          <ChartTooltip tooltip={tooltip} />
        </div>
      )}
    </div>
  )
}

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[][]
  rowLabels?: string[]
  colLabels?: string[]
  showTooltip?: boolean
  formatValue?: (value: number) => string
}

export function Heatmap({ 
  data, 
  rowLabels,
  colLabels,
  showTooltip = true,
  formatValue = (v) => v.toString(),
  className, 
  ...props 
}: HeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, label: '', value: '' })
  const flat = data.flat()
  const max = Math.max(1, ...flat)
  
  return (
    <div className={cn('relative', className)} {...props}>
      {/* Column labels */}
      {colLabels && (
        <div 
          className="grid gap-1 mb-1 ml-16" 
          style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 0}, minmax(0, 1fr))` }}
        >
          {colLabels.map((label, i) => (
            <div key={i} className="text-xs text-muted-foreground text-center truncate">{label}</div>
          ))}
        </div>
      )}
      
      <div className="flex">
        {/* Row labels */}
        {rowLabels && (
          <div className="flex flex-col gap-1 mr-2 w-14">
            {rowLabels.map((label, i) => (
              <div key={i} className="h-6 text-xs text-muted-foreground flex items-center justify-end truncate">
                {label}
              </div>
            ))}
          </div>
        )}
        
        {/* Grid */}
        <div 
          className="grid gap-1 flex-1" 
          style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 0}, minmax(0, 1fr))` }}
        >
          {data.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="aspect-square rounded-sm cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: `hsl(var(--primary) / ${value / max})` }}
                onMouseEnter={(e) => {
                  if (showTooltip) {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({
                      visible: true,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      label: `${rowLabels?.[rowIndex] ?? `Row ${rowIndex}`}, ${colLabels?.[colIndex] ?? `Col ${colIndex}`}`,
                      value: formatValue(value)
                    })
                  }
                }}
                onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
              />
            ))
          )}
        </div>
      </div>
      
      {showTooltip && <ChartTooltip tooltip={tooltip} />}
    </div>
  )
}

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  labels?: string[]
  showLabels?: boolean
}

export function RadarChart({ data, labels, showLabels = true, className, ...props }: RadarChartProps) {
  const norm = normalize(data)
  const angleStep = (Math.PI * 2) / data.length
  
  const points = norm.map((v, i) => {
    const angle = angleStep * i - Math.PI / 2
    const radius = v * 40
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    }
  })
  
  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className={cn('w-full', className)} {...props}>
      <svg viewBox="0 0 100 100" className="w-full h-40">
        {/* Grid */}
        {gridLevels.map(level => {
          const gridPoints = data.map((_, i) => {
            const angle = angleStep * i - Math.PI / 2
            const radius = level * 40
            return `${50 + radius * Math.cos(angle)},${50 + radius * Math.sin(angle)}`
          })
          return (
            <polygon 
              key={level} 
              points={gridPoints.join(' ')} 
              fill="none" 
              stroke="hsl(var(--border))" 
              strokeWidth="0.5" 
            />
          )
        })}
        
        {/* Axes */}
        {data.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 40 * Math.cos(angle)}
              y2={50 + 40 * Math.sin(angle)}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          )
        })}
        
        {/* Data */}
        <polygon 
          points={points.map(p => `${p.x},${p.y}`).join(' ')} 
          fill="hsl(var(--primary) / 0.2)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
        />
        
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(var(--primary))" />
        ))}
        
        {/* Labels */}
        {showLabels && labels && labels.map((label, i) => {
          const angle = angleStep * i - Math.PI / 2
          const labelRadius = 48
          const x = 50 + labelRadius * Math.cos(angle)
          const y = 50 + labelRadius * Math.sin(angle)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[6px]"
            >
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export interface StreamGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  series: number[][]
}

export function StreamGraph({ series, className, ...props }: StreamGraphProps) {
  const totals = series[0]?.map((_, index) => series.reduce((sum, s) => sum + (s[index] ?? 0), 0)) ?? []
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {series.map((values, i) => (
        <div key={i} className="flex gap-1">
          {values.map((value, index) => (
            <div
              key={index}
              className="h-4 rounded-sm"
              style={{ width: `${((value || 0) / Math.max(1, totals[index] || 1)) * 100}%`, backgroundColor: palette[i % palette.length] }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export interface TimelineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  points: Array<{ label: string; value: number }>
}

export function TimelineChart({ points, className, ...props }: TimelineChartProps) {
  const norm = normalize(points.map((p) => p.value))
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      {points.map((point, index) => (
        <div key={point.label} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" style={{ opacity: norm[index] }} />
          <span className="text-xs text-muted-foreground">{point.label}</span>
        </div>
      ))}
    </div>
  )
}

export interface NodeGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: string[]
  edges?: Array<{ from: string; to: string }>
}

export function NodeGraph({ nodes, edges = [], className, ...props }: NodeGraphProps) {
  return (
    <div className={cn('space-y-2 rounded-md border border-border p-3', className)} {...props}>
      <div className="text-xs text-muted-foreground">Nodes: {nodes.join(', ')}</div>
      <div className="text-xs text-muted-foreground">Edges: {edges.map((e) => `${e.from}→${e.to}`).join(', ') || 'None'}</div>
    </div>
  )
}

export interface DependencyGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: Record<string, string[]>
}

export function DependencyGraph({ dependencies, className, ...props }: DependencyGraphProps) {
  return (
    <div className={cn('space-y-2 rounded-md border border-border p-3', className)} {...props}>
      {Object.entries(dependencies).map(([key, deps]) => (
        <div key={key} className="text-xs text-muted-foreground">
          {key}: {deps.join(', ') || 'None'}
        </div>
      ))}
    </div>
  )
}

export interface PerformanceMonitorProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: Array<{ label: string; value: string }>
}

export function PerformanceMonitor({ metrics, className, ...props }: PerformanceMonitorProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', className)} {...props}>
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-md border border-border bg-surface p-3">
          <div className="text-xs text-muted-foreground">{metric.label}</div>
          <div className="text-lg font-semibold text-foreground">{metric.value}</div>
        </div>
      ))}
    </div>
  )
}
