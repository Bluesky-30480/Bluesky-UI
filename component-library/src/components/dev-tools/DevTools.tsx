import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Bug, ChevronRight, ChevronDown, Search, Info, AlertTriangle, AlertCircle, Clipboard, Check, FolderOpen, Folder, File, Lock, GripVertical, X, Download } from 'lucide-react'
import { cn } from '../../utils/cn'

// ============================================================================
// Types
// ============================================================================

export interface Setting {
  id: string
  key: string
  label: string
  description?: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color'
  value: unknown
  defaultValue?: unknown
  options?: { value: unknown; label: string }[]
  group?: string
}

export interface Keybinding {
  id: string
  command: string
  label: string
  keys: string[]
  when?: string
}

export interface LogEntry {
  id: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: Date
  source?: string
  data?: unknown
}

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  children?: FileNode[]
  icon?: string
}

// ============================================================================
// Settings Components
// ============================================================================

export interface SettingsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  settings?: Setting[]
  onSettingChange?: (setting: Setting, value: unknown) => void
  onReset?: () => void
  searchable?: boolean
}

export function SettingsPanel({ 
  settings = [],
  onSettingChange,
  onReset,
  searchable = true,
  className, 
  ...props 
}: SettingsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const groups = useMemo(() => {
    const filteredSettings = settings.filter(s => 
      !searchQuery || 
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.key.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const grouped: Record<string, Setting[]> = {}
    filteredSettings.forEach(s => {
      const group = s.group || 'General'
      if (!grouped[group]) grouped[group] = []
      grouped[group].push(s)
    })
    return grouped
  }, [settings, searchQuery])
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold">Settings</h2>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset all
          </button>
        )}
      </div>
      
      {/* Search */}
      {searchable && (
        <div className="px-4 py-3 border-b border-border">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      )}
      
      {/* Settings groups */}
      <div className="max-h-[500px] overflow-y-auto">
        {Object.entries(groups).map(([group, groupSettings]) => (
          <SettingsGroup key={group} title={group}>
            {groupSettings.map(setting => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onChange={value => onSettingChange?.(setting, value)}
              />
            ))}
          </SettingsGroup>
        ))}
        
        {Object.keys(groups).length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No settings found
          </div>
        )}
      </div>
    </div>
  )
}

