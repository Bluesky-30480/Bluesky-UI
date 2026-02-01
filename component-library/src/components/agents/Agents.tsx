import React, { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { X, RefreshCw, Circle, CircleDot, Check, Ban, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

// ============================================================================
// Agent Panel - Main container with layout
// ============================================================================

export interface AgentPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel layout direction */
  layout?: 'horizontal' | 'vertical'
  /** Whether sidebar is collapsible */
  collapsible?: boolean
  /** Initial collapsed state */
  defaultCollapsed?: boolean
}

export function AgentPanel({ 
  layout = 'horizontal',
  collapsible = false,
  defaultCollapsed = false,
  className, 
  children,
  ...props 
}: AgentPanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  
  return (
    <div 
      className={cn(
        'flex rounded-lg border border-border bg-surface overflow-hidden',
        layout === 'vertical' && 'flex-col',
        className
      )} 
      {...props}
    >
      {collapsible && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'absolute z-10 rounded-full bg-muted p-1 text-muted-foreground hover:bg-muted/80 transition-colors',
            layout === 'horizontal' ? 'top-2 left-2' : 'top-2 right-2'
          )}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      )}
      {children}
    </div>
  )
}

export interface AgentSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of sidebar (default: 280px) */
  width?: number | string
}

export function AgentSidebar({ width = 280, className, ...props }: AgentSidebarProps) {
  return (
    <div 
      className={cn('border-r border-border bg-surface p-4 shrink-0', className)} 
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      {...props} 
    />
  )
}

export interface AgentMainProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AgentMain({ className, ...props }: AgentMainProps) {
  return <div className={cn('flex-1 overflow-auto', className)} {...props} />
}

// ============================================================================
// Agent Card - Display agent info with status
// ============================================================================

export type AgentStatusType = 'idle' | 'running' | 'thinking' | 'waiting' | 'error' | 'success' | 'paused'

export interface AgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Agent name */
  name: string
  /** Agent description */
  description?: string
  /** Agent avatar URL */
  avatar?: string
  /** Current status */
  status?: AgentStatusType
  /** Last active time */
  lastActive?: Date | string
  /** Whether card is selected */
  selected?: boolean
  /** Click handler */
  onSelect?: () => void
  /** Action buttons */
  actions?: React.ReactNode
}

const statusConfig: Record<AgentStatusType, { bg: string; dot: string; label: string }> = {
  idle: { bg: 'bg-muted/30', dot: 'bg-muted-foreground', label: 'Idle' },
  running: { bg: 'bg-primary/10', dot: 'bg-primary animate-pulse', label: 'Running' },
  thinking: { bg: 'bg-warning/10', dot: 'bg-warning animate-pulse', label: 'Thinking' },
  waiting: { bg: 'bg-info/10', dot: 'bg-info', label: 'Waiting' },
  error: { bg: 'bg-destructive/10', dot: 'bg-destructive', label: 'Error' },
  success: { bg: 'bg-success/10', dot: 'bg-success', label: 'Success' },
  paused: { bg: 'bg-muted/50', dot: 'bg-muted-foreground', label: 'Paused' },
}

export function AgentCard({ 
  name,
  description,
  avatar,
  status = 'idle', 
  lastActive,
  selected,
  onSelect,
  actions,
  className, 
  children,
  ...props 
}: AgentCardProps) {
  const config = statusConfig[status]
  
  return (
    <div 
      className={cn(
        'rounded-lg border p-4 transition-all cursor-pointer',
        config.bg,
        selected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50',
        className
      )} 
      onClick={onSelect}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={cn('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface', config.dot)} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', config.bg, 'text-muted-foreground')}>
              {config.label}
            </span>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          )}
          {lastActive && (
            <p className="text-xs text-muted-foreground/60 mt-2">
              Last active: {typeof lastActive === 'string' ? lastActive : lastActive.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          {actions}
        </div>
      )}
      
      {children}
    </div>
  )
}

// ============================================================================
// Agent Avatar
// ============================================================================

export interface AgentAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  status?: AgentStatusType
}

const avatarSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

export function AgentAvatar({ src, alt, size = 'md', status, className, ...props }: AgentAvatarProps) {
  return (
    <div className={cn('relative shrink-0', className)} {...props}>
      <div className={cn('rounded-full bg-muted overflow-hidden', avatarSizes[size])}>
        {src ? (
          <img src={src} alt={alt || ''} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-bold">
            AI
          </div>
        )}
      </div>
      {status && (
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface',
          size === 'sm' ? 'h-2.5 w-2.5' : size === 'lg' ? 'h-4 w-4' : 'h-3 w-3',
          statusConfig[status].dot
        )} />
      )}
    </div>
  )
}

// ============================================================================
// Agent Status - Real-time status display
// ============================================================================

export interface AgentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  status: AgentStatusType
  /** Show animated indicator */
  animated?: boolean
  /** Custom label override */
  label?: string
  /** Show icon */
  showIcon?: boolean
}

export function AgentStatus({ 
  status, 
  animated = true, 
  label, 
  showIcon = true,
  className, 
  ...props 
}: AgentStatusProps) {
  const config = statusConfig[status]
  
  return (
    <div className={cn('inline-flex items-center gap-2 text-sm', className)} {...props}>
      {showIcon && (
        <span className={cn(
          'h-2 w-2 rounded-full',
          config.dot,
          animated && (status === 'running' || status === 'thinking') && 'animate-pulse'
        )} />
      )}
      <span className="text-muted-foreground">{label || config.label}</span>
    </div>
  )
}

// ============================================================================
// Agent Task List - Task state management
// ============================================================================

export interface AgentTask {
  id: string
  title: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt?: Date
  completedAt?: Date
  progress?: number
  error?: string
}

export interface AgentTaskListProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: AgentTask[]
  /** Show completed tasks */
  showCompleted?: boolean
  /** Allow task cancellation */
  onCancelTask?: (taskId: string) => void
  /** Allow task retry */
  onRetryTask?: (taskId: string) => void
  /** Task click handler */
  onTaskClick?: (task: AgentTask) => void
}

export function AgentTaskList({ 
  tasks, 
  showCompleted = true,
  onCancelTask,
  onRetryTask,
  onTaskClick,
  className, 
  ...props 
}: AgentTaskListProps) {
  const visibleTasks = showCompleted 
    ? tasks 
    : tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled')
  
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {visibleTasks.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-4">No tasks</div>
      ) : (
        visibleTasks.map(task => (
          <AgentTaskItem 
            key={task.id} 
            task={task}
            onCancel={onCancelTask ? () => onCancelTask(task.id) : undefined}
            onRetry={onRetryTask ? () => onRetryTask(task.id) : undefined}
            onClick={onTaskClick ? () => onTaskClick(task) : undefined}
          />
        ))
      )}
    </div>
  )
}

export interface AgentTaskItemProps extends React.HTMLAttributes<HTMLDivElement> {
  task: AgentTask
  onCancel?: () => void
  onRetry?: () => void
}

const taskStatusIcons: Record<AgentTask['status'], React.ReactNode> = {
  pending: <Circle className="h-4 w-4" />,
  running: <CircleDot className="h-4 w-4" />,
  completed: <Check className="h-4 w-4" />,
  failed: <X className="h-4 w-4" />,
  cancelled: <Ban className="h-4 w-4" />,
}

const taskStatusColors: Record<AgentTask['status'], string> = {
  pending: 'text-muted-foreground',
  running: 'text-primary',
  completed: 'text-success',
  failed: 'text-destructive',
  cancelled: 'text-muted-foreground/50',
}

