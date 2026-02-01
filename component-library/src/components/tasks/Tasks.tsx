import React, { useState, useEffect, useMemo } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { cn } from '../../utils/cn'

// ============================================================================
// Types
// ============================================================================

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: Date
  tags?: string[]
  subtasks?: SubTask[]
  createdAt: Date
  updatedAt: Date
  timeSpent?: number // in minutes
  estimatedTime?: number // in minutes
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface TaskColumn {
  id: TaskStatus
  title: string
  color?: string
}

// ============================================================================
// TaskBoard - Kanban board with drag-drop
// ============================================================================

export interface TaskBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: Task[]
  columns?: TaskColumn[]
  onTaskMove?: (taskId: string, newStatus: TaskStatus) => void
  onTaskClick?: (task: Task) => void
  onTaskCreate?: (status: TaskStatus) => void
  /** Allow drag and drop */
  draggable?: boolean
}

const defaultColumns: TaskColumn[] = [
  { id: 'todo', title: 'To Do', color: 'border-muted-foreground' },
  { id: 'in-progress', title: 'In Progress', color: 'border-primary' },
  { id: 'review', title: 'Review', color: 'border-warning' },
  { id: 'done', title: 'Done', color: 'border-success' },
]

export function TaskBoard({ 
  tasks, 
  columns = defaultColumns,
  onTaskMove,
  onTaskClick,
  onTaskCreate,
  draggable = true,
  className, 
  ...props 
}: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)
  
  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return columns.reduce((acc, col) => {
      acc[col.id] = tasks.filter(t => t.status === col.id)
      return acc
    }, {} as Record<TaskStatus, Task[]>)
  }, [tasks, columns])
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!draggable) return
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }
  
  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    if (draggedTaskId) {
      setDragOverColumn(status)
    }
  }
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault()
    if (draggedTaskId) {
      onTaskMove?.(draggedTaskId, status)
      setDraggedTaskId(null)
      setDragOverColumn(null)
    }
  }
  
  return (
    <div 
      className={cn('flex gap-4 overflow-x-auto pb-4', className)} 
      {...props}
    >
      {columns.map(column => (
        <TaskColumn
          key={column.id}
          title={column.title}
          color={column.color}
          tasks={tasksByStatus[column.id] || []}
          isDragOver={dragOverColumn === column.id}
          draggedTaskId={draggedTaskId}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
          onDragLeave={() => setDragOverColumn(null)}
          onTaskDragStart={handleDragStart}
          onTaskDragEnd={handleDragEnd}
          onTaskClick={onTaskClick}
          onAddTask={onTaskCreate ? () => onTaskCreate(column.id) : undefined}
          draggable={draggable}
        />
      ))}
    </div>
  )
}

// ============================================================================
// TaskColumn - Droppable column
// ============================================================================

export interface TaskColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  color?: string
  tasks: Task[]
  isDragOver?: boolean
  draggedTaskId?: string | null
  onTaskDragStart?: (e: React.DragEvent, taskId: string) => void
  onTaskDragEnd?: () => void
  onTaskClick?: (task: Task) => void
  onAddTask?: () => void
  draggable?: boolean
}