export interface SettingsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function SettingsGroup({ 
  title,
  collapsible = false,
  defaultCollapsed = false,
  children,
  className, 
  ...props 
}: SettingsGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  
  return (
    <div className={cn('border-b border-border last:border-b-0', className)} {...props}>
      {title && (
        <div 
          className={cn(
            'px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30',
            collapsible && 'cursor-pointer hover:bg-muted/50 flex items-center justify-between'
          )}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          <span>{title}</span>
          {collapsible && (
            <span className="text-xs">{isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}</span>
          )}
        </div>
      )}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

interface SettingItemProps {
  setting: Setting
  onChange?: (value: unknown) => void
}

function SettingItem({ setting, onChange }: SettingItemProps) {
  const renderInput = () => {
    switch (setting.type) {
      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value as boolean}
              onChange={e => onChange?.(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <div>
              <div className="text-sm font-medium">{setting.label}</div>
              {setting.description && (
                <div className="text-xs text-muted-foreground">{setting.description}</div>
              )}
            </div>
          </label>
        )
      
      case 'select':
        return (
          <div>
            <label className="text-sm font-medium">{setting.label}</label>
            {setting.description && (
              <div className="text-xs text-muted-foreground mb-2">{setting.description}</div>
            )}
            <select
              value={setting.value as string}
              onChange={e => onChange?.(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {setting.options?.map(opt => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )
      
      case 'number':
        return (
          <div>
            <label className="text-sm font-medium">{setting.label}</label>
            {setting.description && (
              <div className="text-xs text-muted-foreground mb-2">{setting.description}</div>
            )}
            <input
              type="number"
              value={setting.value as number}
              onChange={e => onChange?.(parseFloat(e.target.value))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        )
      
      case 'color':
        return (
          <div>
            <label className="text-sm font-medium">{setting.label}</label>
            {setting.description && (
              <div className="text-xs text-muted-foreground mb-2">{setting.description}</div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={setting.value as string}
                onChange={e => onChange?.(e.target.value)}
                className="h-8 w-8 rounded border border-border cursor-pointer"
              />
              <input
                type="text"
                value={setting.value as string}
                onChange={e => onChange?.(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        )
      
      default:
        return (
          <div>
            <label className="text-sm font-medium">{setting.label}</label>
            {setting.description && (
              <div className="text-xs text-muted-foreground mb-2">{setting.description}</div>
            )}
            <input
              type="text"
              value={setting.value as string}
              onChange={e => onChange?.(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        )
    }
  }
  
  return <div>{renderInput()}</div>
}

// ============================================================================
// Keybinding Components
// ============================================================================

export interface ShortcutEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  keybinding?: Keybinding
  onChange?: (keys: string[]) => void
  onReset?: () => void
}

export function ShortcutEditor({ 
  keybinding,
  onChange,
  onReset,
  className, 
  ...props 
}: ShortcutEditorProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [keys, setKeys] = useState<string[]>(keybinding?.keys || [])
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRecording) return
    e.preventDefault()
    
    const parts: string[] = []
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.shiftKey) parts.push('Shift')
    if (e.altKey) parts.push('Alt')
    if (e.metaKey) parts.push('Meta')
    
    // Add the main key if it's not a modifier
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      parts.push(e.key.length === 1 ? e.key.toUpperCase() : e.key)
    }
    
    if (parts.length > 0 && !['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      setKeys(parts)
      setIsRecording(false)
      onChange?.(parts)
    }
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      {keybinding && (
        <div className="mb-3">
          <div className="text-sm font-medium">{keybinding.label}</div>
          <div className="text-xs text-muted-foreground">{keybinding.command}</div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <div 
          className={cn(
            'flex-1 flex items-center gap-1 rounded-md border bg-background px-3 py-2',
            isRecording ? 'border-primary ring-1 ring-primary' : 'border-border'
          )}
        >
          {keys.length > 0 ? (
            keys.map((key, i) => (
              <kbd key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                {key}
              </kbd>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              {isRecording ? 'Press keys...' : 'Not set'}
            </span>
          )}
        </div>
        
        <button
          onClick={() => {
            setIsRecording(!isRecording)
            if (!isRecording) inputRef.current?.focus()
          }}
          className={cn(
            'px-3 py-2 rounded-md text-xs transition-colors',
            isRecording 
              ? 'bg-primary text-primary-foreground' 
              : 'border border-border hover:bg-muted'
          )}
        >
          {isRecording ? 'Cancel' : 'Record'}
        </button>
        
        {onReset && keys.length > 0 && (
          <button
            onClick={() => {
              setKeys([])
              onReset()
            }}
            className="px-3 py-2 rounded-md border border-border text-xs hover:bg-muted"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Hidden input for capturing keyboard events */}
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsRecording(false)}
        className="sr-only"
      />
    </div>
  )
}

export interface KeybindingViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  keybindings?: Keybinding[]
  searchable?: boolean
  onEdit?: (keybinding: Keybinding) => void
}

export function KeybindingViewer({ 
  keybindings = [],
  searchable = true,
  onEdit,
  className, 
  ...props 
}: KeybindingViewerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filtered = useMemo(() => 
    keybindings.filter(kb => 
      !searchQuery || 
      kb.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.command.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [keybindings, searchQuery]
  )
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        Keyboard Shortcuts
      </div>
      
      {searchable && (
        <div className="px-4 py-3 border-b border-border">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search shortcuts..."
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      )}
      
      <div className="max-h-80 overflow-y-auto divide-y divide-border">
        {filtered.map(kb => (
          <div 
            key={kb.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 cursor-pointer"
            onClick={() => onEdit?.(kb)}
          >
            <div>
              <div className="text-sm font-medium">{kb.label}</div>
              <div className="text-xs text-muted-foreground">{kb.command}</div>
            </div>
            <div className="flex items-center gap-1">
              {kb.keys.map((key, i) => (
                <kbd key={i} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No shortcuts found
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Debug Components
// ============================================================================

export interface DebugPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: Record<string, unknown>
  collapsed?: boolean
}

export function DebugPanel({ data, collapsed = false, className, ...props }: DebugPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          <span className="text-sm font-semibold">Debug Panel</span>
        </div>
        <span className="text-xs">{isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          {data ? (
            <JSONViewer data={data} />
          ) : (
            <div className="text-sm text-muted-foreground">No data to display</div>
          )}
        </div>
      )}
    </div>
  )
}

export interface InspectorProps extends React.HTMLAttributes<HTMLDivElement> {
  target?: Record<string, unknown>
  title?: string
  editable?: boolean
  onValueChange?: (path: string, value: unknown) => void
}

export function Inspector({ 
  target,
  title = 'Inspector',
  editable = false,
  onValueChange,
  className, 
  ...props 
}: InspectorProps) {
  if (!target) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted-foreground', className)} {...props}>
        No target selected
      </div>
    )
  }
  
  const renderValue = (key: string, value: unknown, path: string): React.ReactNode => {
    const type = typeof value
    
    if (value === null) {
      return <span className="text-muted-foreground">null</span>
    }
    
    if (type === 'object' && !Array.isArray(value)) {
      return (
        <details className="ml-4">
          <summary className="cursor-pointer text-primary">{key}: Object</summary>
          <div className="mt-1">
            {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
              <div key={k} className="flex items-start gap-2">
                <span className="text-purple-500">{k}:</span>
                {renderValue(k, v, `${path}.${k}`)}
              </div>
            ))}
          </div>
        </details>
      )
    }
    
    if (Array.isArray(value)) {
      return (
        <details className="ml-4">
          <summary className="cursor-pointer text-primary">{key}: Array[{value.length}]</summary>
          <div className="mt-1">
            {value.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-muted-foreground">[{i}]:</span>
                {renderValue(String(i), item, `${path}[${i}]`)}
              </div>
            ))}
          </div>
        </details>
      )
    }
    
    if (type === 'boolean') {
      return editable ? (
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={e => onValueChange?.(path, e.target.checked)}
          className="accent-primary"
        />
      ) : (
        <span className={value ? 'text-green-500' : 'text-red-500'}>{String(value)}</span>
      )
    }
    
    if (type === 'number') {
      return editable ? (
        <input
          type="number"
          value={value as number}
          onChange={e => onValueChange?.(path, parseFloat(e.target.value))}
          className="w-20 px-1 rounded border border-border bg-background text-sm"
        />
      ) : (
        <span className="text-blue-500">{String(value)}</span>
      )
    }
    
    if (type === 'string') {
      return editable ? (
        <input
          type="text"
          value={value as string}
          onChange={e => onValueChange?.(path, e.target.value)}
          className="flex-1 px-1 rounded border border-border bg-background text-sm"
        />
      ) : (
        <span className="text-green-500">"{String(value)}"</span>
      )
    }
    
    return <span className="text-muted-foreground">{String(value)}</span>
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface', className)} {...props}>
      <div className="px-4 py-3 border-b border-border font-semibold text-sm">
        {title}
      </div>
      <div className="p-4 font-mono text-xs space-y-1">
        {Object.entries(target).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <span className="text-purple-500">{key}:</span>
            {renderValue(key, value, key)}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface LogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  logs?: LogEntry[]
  maxLogs?: number
  autoScroll?: boolean
  showTimestamp?: boolean
  showSource?: boolean
  levelFilter?: LogEntry['level'][]
  onClear?: () => void
}

export function LogViewer({ 
  logs = [],
  maxLogs = 500,
  autoScroll = true,
  showTimestamp = true,
  showSource = true,
  levelFilter,
  onClear,
  className, 
  ...props 
}: LogViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<LogEntry['level'][]>(levelFilter || ['debug', 'info', 'warn', 'error'])
  
  const filteredLogs = useMemo(() => 
    logs.filter(log => filter.includes(log.level)).slice(-maxLogs),
    [logs, filter, maxLogs]
  )
  
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [filteredLogs, autoScroll])
  
  const levelColors: Record<LogEntry['level'], string> = {
    debug: 'text-muted-foreground',
    info: 'text-blue-500',
    warn: 'text-yellow-500',
    error: 'text-red-500',
  }
  
  const levelIcons: Record<LogEntry['level'], React.ReactNode> = {
    debug: <Search className="h-3 w-3" />,
    info: <Info className="h-3 w-3" />,
    warn: <AlertTriangle className="h-3 w-3" />,
    error: <AlertCircle className="h-3 w-3" />,
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-[#1a1a1a]', className)} {...props}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-[#252525]">
        <div className="flex items-center gap-2">
          {(['debug', 'info', 'warn', 'error'] as const).map(level => (
            <button
              key={level}
              onClick={() => {
                if (filter.includes(level)) {
                  setFilter(filter.filter(l => l !== level))
                } else {
                  setFilter([...filter, level])
                }
              }}
              className={cn(
                'px-2 py-0.5 rounded text-xs transition-colors',
                filter.includes(level) ? levelColors[level] : 'text-gray-600'
              )}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Logs */}
      <div 
        ref={containerRef}
        className="max-h-64 overflow-y-auto font-mono text-xs p-2 space-y-0.5"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No logs</div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className={cn('flex items-start gap-2', levelColors[log.level])}>
              <span>{levelIcons[log.level]}</span>
              {showTimestamp && (
                <span className="text-gray-500">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
              )}
              {showSource && log.source && (
                <span className="text-purple-400">[{log.source}]</span>
              )}
              <span className="flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export interface JSONViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: unknown
  collapsed?: boolean
  indentSize?: number
}

export function JSONViewer({ 
  data,
  collapsed = false,
  indentSize = 2,
  className, 
  ...props 
}: JSONViewerProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  
  const formatted = useMemo(() => {
    try {
      return JSON.stringify(data, null, indentSize)
    } catch {
      return 'Invalid JSON'
    }
  }, [data, indentSize])
  
  const highlighted = useMemo(() => {
    return formatted
      .replace(/"([^"]+)":/g, '<span class="text-purple-400">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-blue-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-yellow-400">$1</span>')
      .replace(/: null/g, ': <span class="text-gray-500">null</span>')
  }, [formatted])
  
  return (
    <div className={cn('rounded-lg border border-border bg-[#1a1a1a] overflow-hidden', className)} {...props}>
      <div 
        className="flex items-center justify-between px-3 py-2 bg-[#252525] cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="text-xs font-mono text-gray-400">JSON</span>
        <span className="text-xs text-gray-500">{isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}</span>
      </div>
      {!isCollapsed && (
        <pre 
          className="p-3 font-mono text-xs text-gray-300 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      )}
    </div>
  )
}

// ============================================================================
// Environment & Feature Toggles
// ============================================================================

export interface EnvironmentSelectorProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  environments?: { id: string; name: string; url?: string }[]
  currentEnvironment?: string
  onChange?: (environmentId: string) => void
}

export function EnvironmentSelector({ 
  environments = [
    { id: 'development', name: 'Development' },
    { id: 'staging', name: 'Staging' },
    { id: 'production', name: 'Production' },
  ],
  currentEnvironment,
  onChange,
  className,
  ...props 
}: EnvironmentSelectorProps) {
  return (
    <select 
      value={currentEnvironment}
      onChange={e => onChange?.(e.target.value)}
      className={cn('rounded-md border border-border bg-background px-2 py-1 text-sm', className)} 
      {...props}
    >
      {environments.map(env => (
        <option key={env.id} value={env.id}>
          {env.name}
        </option>
      ))}
    </select>
  )
}

export interface FeatureToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string
  description?: string
  enabled?: boolean
  onChange?: (enabled: boolean) => void
}

export function FeatureToggle({ 
  name,
  description,
  enabled = false,
  onChange,
  className,
  ...props 
}: FeatureToggleProps) {
  return (
    <div 
      className={cn('flex items-center justify-between p-3 rounded-lg border border-border bg-surface', className)}
      {...props}
    >
      <div>
        <div className="text-sm font-medium">{name}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange?.(!enabled)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          enabled ? 'bg-primary' : 'bg-muted'
        )}
      >
        <div 
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  )
}

// ============================================================================
// Utility Components
// ============================================================================

export interface CopyToClipboardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  onCopy?: () => void
  feedback?: string
}

export function CopyToClipboard({ 
  text,
  onCopy,
  feedback = 'Copied!',
  children,
  className,
  ...props 
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  return (
    <button 
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors',
        className
      )}
      {...props}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span>{feedback}</span>
        </>
      ) : (
        children || (
          <>
            <Clipboard className="h-4 w-4" />
            <span>Copy</span>
          </>
        )
      )}
    </button>
  )
}

export interface DragHandleProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DragHandle({ className, ...props }: DragHandleProps) {
  return (
    <div 
      className={cn(
        'flex items-center justify-center h-6 w-6 rounded cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-muted',
        className
      )} 
      {...props}
    >
      <GripVertical className="h-4 w-4" />
    </div>
  )
}

export interface DevDropZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> {
  accept?: string[]
  onDrop?: (files: File[]) => void
}

export function DevDropZone({ 
  accept = ['*'],
  onDrop,
  className, 
  ...props 
}: DevDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <div 
      onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={e => {
        e.preventDefault()
        setIsDragging(false)
        onDrop?.(Array.from(e.dataTransfer.files))
      }}
      className={cn(
        'rounded-lg border-2 border-dashed p-6 text-center transition-colors',
        isDragging ? 'border-primary bg-primary/5' : 'border-border',
        className
      )} 
      {...props}
    >
      <div className="text-muted-foreground text-sm">
        {isDragging ? 'Drop files here' : 'Drag and drop files'}
      </div>
    </div>
  )
}

export interface DevFilePickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  accept?: string
  multiple?: boolean
  onSelect?: (files: File[]) => void
}

export function DevFilePicker({ 
  accept,
  multiple,
  onSelect,
  className,
  ...props 
}: DevFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={e => {
          if (e.target.files) onSelect?.(Array.from(e.target.files))
        }}
        className="hidden"
      />
      <button 
        onClick={() => inputRef.current?.click()}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted',
          className
        )}
        {...props}
      >
        <FolderOpen className="h-4 w-4" /> Pick file
      </button>
    </>
  )
}

export interface DevFolderPickerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  onSelect?: (files: File[]) => void
}

export function DevFolderPicker({ onSelect, className, ...props }: DevFolderPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        // @ts-ignore - webkitdirectory is not in types
        webkitdirectory=""
        directory=""
        multiple
        onChange={e => {
          if (e.target.files) onSelect?.(Array.from(e.target.files))
        }}
        className="hidden"
      />
      <button 
        onClick={() => inputRef.current?.click()}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted',
          className
        )}
        {...props}
      >
        <Folder className="h-4 w-4" /> Pick folder
      </button>
    </>
  )
}

// ============================================================================
// File Tree
// ============================================================================

export interface FileTreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  nodes?: FileNode[]
  selectedPath?: string
  onSelect?: (node: FileNode) => void
  onExpand?: (node: FileNode) => void
}