export function AgentTaskItem({ task, onCancel, onRetry, className, onClick, ...props }: AgentTaskItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm group',
        task.status === 'completed' && 'bg-muted/30',
        task.status === 'failed' && 'bg-destructive/5',
        onClick && 'cursor-pointer hover:border-primary/50',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <span className={cn('shrink-0', taskStatusColors[task.status], task.status === 'running' && 'animate-spin')}>
        {taskStatusIcons[task.status]}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className={cn('truncate', task.status === 'cancelled' && 'line-through text-muted-foreground/50')}>
          {task.title}
        </div>
        {task.progress !== undefined && task.status === 'running' && (
          <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${task.progress}%` }}
            />
          </div>
        )}
        {task.error && task.status === 'failed' && (
          <div className="text-xs text-destructive mt-1">{task.error}</div>
        )}
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.status === 'running' && onCancel && (
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            className="p-1 text-muted-foreground hover:text-destructive"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {task.status === 'failed' && onRetry && (
          <button
            onClick={(e) => { e.stopPropagation(); onRetry(); }}
            className="p-1 text-muted-foreground hover:text-primary"
            title="Retry"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Agent Memory Viewer - Display memory/context
// ============================================================================

export interface MemoryEntry {
  id: string
  key: string
  value: unknown
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  timestamp?: Date
  source?: string
}

export interface AgentMemoryViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: MemoryEntry[]
  /** Max items to show initially */
  maxItems?: number
  /** Allow editing values */
  editable?: boolean
  onEdit?: (id: string, newValue: unknown) => void
  onDelete?: (id: string) => void
  /** Searchable */
  searchable?: boolean
}

export function AgentMemoryViewer({ 
  entries, 
  maxItems = 10,
  editable = false,
  onEdit,
  onDelete,
  searchable = true,
  className, 
  ...props 
}: AgentMemoryViewerProps) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)
  
  const filtered = search 
    ? entries.filter(e => e.key.toLowerCase().includes(search.toLowerCase()))
    : entries
    
  const visible = expanded ? filtered : filtered.slice(0, maxItems)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Memory ({entries.length})</h3>
        {searchable && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-xs px-2 py-1 rounded border border-border bg-background w-32"
          />
        )}
      </div>
      
      {/* Entries */}
      <div className="divide-y divide-border">
        {visible.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {search ? 'No matching entries' : 'No memory entries'}
          </div>
        ) : (
          visible.map(entry => (
            <div key={entry.id} className="px-4 py-2 group hover:bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-primary">{entry.key}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                  <span className="text-xs text-muted-foreground">{entry.type}</span>
                  {onDelete && (
                    <button onClick={() => onDelete(entry.id)} className="text-destructive hover:text-destructive/80">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono truncate">
                {typeof entry.value === 'object' ? JSON.stringify(entry.value) : String(entry.value)}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Show more */}
      {filtered.length > maxItems && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-xs text-center text-muted-foreground hover:text-foreground border-t border-border"
        >
          {expanded ? 'Show less' : `Show ${filtered.length - maxItems} more`}
        </button>
      )}
    </div>
  )
}

// ============================================================================
// Agent Log Viewer - Streaming logs with filtering
// ============================================================================

export interface LogEntry {
  id: string
  timestamp: Date
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  data?: unknown
}

export interface AgentLogViewerHandle {
  scrollToBottom: () => void
  clear: () => void
}

export interface AgentLogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  logs: LogEntry[]
  /** Max height of log viewer */
  maxHeight?: number | string
  /** Auto-scroll to bottom on new logs */
  autoScroll?: boolean
  /** Show timestamps */
  showTimestamps?: boolean
  /** Filter by log level */
  filterLevel?: LogEntry['level'] | 'all'
  /** Allow clearing logs */
  onClear?: () => void
}

const logLevelColors: Record<LogEntry['level'], string> = {
  debug: 'text-muted-foreground',
  info: 'text-foreground',
  warn: 'text-warning',
  error: 'text-destructive',
}

const logLevelBgs: Record<LogEntry['level'], string> = {
  debug: '',
  info: '',
  warn: 'bg-warning/5',
  error: 'bg-destructive/5',
}

export const AgentLogViewer = forwardRef<AgentLogViewerHandle, AgentLogViewerProps>(({ 
  logs, 
  maxHeight = 400,
  autoScroll = true,
  showTimestamps = true,
  filterLevel = 'all',
  onClear,
  className, 
  ...props 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [levelFilter, setLevelFilter] = useState<LogEntry['level'] | 'all'>(filterLevel)
  
  const filtered = levelFilter === 'all' 
    ? logs 
    : logs.filter(l => l.level === levelFilter)
  
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [])
  
  useImperativeHandle(ref, () => ({
    scrollToBottom,
    clear: () => onClear?.(),
  }), [scrollToBottom, onClear])
  
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom()
    }
  }, [logs, autoScroll, scrollToBottom])
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Logs</span>
          <span className="text-xs text-muted-foreground">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value as LogEntry['level'] | 'all')}
            className="text-xs px-2 py-1 rounded border border-border bg-background"
          >
            <option value="all">All levels</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          {onClear && (
            <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Logs */}
      <div 
        ref={containerRef}
        className="overflow-y-auto font-mono text-xs"
        style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
      >
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-muted-foreground">No logs</div>
        ) : (
          filtered.map(log => (
            <div 
              key={log.id}
              className={cn('px-3 py-1 border-b border-border/50 last:border-0', logLevelBgs[log.level])}
            >
              <div className="flex items-start gap-2">
                {showTimestamps && (
                  <span className="text-muted-foreground/60 shrink-0">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                )}
                <span className={cn('shrink-0 uppercase w-12', logLevelColors[log.level])}>
                  [{log.level}]
                </span>
                <span className={cn('flex-1 break-words', logLevelColors[log.level])}>
                  {log.message}
                </span>
              </div>
              {log.data !== undefined && (
                <pre className="mt-1 ml-[100px] text-muted-foreground overflow-x-auto">
                  {String(JSON.stringify(log.data, null, 2))}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
})

AgentLogViewer.displayName = 'AgentLogViewer'

// ============================================================================
// Agent Chain Graph - Visual chain visualization
// ============================================================================

export interface ChainNode {
  id: string
  label: string
  type: 'agent' | 'tool' | 'llm' | 'memory' | 'output'
  status?: 'pending' | 'running' | 'completed' | 'error'
  data?: unknown
}

export interface ChainEdge {
  from: string
  to: string
  label?: string
}

export interface AgentChainGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: ChainNode[]
  edges: ChainEdge[]
  /** Currently active node */
  activeNode?: string
  /** Click handler for nodes */
  onNodeClick?: (node: ChainNode) => void
  /** Layout direction */
  direction?: 'horizontal' | 'vertical'
}

const nodeTypeStyles: Record<ChainNode['type'], { bg: string; icon: string }> = {
  agent: { bg: 'bg-primary/20 border-primary', icon: 'A' },
  tool: { bg: 'bg-warning/20 border-warning', icon: 'T' },
  llm: { bg: 'bg-info/20 border-info', icon: 'L' },
  memory: { bg: 'bg-success/20 border-success', icon: 'M' },
  output: { bg: 'bg-muted border-muted-foreground', icon: 'O' },
}

export function AgentChainGraph({ 
  nodes, 
  edges,
  activeNode,
  onNodeClick,
  direction = 'horizontal',
  className, 
  ...props 
}: AgentChainGraphProps) {
  return (
    <div 
      className={cn(
        'rounded-lg border border-border bg-surface p-4 overflow-auto',
        className
      )} 
      {...props}
    >
      <div className={cn(
        'flex items-center gap-4',
        direction === 'vertical' && 'flex-col'
      )}>
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {/* Node */}
            <div
              onClick={() => onNodeClick?.(node)}
              className={cn(
                'relative flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm cursor-pointer transition-all',
                nodeTypeStyles[node.type].bg,
                activeNode === node.id && 'ring-2 ring-primary ring-offset-2',
                node.status === 'running' && 'animate-pulse',
                node.status === 'error' && 'border-destructive bg-destructive/10',
                node.status === 'completed' && 'opacity-70'
              )}
            >
              <span>{nodeTypeStyles[node.type].icon}</span>
              <span className="font-medium">{node.label}</span>
              {node.status === 'running' && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping" />
              )}
            </div>
            
            {/* Edge/Arrow */}
            {index < nodes.length - 1 && (
              <div className={cn(
                'text-muted-foreground',
                direction === 'vertical' ? 'rotate-90' : ''
              )}>
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Tool Invocation View - Display tool calls
// ============================================================================

export interface ToolInvocation {
  id: string
  name: string
  input: unknown
  output?: unknown
  status: 'pending' | 'running' | 'success' | 'error'
  duration?: number
  error?: string
}

export interface ToolInvocationViewProps extends React.HTMLAttributes<HTMLDivElement> {
  invocation: ToolInvocation
  /** Expanded by default */
  defaultExpanded?: boolean
}

export function ToolInvocationView({ 
  invocation, 
  defaultExpanded = false,
  className, 
  ...props 
}: ToolInvocationViewProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  
  const statusIcons: Record<ToolInvocation['status'], React.ReactNode> = {
    pending: <Circle className="h-4 w-4" />,
    running: <CircleDot className="h-4 w-4" />,
    success: <Check className="h-4 w-4" />,
    error: <X className="h-4 w-4" />,
  }
  
  const statusColors: Record<ToolInvocation['status'], string> = {
    pending: 'text-muted-foreground',
    running: 'text-primary animate-spin',
    success: 'text-success',
    error: 'text-destructive',
  }
  
  return (
    <div 
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        invocation.status === 'error' && 'border-destructive/50',
        className
      )} 
      {...props}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={statusColors[invocation.status]}>{statusIcons[invocation.status]}</span>
          <span className="font-mono text-sm font-medium">{invocation.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {invocation.duration && (
            <span className="text-xs text-muted-foreground">{invocation.duration}ms</span>
          )}
          <span className="text-muted-foreground">{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
        </div>
      </button>
      
      {/* Details */}
      {expanded && (
        <div className="p-4 space-y-4 text-xs">
          {/* Input */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Input</h4>
            <pre className="bg-muted/30 rounded p-3 overflow-x-auto font-mono">
              {JSON.stringify(invocation.input, null, 2)}
            </pre>
          </div>
          
          {/* Output */}
          {invocation.output !== undefined && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-2">Output</h4>
              <pre className="bg-muted/30 rounded p-3 overflow-x-auto font-mono">
                {JSON.stringify(invocation.output, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Error */}
          {invocation.error && (
            <div>
              <h4 className="text-xs font-semibold text-destructive mb-2">Error</h4>
              <pre className="bg-destructive/10 text-destructive rounded p-3 overflow-x-auto">
                {invocation.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Reasoning Trace View - Display reasoning steps
// ============================================================================

export interface ReasoningStep {
  id: string
  type: 'thought' | 'action' | 'observation' | 'conclusion'
  content: string
  timestamp?: Date
  metadata?: Record<string, unknown>
}

export interface ReasoningTraceViewProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ReasoningStep[]
  /** Compact mode */
  compact?: boolean
  /** Show timestamps */
  showTimestamps?: boolean
}

const stepTypeConfig: Record<ReasoningStep['type'], { icon: string; color: string; bg: string }> = {
  thought: { icon: '?', color: 'text-info', bg: 'bg-info/10' },
  action: { icon: '>', color: 'text-warning', bg: 'bg-warning/10' },
  observation: { icon: '*', color: 'text-success', bg: 'bg-success/10' },
  conclusion: { icon: '!', color: 'text-primary', bg: 'bg-primary/10' },
}

export function ReasoningTraceView({ 
  steps, 
  compact = false,
  showTimestamps = false,
  className, 
  ...props 
}: ReasoningTraceViewProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {steps.map((step, index) => {
        const config = stepTypeConfig[step.type]
        
        return (
          <div 
            key={step.id}
            className={cn(
              'rounded-lg border border-border p-3',
              config.bg,
              compact && 'py-2'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Timeline connector */}
              {!compact && (
                <div className="flex flex-col items-center">
                  <span className="text-lg">{config.icon}</span>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-8 bg-border mt-1" />
                  )}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('text-xs font-semibold uppercase', config.color)}>
                    {step.type}
                  </span>
                  {showTimestamps && step.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {step.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className={cn('text-sm mt-1', compact && 'text-xs')}>
                  {step.content}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Agent Permission Editor - Permission management UI
// ============================================================================

export interface Permission {
  id: string
  name: string
  description?: string
  category?: string
  granted: boolean
  dangerous?: boolean
}

export interface AgentPermissionEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  permissions: Permission[]
  onChange?: (permissions: Permission[]) => void
  /** Group permissions by category */
  grouped?: boolean
  /** Read-only mode */
  readOnly?: boolean
}

export function AgentPermissionEditor({ 
  permissions, 
  onChange,
  grouped = true,
  readOnly = false,
  className, 
  ...props 
}: AgentPermissionEditorProps) {
  const handleToggle = (id: string) => {
    if (readOnly) return
    const updated = permissions.map(p => 
      p.id === id ? { ...p, granted: !p.granted } : p
    )
    onChange?.(updated)
  }
  
  // Group permissions by category
  const groupedPermissions = grouped
    ? permissions.reduce((acc, perm) => {
        const cat = perm.category || 'General'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(perm)
        return acc
      }, {} as Record<string, Permission[]>)
    : { 'All': permissions }
  
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {Object.entries(groupedPermissions).map(([category, perms]) => (
        <div key={category}>
          {grouped && (
            <h3 className="text-sm font-semibold text-foreground mb-3">{category}</h3>
          )}
          <div className="space-y-2">
            {perms.map(permission => (
              <label
                key={permission.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer transition-colors',
                  permission.granted ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/30',
                  permission.dangerous && permission.granted && 'bg-destructive/5 border-destructive/30',
                  readOnly && 'cursor-default'
                )}
              >
                <input
                  type="checkbox"
                  checked={permission.granted}
                  onChange={() => handleToggle(permission.id)}
                  disabled={readOnly}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{permission.name}</span>
                    {permission.dangerous && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                        Dangerous
                      </span>
                    )}
                  </div>
                  {permission.description && (
                    <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Agent Persona Editor - Persona configuration
// ============================================================================

export interface AgentPersona {
  name: string
  description: string
  systemPrompt: string
  personality?: string
  tone?: 'formal' | 'casual' | 'technical' | 'friendly'
  avatar?: string
  tags?: string[]
}

export interface AgentPersonaEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  persona: AgentPersona
  onChange?: (persona: AgentPersona) => void
  /** Read-only mode */
  readOnly?: boolean
}

export function AgentPersonaEditor({ 
  persona, 
  onChange,
  readOnly = false,
  className, 
  ...props 
}: AgentPersonaEditorProps) {
  const handleChange = <K extends keyof AgentPersona>(key: K, value: AgentPersona[K]) => {
    if (readOnly) return
    onChange?.({ ...persona, [key]: value })
  }
  
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Name */}
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={persona.name}
          onChange={e => handleChange('name', e.target.value)}
          disabled={readOnly}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      
      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={persona.description}
          onChange={e => handleChange('description', e.target.value)}
          disabled={readOnly}
          rows={2}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
        />
      </div>
      
      {/* System Prompt */}
      <div>
        <label className="text-sm font-medium">System Prompt</label>
        <textarea
          value={persona.systemPrompt}
          onChange={e => handleChange('systemPrompt', e.target.value)}
          disabled={readOnly}
          rows={5}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono resize-none"
        />
      </div>
      
      {/* Tone */}
      <div>
        <label className="text-sm font-medium">Tone</label>
        <select
          value={persona.tone || 'friendly'}
          onChange={e => handleChange('tone', e.target.value as AgentPersona['tone'])}
          disabled={readOnly}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="technical">Technical</option>
          <option value="friendly">Friendly</option>
        </select>
      </div>
      
      {/* Personality */}
      <div>
        <label className="text-sm font-medium">Personality Traits (optional)</label>
        <input
          type="text"
          value={persona.personality || ''}
          onChange={e => handleChange('personality', e.target.value)}
          disabled={readOnly}
          placeholder="e.g., Helpful, Curious, Detail-oriented"
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
    </div>
  )
}

// ============================================================================
// Agent Template Store - Template browser
// ============================================================================

export interface AgentTemplate {
  id: string
  name: string
  description: string
  category: string
  icon?: string
  author?: string
  downloads?: number
  persona: AgentPersona
}

export interface AgentTemplateStoreProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  templates: AgentTemplate[]
  /** Search query */
  searchQuery?: string
  onSearchChange?: (query: string) => void
  /** Selected template */
  selectedId?: string
  onSelect?: (template: AgentTemplate) => void
  /** Use template */
  onUse?: (template: AgentTemplate) => void
}

export function AgentTemplateStore({ 
  templates, 
  searchQuery = '',
  onSearchChange,
  selectedId,
  onSelect,
  onUse,
  className, 
  ...props 
}: AgentTemplateStoreProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)
  
  const filtered = templates.filter(t => 
    t.name.toLowerCase().includes(localSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(localSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(localSearch.toLowerCase())
  )
  
  // Group by category
  const grouped = filtered.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = []
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, AgentTemplate[]>)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      {/* Search */}
      <div className="p-4 border-b border-border">
        <input
          type="text"
          placeholder="Search templates..."
          value={localSearch}
          onChange={e => {
            setLocalSearch(e.target.value)
            onSearchChange?.(e.target.value)
          }}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      
      {/* Templates */}
      <div className="max-h-[400px] overflow-y-auto">
        {Object.entries(grouped).length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No templates found
          </div>
        ) : (
          Object.entries(grouped).map(([category, categoryTemplates]) => (
            <div key={category}>
              <div className="px-4 py-2 bg-muted/30 text-xs font-semibold text-muted-foreground sticky top-0">
                {category}
              </div>
              {categoryTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => onSelect?.(template)}
                  className={cn(
                    'px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors',
                    selectedId === template.id && 'bg-primary/5'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl font-bold">{template.icon || 'T'}</span>
                      <div>
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {template.description}
                        </p>
                        {template.author && (
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            by {template.author} • {template.downloads?.toLocaleString() || 0} uses
                          </p>
                        )}
                      </div>
                    </div>
                    {onUse && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          onUse(template)
                        }}
                        className="shrink-0 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
                      >
                        Use
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Agent Testing Console - Test interface
// ============================================================================

export interface TestMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface AgentTestingConsoleProps extends React.HTMLAttributes<HTMLDivElement> {
  messages?: TestMessage[]
  /** Is agent currently processing */
  isProcessing?: boolean
  /** Send message handler */
  onSend?: (message: string) => void
  /** Clear conversation */
  onClear?: () => void
  /** Export conversation */
  onExport?: () => void
}

export function AgentTestingConsole({ 
  messages = [],
  isProcessing = false,
  onSend,
  onClear,
  onExport,
  className, 
  ...props 
}: AgentTestingConsoleProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const handleSend = () => {
    if (!input.trim() || isProcessing) return
    onSend?.(input.trim())
    setInput('')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  return (
    <div className={cn('flex flex-col rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="text-sm font-semibold">Testing Console</h3>
        <div className="flex items-center gap-2">
          {onClear && (
            <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
          {onExport && (
            <button onClick={onExport} className="text-xs text-muted-foreground hover:text-foreground">
              Export
            </button>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Start testing by sending a message
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id}
              className={cn(
                'flex gap-3',
                msg.role === 'user' && 'justify-end'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
              )}
              <div className={cn(
                'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                msg.role === 'user' && 'bg-primary text-primary-foreground',
                msg.role === 'assistant' && 'bg-muted',
                msg.role === 'system' && 'bg-warning/10 text-warning-foreground border border-warning/30 text-xs'
              )}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold">
                  U
                </div>
              )}
            </div>
          ))
        )}
        {isProcessing && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-xs font-bold">
              AI
            </div>
            <div className="bg-muted rounded-lg px-4 py-2">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isProcessing}
            rows={2}
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