export function TaskColumn({ 
  title, 
  color = 'border-muted',
  tasks,
  isDragOver,
  draggedTaskId,
  onTaskDragStart,
  onTaskDragEnd,
  onTaskClick,
  onAddTask,
  draggable = true,
  className, 
  children, 
  onDragOver,
  onDrop,
  onDragLeave,
  ...props 
}: TaskColumnProps) {
  return (
    <div 
      className={cn(
        'flex flex-col rounded-lg border-t-4 bg-muted/20 min-w-[280px] max-w-[320px]',
        color,
        isDragOver && 'ring-2 ring-primary bg-primary/5',
        className
      )} 
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{title}</span>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted">
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="text-muted-foreground hover:text-foreground text-lg leading-none"
            title="Add task"
          >
            +
          </button>
        )}
      </div>
      
      {/* Tasks */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[500px]">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            draggable={draggable}
            isDragging={draggedTaskId === task.id}
            onDragStart={(e) => onTaskDragStart?.(e, task.id)}
            onDragEnd={onTaskDragEnd}
            onClick={() => onTaskClick?.(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// TaskCard - Draggable task card
// ============================================================================

export interface TaskCardProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task
  isDragging?: boolean
  compact?: boolean
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/20 text-info',
  high: 'bg-warning/20 text-warning',
  urgent: 'bg-destructive/20 text-destructive',
}

export function TaskCard({ 
  task, 
  isDragging,
  compact = false,
  className, 
  ...props 
}: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0
  
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background p-3 cursor-pointer transition-all',
        'hover:border-primary/50 hover:shadow-sm',
        isDragging && 'opacity-50 rotate-2 scale-105',
        task.status === 'done' && 'opacity-60',
        className
      )}
      {...props}
    >
      {/* Tags */}
      {task.tags && task.tags.length > 0 && !compact && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Title */}
      <h4 className={cn(
        'font-medium text-sm',
        task.status === 'done' && 'line-through text-muted-foreground'
      )}>
        {task.title}
      </h4>
      
      {/* Description preview */}
      {task.description && !compact && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-3 gap-2">
        <div className="flex items-center gap-2">
          {/* Priority */}
          <span className={cn('text-xs px-1.5 py-0.5 rounded-full', priorityColors[task.priority])}>
            {task.priority}
          </span>
          
          {/* Subtasks progress */}
          {totalSubtasks > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="h-3 w-3" /> {completedSubtasks}/{totalSubtasks}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Due date */}
          {task.dueDate && (
            <span className={cn(
              'text-xs',
              new Date(task.dueDate) < new Date() && task.status !== 'done' 
                ? 'text-destructive' 
                : 'text-muted-foreground'
            )}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          
          {/* Assignee */}
          {task.assignee && (
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
              {task.assignee.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TaskDetail - Full task view/edit
// ============================================================================

export interface TaskDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  task: Task
  onUpdate?: (updates: Partial<Task>) => void
  onDelete?: () => void
  onClose?: () => void
  editable?: boolean
}

export function TaskDetail({ 
  task, 
  onUpdate,
  onDelete,
  onClose,
  editable = true,
  className, 
  ...props 
}: TaskDetailProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border">
        <div className="flex-1">
          {editable ? (
            <input
              type="text"
              value={task.title}
              onChange={e => onUpdate?.({ title: e.target.value })}
              className="text-lg font-semibold bg-transparent border-none outline-none w-full"
            />
          ) : (
            <h2 className="text-lg font-semibold">{task.title}</h2>
          )}
          <div className="flex items-center gap-2 mt-2">
            <TaskPriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button onClick={onDelete} className="text-destructive hover:text-destructive/80 text-sm">
              Delete
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          {editable ? (
            <textarea
              value={task.description || ''}
              onChange={e => onUpdate?.({ description: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
              placeholder="Add a description..."
            />
          ) : (
            <p className="mt-1 text-sm">{task.description || 'No description'}</p>
          )}
        </div>
        
        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            {editable ? (
              <TaskStatusSelector
                value={task.status}
                onChange={status => onUpdate?.({ status })}
                className="mt-1 w-full"
              />
            ) : (
              <p className="mt-1 text-sm capitalize">{task.status.replace('-', ' ')}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Priority</label>
            {editable ? (
              <select
                value={task.priority}
                onChange={e => onUpdate?.({ priority: e.target.value as TaskPriority })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            ) : (
              <p className="mt-1 text-sm capitalize">{task.priority}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Due Date</label>
            {editable ? (
              <input
                type="date"
                value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                onChange={e => onUpdate?.({ dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            ) : (
              <p className="mt-1 text-sm">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Assignee</label>
            {editable ? (
              <input
                type="text"
                value={task.assignee || ''}
                onChange={e => onUpdate?.({ assignee: e.target.value || undefined })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Assign to..."
              />
            ) : (
              <p className="mt-1 text-sm">{task.assignee || 'Unassigned'}</p>
            )}
          </div>
        </div>
        
        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Subtasks</label>
            <SubtaskList
              subtasks={task.subtasks}
              onChange={subtasks => onUpdate?.({ subtasks })}
              editable={editable}
              className="mt-2"
            />
          </div>
        )}
        
        {/* Time tracking */}
        {(task.timeSpent !== undefined || task.estimatedTime !== undefined) && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Time</label>
            <div className="flex items-center gap-4 mt-2 text-sm">
              {task.timeSpent !== undefined && (
                <span>Spent: {formatTime(task.timeSpent)}</span>
              )}
              {task.estimatedTime !== undefined && (
                <span className="text-muted-foreground">Estimated: {formatTime(task.estimatedTime)}</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
        Created {task.createdAt.toLocaleString()} • Updated {task.updatedAt.toLocaleString()}
      </div>
    </div>
  )
}

// Helper to format time in minutes
function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

// ============================================================================
// TaskEditor - Create/edit task form
// ============================================================================

export interface TaskEditorProps extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  initialTask?: Partial<Task>
  onSubmit?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel?: () => void
}

export function TaskEditor({ 
  initialTask, 
  onSubmit,
  onCancel,
  className, 
  ...props 
}: TaskEditorProps) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || 'todo')
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '')
  const [assignee, setAssignee] = useState(initialTask?.assignee || '')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    
    onSubmit?.({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignee: assignee.trim() || undefined,
      tags: [],
      subtasks: [],
    })
  }
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={cn('rounded-lg border border-border bg-surface p-4 space-y-4', className)} 
      {...props}
    >
      <div>
        <label className="text-sm font-medium">Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          placeholder="Task title"
          required
          autoFocus
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm resize-none"
          placeholder="Add details..."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Status</label>
          <TaskStatusSelector value={status} onChange={setStatus} className="mt-1 w-full" />
        </div>
        <div>
          <label className="text-sm font-medium">Priority</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as TaskPriority)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Assignee</label>
          <input
            type="text"
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Assign to..."
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {initialTask?.title ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}

// ============================================================================
// TaskPriorityBadge
// ============================================================================

export interface TaskPriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  priority: TaskPriority
  size?: 'sm' | 'md'
}

const priorityIcons: Record<TaskPriority, string> = {
  low: '!',
  medium: '!!',
  high: '!!!',
  urgent: '!!!!',
}

export function TaskPriorityBadge({ priority, size = 'sm', className, ...props }: TaskPriorityBadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        priorityColors[priority],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )} 
      {...props}
    >
      <span>{priorityIcons[priority]}</span>
      <span className="capitalize">{priority}</span>
    </span>
  )
}

// ============================================================================
// TaskStatusBadge
// ============================================================================

export interface TaskStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: TaskStatus
}

const statusColors: Record<TaskStatus, string> = {
  'todo': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/20 text-primary',
  'review': 'bg-warning/20 text-warning',
  'done': 'bg-success/20 text-success',
}

const statusLabels: Record<TaskStatus, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'review': 'Review',
  'done': 'Done',
}

export function TaskStatusBadge({ status, className, ...props }: TaskStatusBadgeProps) {
  return (
    <span 
      className={cn('px-2 py-0.5 text-xs rounded-full', statusColors[status], className)} 
      {...props}
    >
      {statusLabels[status]}
    </span>
  )
}

// ============================================================================
// TaskStatusSelector
// ============================================================================

export interface TaskStatusSelectorProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  value: TaskStatus
  onChange?: (status: TaskStatus) => void
}

export function TaskStatusSelector({ value, onChange, className, ...props }: TaskStatusSelectorProps) {
  return (
    <select
      value={value}
      onChange={e => onChange?.(e.target.value as TaskStatus)}
      className={cn('rounded-md border border-border bg-background px-3 py-2 text-sm', className)}
      {...props}
    >
      <option value="todo">To Do</option>
      <option value="in-progress">In Progress</option>
      <option value="review">Review</option>
      <option value="done">Done</option>
    </select>
  )
}

// ============================================================================
// TaskTimeline - Gantt-style timeline
// ============================================================================

export interface TaskTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: Task[]
  /** Start date for timeline view */
  startDate?: Date
  /** End date for timeline view */
  endDate?: Date
  /** Days to show */
  days?: number
  onTaskClick?: (task: Task) => void
}

export function TaskTimeline({ 
  tasks, 
  startDate = new Date(),
  days = 14,
  onTaskClick,
  className, 
  ...props 
}: TaskTimelineProps) {
  const dates = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(startDate)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [startDate, days])
  
  const getTaskPosition = (task: Task) => {
    if (!task.dueDate) return null
    const dueDate = new Date(task.dueDate)
    const startTime = startDate.getTime()
    const endTime = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000).getTime()
    
    if (dueDate.getTime() < startTime || dueDate.getTime() > endTime) return null
    
    const dayIndex = Math.floor((dueDate.getTime() - startTime) / (24 * 60 * 60 * 1000))
    return dayIndex
  }
  
  const tasksWithDates = tasks.filter(t => t.dueDate && getTaskPosition(t) !== null)
  
  return (
    <div className={cn('overflow-x-auto', className)} {...props}>
      <div className="min-w-max">
        {/* Header with dates */}
        <div className="flex border-b border-border">
          <div className="w-48 shrink-0 px-3 py-2 text-sm font-medium border-r border-border">
            Task
          </div>
          {dates.map((date, i) => (
            <div 
              key={i}
              className={cn(
                'w-16 shrink-0 px-1 py-2 text-center text-xs border-r border-border/50',
                date.getDay() === 0 || date.getDay() === 6 ? 'bg-muted/30' : ''
              )}
            >
              <div className="font-medium">{date.getDate()}</div>
              <div className="text-muted-foreground">{date.toLocaleDateString('default', { weekday: 'short' })}</div>
            </div>
          ))}
        </div>
        
        {/* Tasks */}
        {tasksWithDates.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No tasks with due dates in this range
          </div>
        ) : (
          tasksWithDates.map(task => {
            const dayIndex = getTaskPosition(task)
            
            return (
              <div key={task.id} className="flex border-b border-border/50 hover:bg-muted/20">
                <div 
                  className="w-48 shrink-0 px-3 py-2 text-sm truncate border-r border-border cursor-pointer"
                  onClick={() => onTaskClick?.(task)}
                >
                  {task.title}
                </div>
                <div className="flex-1 relative h-10">
                  {dayIndex !== null && (
                    <div
                      className={cn(
                        'absolute top-1/2 -translate-y-1/2 h-6 rounded-full flex items-center justify-center text-xs px-2',
                        priorityColors[task.priority]
                      )}
                      style={{
                        left: `${dayIndex * 64 + 4}px`,
                        minWidth: '56px',
                      }}
                    >
                      {priorityIcons[task.priority]}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ============================================================================
// TaskCalendar - Calendar view of tasks
// ============================================================================

export interface TaskCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: Task[]
  month?: Date
  onMonthChange?: (date: Date) => void
  onTaskClick?: (task: Task) => void
  onDateClick?: (date: Date) => void
}

export function TaskCalendar({ 
  tasks, 
  month: controlledMonth,
  onMonthChange,
  onTaskClick,
  onDateClick,
  className, 
  ...props 
}: TaskCalendarProps) {
  const [internalMonth, setInternalMonth] = useState(controlledMonth || new Date())
  const month = controlledMonth || internalMonth
  
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()
  
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach(task => {
      if (task.dueDate) {
        const key = new Date(task.dueDate).toDateString()
        if (!map[key]) map[key] = []
        map[key].push(task)
      }
    })
    return map
  }, [tasks])
  
  const cells = useMemo(() => {
    const result: Array<{ date: Date; isCurrentMonth: boolean }> = []
    
    // Previous month padding
    for (let i = 0; i < startDay; i++) {
      const d = new Date(month.getFullYear(), month.getMonth(), -startDay + i + 1)
      result.push({ date: d, isCurrentMonth: false })
    }
    
    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ 
        date: new Date(month.getFullYear(), month.getMonth(), day), 
        isCurrentMonth: true 
      })
    }
    
    // Next month padding
    const remaining = 42 - result.length
    for (let i = 1; i <= remaining; i++) {
      result.push({ 
        date: new Date(month.getFullYear(), month.getMonth() + 1, i), 
        isCurrentMonth: false 
      })
    }
    
    return result
  }, [month, startDay, daysInMonth])
  
  const goToPrevMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }
  
  const goToNextMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }
  
  const today = new Date()
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={goToPrevMonth} className="p-1 hover:bg-muted rounded">←</button>
        <span className="font-semibold">
          {month.toLocaleString('default', { month: 'long' })} {month.getFullYear()}
        </span>
        <button onClick={goToNextMonth} className="p-1 hover:bg-muted rounded">→</button>
      </div>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground py-2 border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map(({ date, isCurrentMonth }, i) => {
          const dateKey = date.toDateString()
          const dayTasks = tasksByDate[dateKey] || []
          const isToday = date.toDateString() === today.toDateString()
          
          return (
            <div
              key={i}
              onClick={() => onDateClick?.(date)}
              className={cn(
                'min-h-[80px] border-b border-r border-border/50 p-1 cursor-pointer hover:bg-muted/30',
                !isCurrentMonth && 'bg-muted/10 text-muted-foreground/50'
              )}
            >
              <div className={cn(
                'text-xs mb-1',
                isToday && 'w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center'
              )}>
                {date.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    onClick={e => {
                      e.stopPropagation()
                      onTaskClick?.(task)
                    }}
                    className={cn(
                      'text-xs px-1 py-0.5 rounded truncate',
                      priorityColors[task.priority]
                    )}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// TaskDependencyGraph - Simple dependency visualization
// ============================================================================

export interface TaskDependency {
  id: string
  from: string
  to: string
}

export interface TaskDependencyGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: Task[]
  dependencies: TaskDependency[]
  onTaskClick?: (task: Task) => void
}

export function TaskDependencyGraph({ 
  tasks, 
  dependencies,
  onTaskClick,
  className, 
  ...props 
}: TaskDependencyGraphProps) {
  // Simple list view for now - could be enhanced with actual graph visualization
  const taskMap = new Map(tasks.map(t => [t.id, t]))
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <h3 className="text-sm font-semibold mb-4">Dependencies</h3>
      {dependencies.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-4">
          No dependencies defined
        </div>
      ) : (
        <div className="space-y-2">
          {dependencies.map(dep => {
            const fromTask = taskMap.get(dep.from)
            const toTask = taskMap.get(dep.to)
            
            return (
              <div key={dep.id} className="flex items-center gap-3 text-sm">
                <span
                  className="flex-1 truncate cursor-pointer hover:text-primary"
                  onClick={() => fromTask && onTaskClick?.(fromTask)}
                >
                  {fromTask?.title || dep.from}
                </span>
                <span className="text-muted-foreground">→</span>
                <span
                  className="flex-1 truncate cursor-pointer hover:text-primary"
                  onClick={() => toTask && onTaskClick?.(toTask)}
                >
                  {toTask?.title || dep.to}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// TaskFilter - Filter controls
// ============================================================================

export interface TaskFilterValue {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assignee?: string
  search?: string
  hasDueDate?: boolean
}

export interface TaskFilterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: TaskFilterValue
  onChange?: (value: TaskFilterValue) => void
  /** Available assignees */
  assignees?: string[]
  /** Show search input */
  showSearch?: boolean
}

export function TaskFilter({ 
  value, 
  onChange,
  assignees = [],
  showSearch = true,
  className, 
  ...props 
}: TaskFilterProps) {
  const toggleStatus = (status: TaskStatus) => {
    const current = value.status || []
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status]
    onChange?.({ ...value, status: updated.length > 0 ? updated : undefined })
  }
  
  const togglePriority = (priority: TaskPriority) => {
    const current = value.priority || []
    const updated = current.includes(priority)
      ? current.filter(p => p !== priority)
      : [...current, priority]
    onChange?.({ ...value, priority: updated.length > 0 ? updated : undefined })
  }
  
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
      {showSearch && (
        <TaskSearch
          value={value.search || ''}
          onChange={e => onChange?.({ ...value, search: e.target.value || undefined })}
          placeholder="Search tasks..."
          className="w-48"
        />
      )}
      
      {/* Status filter */}
      <div className="flex items-center gap-1">
        {(['todo', 'in-progress', 'review', 'done'] as TaskStatus[]).map(status => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            className={cn(
              'px-2 py-1 rounded text-xs transition-colors',
              value.status?.includes(status)
                ? statusColors[status]
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>
      
      {/* Priority filter */}
      <div className="flex items-center gap-1">
        {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map(priority => (
          <button
            key={priority}
            onClick={() => togglePriority(priority)}
            className={cn(
              'px-2 py-1 rounded text-xs transition-colors',
              value.priority?.includes(priority)
                ? priorityColors[priority]
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
          >
            {priorityIcons[priority]}
          </button>
        ))}
      </div>
      
      {/* Assignee filter */}
      {assignees.length > 0 && (
        <select
          value={value.assignee || ''}
          onChange={e => onChange?.({ ...value, assignee: e.target.value || undefined })}
          className="rounded-md border border-border bg-background px-2 py-1 text-xs"
        >
          <option value="">All assignees</option>
          {assignees.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      )}
    </div>
  )
}

// ============================================================================
// TaskSearch
// ============================================================================

export interface TaskSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function TaskSearch({ className, ...props }: TaskSearchProps) {
  return (
    <input 
      type="text"
      className={cn(
        'rounded-md border border-border bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30',
        className
      )} 
      {...props} 
    />
  )
}

// ============================================================================
// RecurringTaskPicker - RRULE builder
// ============================================================================

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[] // 0-6 (Sun-Sat)
  dayOfMonth?: number
  endDate?: Date
  occurrences?: number
}

export interface RecurringTaskPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: RecurringPattern
  onChange?: (pattern: RecurringPattern | undefined) => void
}

export function RecurringTaskPicker({ 
  value, 
  onChange,
  className, 
  ...props 
}: RecurringTaskPickerProps) {
  const [enabled, setEnabled] = useState(!!value)
  const [pattern, setPattern] = useState<RecurringPattern>(value || {
    frequency: 'daily',
    interval: 1,
  })
  
  const handleToggle = () => {
    setEnabled(!enabled)
    onChange?.(enabled ? undefined : pattern)
  }
  
  const handleChange = <K extends keyof RecurringPattern>(key: K, val: RecurringPattern[K]) => {
    const updated = { ...pattern, [key]: val }
    setPattern(updated)
    if (enabled) onChange?.(updated)
  }
  
  const toggleDayOfWeek = (day: number) => {
    const current = pattern.daysOfWeek || []
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort()
    handleChange('daysOfWeek', updated.length > 0 ? updated : undefined)
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4 space-y-4', className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Repeat</span>
        <button
          onClick={handleToggle}
          className={cn(
            'w-10 h-5 rounded-full transition-colors',
            enabled ? 'bg-primary' : 'bg-muted'
          )}
        >
          <div className={cn(
            'w-4 h-4 rounded-full bg-white shadow transition-transform',
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          )} />
        </button>
      </div>
      
      {enabled && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm">Every</span>
            <input
              type="number"
              min={1}
              max={99}
              value={pattern.interval}
              onChange={e => handleChange('interval', parseInt(e.target.value) || 1)}
              className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm text-center"
            />
            <select
              value={pattern.frequency}
              onChange={e => handleChange('frequency', e.target.value as RecurringPattern['frequency'])}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              <option value="daily">day(s)</option>
              <option value="weekly">week(s)</option>
              <option value="monthly">month(s)</option>
              <option value="yearly">year(s)</option>
            </select>
          </div>
          
          {pattern.frequency === 'weekly' && (
            <div className="flex items-center gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) => (
                <button
                  key={i}
                  onClick={() => toggleDayOfWeek(i)}
                  className={cn(
                    'w-8 h-8 rounded-full text-xs font-medium transition-colors',
                    pattern.daysOfWeek?.includes(i)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          
          {pattern.frequency === 'monthly' && (
            <div className="flex items-center gap-2">
              <span className="text-sm">On day</span>
              <input
                type="number"
                min={1}
                max={31}
                value={pattern.dayOfMonth || 1}
                onChange={e => handleChange('dayOfMonth', parseInt(e.target.value) || 1)}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm text-center"
              />
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">End after</span>
              <input
                type="number"
                min={1}
                value={pattern.occurrences || ''}
                onChange={e => handleChange('occurrences', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="∞"
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm text-center"
              />
              <span className="text-sm text-muted-foreground">times</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================================
// TaskStats - Statistics display
// ============================================================================

export interface TaskStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  tasks: Task[]
}

export function TaskStats({ tasks, className, ...props }: TaskStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const overdue = tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length
    const highPriority = tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length
    
    const byStatus = {
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: completed,
    }
    
    return { total, completed, overdue, highPriority, byStatus }
  }, [tasks])
  
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)} {...props}>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm text-muted-foreground">Total Tasks</div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="text-2xl font-bold text-success">{stats.completed}</div>
        <div className="text-sm text-muted-foreground">Completed</div>
        <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full bg-success" 
            style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className={cn('text-2xl font-bold', stats.overdue > 0 && 'text-destructive')}>
          {stats.overdue}
        </div>
        <div className="text-sm text-muted-foreground">Overdue</div>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className={cn('text-2xl font-bold', stats.highPriority > 0 && 'text-warning')}>
          {stats.highPriority}
        </div>
        <div className="text-sm text-muted-foreground">High Priority</div>
      </div>
    </div>
  )
}

// ============================================================================
// BurndownChart - Simple burndown visualization
// ============================================================================

export interface BurndownDataPoint {
  date: Date
  remaining: number
  ideal: number
}

export interface BurndownChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BurndownDataPoint[]
  title?: string
}

export function BurndownChart({ data, title = 'Burndown', className, ...props }: BurndownChartProps) {
  if (data.length === 0) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
        <h3 className="text-sm font-semibold mb-4">{title}</h3>
        <div className="text-center text-sm text-muted-foreground py-8">
          No data available
        </div>
      </div>
    )
  }
  
  const maxValue = Math.max(...data.map(d => Math.max(d.remaining, d.ideal)))
  const height = 200
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      
      <div className="relative" style={{ height }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(pct => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-border/30"
            style={{ bottom: `${pct}%` }}
          >
            <span className="absolute -left-8 -translate-y-1/2 text-xs text-muted-foreground">
              {Math.round(maxValue * (pct / 100))}
            </span>
          </div>
        ))}
        
        {/* Ideal line */}
        <svg className="absolute inset-0" preserveAspectRatio="none">
          <polyline
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}%,${100 - (d.ideal / maxValue) * 100}%`
            ).join(' ')}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
        
        {/* Actual line */}
        <svg className="absolute inset-0" preserveAspectRatio="none">
          <polyline
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * 100}%,${100 - (d.remaining / maxValue) * 100}%`
            ).join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
        
        {/* Data points */}
        {data.map((d, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary -translate-x-1 translate-y-1"
            style={{
              left: `${(i / (data.length - 1)) * 100}%`,
              bottom: `${(d.remaining / maxValue) * 100}%`,
            }}
            title={`${d.date.toLocaleDateString()}: ${d.remaining} remaining`}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-muted-foreground border-dashed" style={{ borderTopWidth: 1 }} />
          <span>Ideal</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// TimeTracking - Time logger
// ============================================================================

export interface TimeEntry {
  id: string
  taskId: string
  startTime: Date
  endTime?: Date
  description?: string
}

export interface TimeTrackingProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: TimeEntry[]
  /** Currently running entry */
  activeEntry?: TimeEntry
  onStart?: (taskId: string, description?: string) => void
  onStop?: (entryId: string) => void
  onDelete?: (entryId: string) => void
  /** Get task title */
  getTaskTitle?: (taskId: string) => string
}

export function TimeTracking({ 
  entries, 
  activeEntry,
  onStart,
  onStop,
  onDelete,
  getTaskTitle,
  className, 
  ...props 
}: TimeTrackingProps) {
  const [elapsed, setElapsed] = useState(0)
  
  // Update elapsed time for active entry
  useEffect(() => {
    if (!activeEntry) {
      setElapsed(0)
      return
    }
    
    const update = () => {
      setElapsed(Date.now() - activeEntry.startTime.getTime())
    }
    
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [activeEntry])
  
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m ${seconds % 60}s`
  }
  
  const totalTime = entries.reduce((sum, entry) => {
    if (!entry.endTime) return sum
    return sum + (entry.endTime.getTime() - entry.startTime.getTime())
  }, 0)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Active timer */}
      {activeEntry && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-border">
          <div>
            <div className="text-sm font-medium">
              {getTaskTitle?.(activeEntry.taskId) || 'Task'}
            </div>
            <div className="text-2xl font-mono font-bold text-primary">
              {formatDuration(elapsed)}
            </div>
          </div>
          <button
            onClick={() => onStop?.(activeEntry.id)}
            className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90"
          >
            Stop
          </button>
        </div>
      )}
      
      {/* Summary */}
      <div className="px-4 py-3 border-b border-border">
        <div className="text-sm text-muted-foreground">Total time logged</div>
        <div className="text-xl font-semibold">{formatDuration(totalTime)}</div>
      </div>
      
      {/* Entries */}
      <div className="max-h-[300px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No time entries
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between px-4 py-2 border-b border-border/50 group">
              <div>
                <div className="text-sm font-medium">
                  {getTaskTitle?.(entry.taskId) || entry.taskId}
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.startTime.toLocaleTimeString()} - {entry.endTime?.toLocaleTimeString() || 'Running'}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono">
                  {entry.endTime 
                    ? formatDuration(entry.endTime.getTime() - entry.startTime.getTime())
                    : '—'
                  }
                </span>
                {onDelete && entry.endTime && (
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================================
// SubtaskList - Nested subtasks
// ============================================================================

export interface SubtaskListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  subtasks: SubTask[]
  onChange?: (subtasks: SubTask[]) => void
  editable?: boolean
  onAddSubtask?: () => void
}

export function SubtaskList({ 
  subtasks, 
  onChange,
  editable = true,
  onAddSubtask,
  className, 
  ...props 
}: SubtaskListProps) {
  const toggleSubtask = (id: string) => {
    if (!editable) return
    const updated = subtasks.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    )
    onChange?.(updated)
  }
  
  const removeSubtask = (id: string) => {
    if (!editable) return
    onChange?.(subtasks.filter(s => s.id !== id))
  }
  
  const completed = subtasks.filter(s => s.completed).length
  
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {/* Progress */}
      {subtasks.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-success transition-all" 
              style={{ width: `${(completed / subtasks.length) * 100}%` }}
            />
          </div>
          <span>{completed}/{subtasks.length}</span>
        </div>
      )}
      
      {/* Subtasks */}
      {subtasks.map(subtask => (
        <div key={subtask.id} className="flex items-center gap-2 group">
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={() => toggleSubtask(subtask.id)}
            disabled={!editable}
            className="shrink-0"
          />
          <span className={cn(
            'flex-1 text-sm',
            subtask.completed && 'line-through text-muted-foreground'
          )}>
            {subtask.title}
          </span>
          {editable && (
            <button
              onClick={() => removeSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      
      {/* Add subtask */}
      {editable && onAddSubtask && (
        <button
          onClick={onAddSubtask}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <Plus className="h-3 w-3" /> Add subtask
        </button>
      )}
    </div>
  )
}