export function FileTree({ nodes = [], selectedPath, onSelect, onExpand, className, ...props }: FileTreeProps) {
  const renderNode = (node: FileNode, depth: number = 0): React.ReactNode => {
    const [isExpanded, setIsExpanded] = useState(true)
    const isSelected = node.path === selectedPath
    
    return (
      <div key={node.id}>
        <div 
          className={cn(
            'flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-muted/50',
            isSelected && 'bg-primary/10 text-primary'
          )}
          style={{ paddingLeft: depth * 16 + 8 }}
          onClick={() => {
            if (node.type === 'folder') {
              setIsExpanded(!isExpanded)
              onExpand?.(node)
            } else {
              onSelect?.(node)
            }
          }}
        >
          <span className="text-sm">
            {node.type === 'folder' 
              ? (isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />)
              : <File className="h-4 w-4" />
            }
          </span>
          <span className="text-sm truncate">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-lg border border-border bg-surface overflow-hidden', className)} {...props}>
      <div className="p-2 max-h-80 overflow-y-auto">
        {nodes.map(node => renderNode(node))}
      </div>
    </div>
  )
}

// ============================================================================
// Search Bar
// ============================================================================

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (query: string) => void
  onClear?: () => void
  suggestions?: string[]
}

export function SearchBar({ 
  onSearch,
  onClear,
  suggestions = [],
  className, 
  ...props 
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  )
  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            onSearch?.(e.target.value)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className={cn(
            'w-full rounded-md border border-border bg-background pl-9 pr-8 py-2 text-sm',
            className
          )} 
          {...props} 
        />
        {query && onClear && (
          <button
            onClick={() => { setQuery(''); onClear() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 rounded-md border border-border bg-background shadow-lg">
          {filteredSuggestions.map((suggestion, i) => (
            <div
              key={i}
              onClick={() => {
                setQuery(suggestion)
                onSearch?.(suggestion)
                setShowSuggestions(false)
              }}
              className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Notifications & Banners
// ============================================================================

export interface UpdateNotifierProps extends React.HTMLAttributes<HTMLDivElement> {
  version?: string
  onUpdate?: () => void
  onDismiss?: () => void
}

export function UpdateNotifier({ version, onUpdate, onDismiss, className, ...props }: UpdateNotifierProps) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-md border border-primary/30 bg-primary/10 px-4 py-3',
      className
    )} {...props}>
      <div className="flex items-center gap-3">
        <Download className="h-5 w-5 text-primary" />
        <div>
          <div className="text-sm font-medium">Update available</div>
          {version && (
            <div className="text-xs text-muted-foreground">Version {version}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onUpdate && (
          <button
            onClick={onUpdate}
            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:bg-primary/90"
          >
            Update now
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Later
          </button>
        )}
      </div>
    </div>
  )
}

export interface PermissionPromptProps extends React.HTMLAttributes<HTMLDivElement> {
  permission?: string
  description?: string
  onAllow?: () => void
  onDeny?: () => void
}

export function PermissionPrompt({ 
  permission = 'Permission',
  description,
  onAllow,
  onDeny,
  className, 
  ...props 
}: PermissionPromptProps) {
  return (
    <div className={cn(
      'rounded-lg border border-border bg-surface p-4',
      className
    )} {...props}>
      <div className="flex items-start gap-3">
        <Lock className="h-6 w-6" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{permission}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {onDeny && (
          <button
            onClick={onDeny}
            className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-muted"
          >
            Deny
          </button>
        )}
        {onAllow && (
          <button
            onClick={onAllow}
            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            Allow
          </button>
        )}
      </div>
    </div>
  )
}

export interface RestartRequiredBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  onRestart?: () => void
}

export function RestartRequiredBanner({ 
  message = 'Some changes require a restart to take effect.',
  onRestart,
  className, 
  ...props 
}: RestartRequiredBannerProps) {
  return (
    <div className={cn(
      'flex items-center justify-between rounded-md border border-warning/30 bg-warning/10 px-4 py-3',
      className
    )} {...props}>
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm">{message}</span>
      </div>
      {onRestart && (
        <button
          onClick={onRestart}
          className="px-3 py-1.5 rounded-md bg-warning text-warning-foreground text-xs hover:bg-warning/90"
        >
          Restart now
        </button>
      )}
    </div>
  )
}

export interface BadgeCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number
  max?: number
}

export function BadgeCounter({ count = 0, max = 99, className, ...props }: BadgeCounterProps) {
  const display = count > max ? `${max}+` : count
  
  if (count === 0) return null
  
  return (
    <span 
      className={cn(
        'inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground',
        className
      )} 
      {...props}
    >
      {display}
    </span>
  )
}

// ============================================================================
// Drag & Drop Utilities
// ============================================================================

export interface DraggableProps extends React.HTMLAttributes<HTMLDivElement> {
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

export function Draggable({ 
  draggable = true,
  onDragStart,
  onDragEnd,
  children,
  className, 
  ...props 
}: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <div 
      draggable={draggable}
      onDragStart={e => {
        setIsDragging(true)
        onDragStart?.(e)
      }}
      onDragEnd={e => {
        setIsDragging(false)
        onDragEnd?.(e)
      }}
      className={cn(
        'rounded-md border border-border bg-background p-3 cursor-grab active:cursor-grabbing transition-opacity',
        isDragging && 'opacity-50',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

export interface DragPreviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DragPreview({ className, ...props }: DragPreviewProps) {
  return (
    <div 
      className={cn(
        'rounded-md border-2 border-dashed border-primary/50 bg-primary/5 p-3',
        className
      )} 
      {...props} 
    />
  )
}

export interface SortableProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: { id: string; content: React.ReactNode }[]
  onReorder?: (items: { id: string; content: React.ReactNode }[]) => void
}

export function Sortable({ items = [], onReorder, className, ...props }: SortableProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [localItems, setLocalItems] = useState(items)
  
  useEffect(() => {
    setLocalItems(items)
  }, [items])
  
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return
    
    const draggedIndex = localItems.findIndex(i => i.id === draggedId)
    const targetIndex = localItems.findIndex(i => i.id === targetId)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    const newItems = [...localItems]
    const [removed] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, removed)
    
    setLocalItems(newItems)
  }
  
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {localItems.map(item => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDraggedId(item.id)}
          onDragOver={e => handleDragOver(e, item.id)}
          onDragEnd={() => {
            setDraggedId(null)
            onReorder?.(localItems)
          }}
          className={cn(
            'rounded-md border border-border bg-background p-3 cursor-grab active:cursor-grabbing',
            draggedId === item.id && 'opacity-50'
          )}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}

export interface SnapAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
}

export function SnapArea({ active, className, ...props }: SnapAreaProps) {
  return (
    <div 
      className={cn(
        'rounded-md border-2 border-dashed p-4 transition-colors',
        active ? 'border-primary bg-primary/5' : 'border-border bg-muted/20',
        className
      )} 
      {...props} 
    />
  )
}

export interface GestureLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
}

export function GestureLayer({ 
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  children,
  className, 
  ...props 
}: GestureLayerProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    }
    
    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y
    const minSwipeDistance = 50
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipeDistance) onSwipeRight?.()
      else if (deltaX < -minSwipeDistance) onSwipeLeft?.()
    } else {
      if (deltaY > minSwipeDistance) onSwipeDown?.()
      else if (deltaY < -minSwipeDistance) onSwipeUp?.()
    }
    
    setTouchStart(null)
  }
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn('touch-manipulation', className)} 
      {...props}
    >
      {children}
    </div>
  )
}
