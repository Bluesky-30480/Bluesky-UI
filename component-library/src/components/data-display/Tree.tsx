import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { cn } from '../../utils/cn'

export interface TreeNode {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  children?: TreeNode[]
  disabled?: boolean
  data?: unknown
}

export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Tree data */
  data: TreeNode[]
  /** Enable multi-select */
  multiSelect?: boolean
  /** Selected node IDs */
  selected?: string[]
  /** Default selected node IDs */
  defaultSelected?: string[]
  /** Expanded node IDs */
  expanded?: string[]
  /** Default expanded node IDs */
  defaultExpanded?: string[]
  /** On selection change */
  onSelect?: (selectedIds: string[], nodes: TreeNode[]) => void
  /** On expand change */
  onExpand?: (expandedIds: string[]) => void
  /** Show checkboxes */
  showCheckboxes?: boolean
  /** Enable expand all / collapse all */
  showExpandControls?: boolean
  /** Indent size in pixels */
  indentSize?: number
  /** Enable keyboard navigation */
  enableKeyboard?: boolean
}

// Flatten tree for keyboard navigation
function flattenTree(nodes: TreeNode[], expandedIds: Set<string>, result: TreeNode[] = []): TreeNode[] {
  for (const node of nodes) {
    result.push(node)
    if (node.children && expandedIds.has(node.id)) {
      flattenTree(node.children, expandedIds, result)
    }
  }
  return result
}

// Get all node IDs for expand all
function getAllNodeIds(nodes: TreeNode[], result: string[] = []): string[] {
  for (const node of nodes) {
    if (node.children?.length) {
      result.push(node.id)
      getAllNodeIds(node.children, result)
    }
  }
  return result
}

// Find node by ID
function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

// Get all descendant IDs
function getDescendantIds(node: TreeNode): string[] {
  const ids: string[] = []
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id)
      ids.push(...getDescendantIds(child))
    }
  }
  return ids
}

export function Tree({ 
  data, 
  multiSelect = false,
  selected: selectedProp,
  defaultSelected = [],
  expanded: expandedProp,
  defaultExpanded,
  onSelect,
  onExpand,
  showCheckboxes = false,
  showExpandControls = false,
  indentSize = 20,
  enableKeyboard = true,
  className, 
  ...props 
}: TreeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  
  // Selected state
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelected)
  const selectedIds = selectedProp !== undefined ? selectedProp : internalSelected
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])
  
  // Expanded state
  const allNodeIds = useMemo(() => getAllNodeIds(data), [data])
  const [internalExpanded, setInternalExpanded] = useState<string[]>(defaultExpanded ?? allNodeIds)
  const expandedIds = expandedProp !== undefined ? expandedProp : internalExpanded
  const expandedSet = useMemo(() => new Set(expandedIds), [expandedIds])
  
  // Flat list for keyboard navigation
  const flatNodes = useMemo(() => flattenTree(data, expandedSet), [data, expandedSet])
  
  // Toggle expansion
  const toggleExpand = useCallback((nodeId: string) => {
    const newExpanded = expandedSet.has(nodeId)
      ? expandedIds.filter(id => id !== nodeId)
      : [...expandedIds, nodeId]
    
    if (expandedProp === undefined) {
      setInternalExpanded(newExpanded)
    }
    onExpand?.(newExpanded)
  }, [expandedIds, expandedSet, expandedProp, onExpand])
  
  // Toggle selection
  const toggleSelect = useCallback((node: TreeNode, event?: React.MouseEvent) => {
    if (node.disabled) return
    
    let newSelected: string[]
    
    if (multiSelect && showCheckboxes) {
      // With checkboxes: include/exclude descendants
      const descendantIds = getDescendantIds(node)
      const allIds = [node.id, ...descendantIds]
      
      if (selectedSet.has(node.id)) {
        // Deselect node and all descendants
        newSelected = selectedIds.filter(id => !allIds.includes(id))
      } else {
        // Select node and all descendants
        newSelected = [...new Set([...selectedIds, ...allIds])]
      }
    } else if (multiSelect) {
      // Multi-select without checkboxes (Ctrl+click)
      if (event?.ctrlKey || event?.metaKey) {
        newSelected = selectedSet.has(node.id)
          ? selectedIds.filter(id => id !== node.id)
          : [...selectedIds, node.id]
      } else {
        newSelected = [node.id]
      }
    } else {
      // Single select
      newSelected = selectedSet.has(node.id) ? [] : [node.id]
    }
    
    if (selectedProp === undefined) {
      setInternalSelected(newSelected)
    }
    
    const selectedNodes = newSelected
      .map(id => findNode(data, id))
      .filter((n): n is TreeNode => n !== null)
    onSelect?.(newSelected, selectedNodes)
  }, [data, multiSelect, showCheckboxes, selectedIds, selectedSet, selectedProp, onSelect])
  
  // Expand/collapse all
  const expandAll = useCallback(() => {
    const all = getAllNodeIds(data)
    if (expandedProp === undefined) {
      setInternalExpanded(all)
    }
    onExpand?.(all)
  }, [data, expandedProp, onExpand])
  
  const collapseAll = useCallback(() => {
    if (expandedProp === undefined) {
      setInternalExpanded([])
    }
    onExpand?.([])
  }, [expandedProp, onExpand])
  
  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboard) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return
      
      const currentIndex = focusedId ? flatNodes.findIndex(n => n.id === focusedId) : -1
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (currentIndex < flatNodes.length - 1) {
            setFocusedId(flatNodes[currentIndex + 1].id)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (currentIndex > 0) {
            setFocusedId(flatNodes[currentIndex - 1].id)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (focusedId) {
            const node = findNode(data, focusedId)
            if (node?.children?.length && !expandedSet.has(focusedId)) {
              toggleExpand(focusedId)
            }
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (focusedId) {
            const node = findNode(data, focusedId)
            if (node?.children?.length && expandedSet.has(focusedId)) {
              toggleExpand(focusedId)
            }
          }
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedId) {
            const node = findNode(data, focusedId)
            if (node) toggleSelect(node)
          }
          break
        case 'Home':
          e.preventDefault()
          if (flatNodes.length > 0) {
            setFocusedId(flatNodes[0].id)
          }
          break
        case 'End':
          e.preventDefault()
          if (flatNodes.length > 0) {
            setFocusedId(flatNodes[flatNodes.length - 1].id)
          }
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboard, focusedId, flatNodes, data, expandedSet, toggleExpand, toggleSelect])
  
  return (
    <div 
      ref={containerRef}
      className={cn('space-y-0.5', className)} 
      tabIndex={0}
      role="tree"
      aria-multiselectable={multiSelect}
      {...props}
    >
      {/* Expand controls */}
      {showExpandControls && (
        <div className="flex gap-2 mb-2 text-xs">
          <button 
            onClick={expandAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Expand all
          </button>
          <span className="text-muted-foreground">|</span>
          <button 
            onClick={collapseAll}
            className="text-muted-foreground hover:text-foreground"
          >
            Collapse all
          </button>
        </div>
      )}
      
      {data.map((node) => (
        <TreeItem 
          key={node.id} 
          node={node} 
          depth={0}
          indentSize={indentSize}
          expandedSet={expandedSet}
          selectedSet={selectedSet}
          focusedId={focusedId}
          showCheckboxes={showCheckboxes}
          onToggleExpand={toggleExpand}
          onSelect={toggleSelect}
          onFocus={setFocusedId}
        />
      ))}
    </div>
  )
}

