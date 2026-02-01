import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../utils/cn'
import { Portal } from '../primitives'

export interface CommandItem {
  id: string
  label: string
  description?: string
  shortcut?: string
  disabled?: boolean
  icon?: React.ReactNode
  category?: string
  onSelect: () => void
}

export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  commands: CommandItem[]
  placeholder?: string
  emptyText?: string
  title?: string
  /** Show recent commands section */
  recentCommands?: string[]
  /** Callback when a command is selected (for tracking recent) */
  onCommandSelect?: (commandId: string) => void
  /** Enable fuzzy search matching */
  fuzzyMatch?: boolean
}

// Simple fuzzy match scoring
function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  
  if (t.includes(q)) return 100 // Exact substring match
  
  let score = 0
  let queryIndex = 0
  let lastMatchIndex = -1
  
  for (let i = 0; i < t.length && queryIndex < q.length; i++) {
    if (t[i] === q[queryIndex]) {
      score += 10
      // Bonus for consecutive matches
      if (lastMatchIndex === i - 1) score += 5
      // Bonus for word boundary matches
      if (i === 0 || t[i - 1] === ' ' || t[i - 1] === '-' || t[i - 1] === '_') score += 3
      lastMatchIndex = i
      queryIndex++
    }
  }
  
  return queryIndex === q.length ? score : 0
}

export function CommandPalette({
  isOpen,
  onClose,
  commands,
  placeholder = 'Search commands...',
  emptyText = 'No results found',
  title = 'Command Palette',
  recentCommands = [],
  onCommandSelect,
  fuzzyMatch = true,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter and sort commands
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    
    if (!q) {
      // Show recent commands first when no query
      const recent = recentCommands
        .map(id => commands.find(c => c.id === id))
        .filter(Boolean) as CommandItem[]
      const others = commands.filter(c => !recentCommands.includes(c.id))
      return [...recent, ...others]
    }
    
    if (fuzzyMatch) {
      return commands
        .map(cmd => ({ cmd, score: Math.max(fuzzyScore(q, cmd.label), fuzzyScore(q, cmd.description || '')) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ cmd }) => cmd)
    }
    
    return commands.filter((cmd) => 
      cmd.label.toLowerCase().includes(q) || 
      cmd.description?.toLowerCase().includes(q)
    )
  }, [commands, query, recentCommands, fuzzyMatch])
  
  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    const uncategorized: CommandItem[] = []
    
    filtered.forEach(cmd => {
      if (cmd.category) {
        if (!groups[cmd.category]) groups[cmd.category] = []
        groups[cmd.category].push(cmd)
      } else {
        uncategorized.push(cmd)
      }
    })
    
    // If we have recent and no query, show recent section
    if (!query.trim() && recentCommands.length > 0) {
      const recent = filtered.filter((_, i) => i < recentCommands.length)
      const rest = filtered.slice(recentCommands.length)
      return [
        { category: 'Recent', items: recent },
        { category: null, items: rest },
        ...Object.entries(groups).map(([category, items]) => ({ category, items })),
      ].filter(g => g.items.length > 0)
    }
    
    return [
      { category: null, items: uncategorized },
      ...Object.entries(groups).map(([category, items]) => ({ category, items })),
    ].filter(g => g.items.length > 0)
  }, [filtered, query, recentCommands])
  
  // Flatten for keyboard navigation
  const flatItems = useMemo(() => 
    groupedCommands.flatMap(g => g.items),
    [groupedCommands]
  )

  // Reset selection when filtered list changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return
    
    switch (event.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(i => (i + 1) % flatItems.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(i => (i - 1 + flatItems.length) % flatItems.length)
        break
      case 'Enter':
        event.preventDefault()
        const selected = flatItems[selectedIndex]
        if (selected && !selected.disabled) {
          selected.onSelect()
          onCommandSelect?.(selected.id)
          onClose()
        }
        break
      case 'Tab':
        event.preventDefault()
        if (event.shiftKey) {
          setSelectedIndex(i => (i - 1 + flatItems.length) % flatItems.length)
        } else {
          setSelectedIndex(i => (i + 1) % flatItems.length)
        }
        break
    }
  }, [isOpen, onClose, flatItems, selectedIndex, onCommandSelect])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    selectedEl?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    } else {
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  if (!isOpen) return null

  let itemIndex = 0

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6 animate-in fade-in duration-150" 
        onClick={onClose}
      >
        <div
          className="w-full max-w-xl rounded-lg border border-border bg-surface shadow-xl animate-in slide-in-from-top-4 duration-200"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="border-b border-border px-4 py-3 text-sm font-semibold">{title}</div>
          <div className="px-4 py-3">
            <input
              ref={inputRef}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder={placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              role="combobox"
              aria-expanded="true"
              aria-controls="command-list"
              aria-activedescendant={flatItems[selectedIndex]?.id}
            />
          </div>
          <div 
            ref={listRef}
            id="command-list"
            className="max-h-[320px] overflow-y-auto p-2 scrollbar-thin"
            role="listbox"
          >
            {flatItems.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
            )}
            {groupedCommands.map((group, groupIndex) => (
              <div key={group.category || groupIndex}>
                {group.category && (
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.category}
                  </div>
                )}
                <div className="space-y-0.5">
                  {group.items.map((cmd) => {
                    const currentIndex = itemIndex++
                    const isSelected = currentIndex === selectedIndex
                    
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        disabled={cmd.disabled}
                        data-index={currentIndex}
                        onClick={() => {
                          if (!cmd.disabled) {
                            cmd.onSelect()
                            onCommandSelect?.(cmd.id)
                            onClose()
                          }
                        }}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors',
                          cmd.disabled
                            ? 'cursor-not-allowed text-muted-foreground'
                            : 'text-foreground',
                          isSelected && !cmd.disabled && 'bg-primary/10 text-primary'
                        )}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={cmd.disabled}
                      >
                        <div className="flex items-center gap-3">
                          {cmd.icon && <span className="text-muted-foreground">{cmd.icon}</span>}
                          <div>
                            <div className="font-medium">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-xs text-muted-foreground">{cmd.description}</div>
                            )}
                          </div>
                        </div>
                        {cmd.shortcut && (
                          <kbd className="ml-4 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Footer with keyboard hints */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span><kbd className="bg-muted px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-muted px-1 rounded">↵</kbd> Select</span>
            <span><kbd className="bg-muted px-1 rounded">Esc</kbd> Close</span>
          </div>
        </div>
      </div>
    </Portal>
  )
}