interface TreeItemProps {
  node: TreeNode
  depth: number
  indentSize: number
  expandedSet: Set<string>
  selectedSet: Set<string>
  focusedId: string | null
  showCheckboxes: boolean
  onToggleExpand: (id: string) => void
  onSelect: (node: TreeNode, event?: React.MouseEvent) => void
  onFocus: (id: string) => void
}

function TreeItem({ 
  node, 
  depth, 
  indentSize,
  expandedSet,
  selectedSet,
  focusedId,
  showCheckboxes,
  onToggleExpand,
  onSelect,
  onFocus,
}: TreeItemProps) {
  const hasChildren = !!node.children?.length
  const isExpanded = expandedSet.has(node.id)
  const isSelected = selectedSet.has(node.id)
  const isFocused = focusedId === node.id

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined} aria-selected={isSelected}>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2 py-1 text-sm cursor-pointer transition-colors',
          'hover:bg-muted/50',
          isSelected && 'bg-primary/10 text-primary',
          isFocused && 'ring-2 ring-primary/50',
          node.disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{ paddingLeft: `${depth * indentSize + 8}px` }}
        onClick={(e) => {
          onFocus(node.id)
          onSelect(node, e)
        }}
      >
        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground shrink-0 w-4 h-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-90')}
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        
        {/* Checkbox */}
        {showCheckboxes && (
          <span 
            className={cn(
              'w-4 h-4 border rounded flex items-center justify-center shrink-0',
              isSelected ? 'bg-primary border-primary' : 'border-border'
            )}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(node, e)
            }}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L20 7" />
              </svg>
            )}
          </span>
        )}
        
        {/* Icon */}
        {node.icon && (
          <span className="shrink-0">{node.icon}</span>
        )}
        
        {/* Label */}
        <span className="text-foreground truncate">{node.label}</span>
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-0.5 space-y-0.5" role="group">
          {node.children?.map((child) => (
            <TreeItem 
              key={child.id} 
              node={child} 
              depth={depth + 1}
              indentSize={indentSize}
              expandedSet={expandedSet}
              selectedSet={selectedSet}
              focusedId={focusedId}
              showCheckboxes={showCheckboxes}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </div>
  )
}
