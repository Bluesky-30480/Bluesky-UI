import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'

export interface DataGridColumn<T> {
  key: keyof T | string
  header: React.ReactNode
  render?: (row: T, index: number) => React.ReactNode
  className?: string
  /** Enable sorting for this column */
  sortable?: boolean
  /** Custom sort function */
  sortFn?: (a: T, b: T) => number
  /** Column width (CSS value) */
  width?: string
  /** Minimum column width for resizing */
  minWidth?: number
  /** Maximum column width for resizing */
  maxWidth?: number
  /** Enable filtering for this column */
  filterable?: boolean
  /** Enable resizing for this column */
  resizable?: boolean
}

export interface DataGridProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: Array<DataGridColumn<T>>
  data: T[]
  /** Enable row selection */
  selectable?: boolean
  /** Selected row keys */
  selectedKeys?: Set<string | number>
  /** Callback when selection changes */
  onSelectionChange?: (keys: Set<string | number>) => void
  /** Function to get unique key for each row */
  getRowKey?: (row: T, index: number) => string | number
  /** Enable pagination */
  pagination?: boolean
  /** Rows per page (default: 10) */
  pageSize?: number
  /** Current page (controlled) */
  page?: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Empty state content */
  emptyContent?: React.ReactNode
  /** Loading state */
  loading?: boolean
  /** Enable column resizing */
  resizable?: boolean
  /** Callback when column widths change */
  onColumnResize?: (columnKey: string, width: number) => void
}

type SortDirection = 'asc' | 'desc' | null

export function DataGrid<T>({ 
  columns, 
  data, 
  selectable,
  selectedKeys: controlledSelectedKeys,
  onSelectionChange,
  getRowKey = (_, i) => i,
  pagination,
  pageSize = 10,
  page: controlledPage,
  onPageChange,
  emptyContent,
  loading,
  resizable = false,
  onColumnResize,
  className, 
  ...props 
}: DataGridProps<T>) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  
  // Selection state (internal if not controlled)
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<Set<string | number>>(new Set())
  const selectedKeys = controlledSelectedKeys ?? internalSelectedKeys
  const setSelectedKeys = onSelectionChange ?? setInternalSelectedKeys
  
  // Pagination state (internal if not controlled)
  const [internalPage, setInternalPage] = useState(1)
  const currentPage = controlledPage ?? internalPage
  const setCurrentPage = onPageChange ?? setInternalPage
  
  // Column widths for resizing
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)
  
  // Handle column resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, columnKey: string, currentWidth: number) => {
    e.preventDefault()
    setResizingColumn(columnKey)
    resizeStartX.current = e.clientX
    resizeStartWidth.current = currentWidth
  }, [])
  
  // Handle resize move and end
  useEffect(() => {
    if (!resizingColumn) return
    
    const column = columns.find(c => String(c.key) === resizingColumn)
    const minWidth = column?.minWidth ?? 50
    const maxWidth = column?.maxWidth ?? 500
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartWidth.current + delta))
      setColumnWidths(prev => ({ ...prev, [resizingColumn]: newWidth }))
    }
    
    const handleMouseUp = () => {
      if (resizingColumn && columnWidths[resizingColumn]) {
        onColumnResize?.(resizingColumn, columnWidths[resizingColumn])
      }
      setResizingColumn(null)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizingColumn, columns, columnWidths, onColumnResize])
  
  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data
    
    const column = columns.find(c => String(c.key) === sortColumn)
    if (!column) return data
    
    return [...data].sort((a, b) => {
      if (column.sortFn) {
        return sortDirection === 'asc' ? column.sortFn(a, b) : column.sortFn(b, a)
      }
      
      const aVal = (a as Record<string, unknown>)[sortColumn]
      const bVal = (b as Record<string, unknown>)[sortColumn]
      
      if (aVal === bVal) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      
      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection, columns])
  
  // Paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, pagination, currentPage, pageSize])
  
  const totalPages = Math.ceil(sortedData.length / pageSize)
  
  // Handle sort
  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find(c => String(c.key) === columnKey)
    if (!column?.sortable) return
    
    if (sortColumn !== columnKey) {
      setSortColumn(columnKey)
      setSortDirection('asc')
    } else if (sortDirection === 'asc') {
      setSortDirection('desc')
    } else {
      setSortColumn(null)
      setSortDirection(null)
    }
  }, [sortColumn, sortDirection, columns])
  
  // Handle selection
  const handleSelectAll = useCallback(() => {
    if (selectedKeys.size === paginatedData.length) {
      setSelectedKeys(new Set())
    } else {
      setSelectedKeys(new Set(paginatedData.map((row, i) => getRowKey(row, i))))
    }
  }, [selectedKeys, paginatedData, getRowKey, setSelectedKeys])
  
  const handleSelectRow = useCallback((key: string | number) => {
    const newKeys = new Set(selectedKeys)
    if (newKeys.has(key)) {
      newKeys.delete(key)
    } else {
      newKeys.add(key)
    }
    setSelectedKeys(newKeys)
  }, [selectedKeys, setSelectedKeys])
  
  // Sort indicator
  const SortIndicator = ({ column }: { column: string }) => {
    if (sortColumn !== column) return <span className="ml-1 opacity-30"><ArrowUpDown className="h-3 w-3 inline" /></span>
    return <span className="ml-1">{sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 inline" /> : <ArrowDown className="h-3 w-3 inline" />}</span>
  }

  return (
    <div className={cn('rounded-lg border border-border', className)} {...props}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedKeys.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-border"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)} 
                  className={cn(
                    'relative',
                    column.className,
                    column.sortable && 'cursor-pointer select-none hover:bg-muted/50'
                  )}
                  style={{ 
                    width: columnWidths[String(column.key)] 
                      ? `${columnWidths[String(column.key)]}px` 
                      : column.width 
                  }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <span className="flex items-center">
                    {column.header}
                    {column.sortable && <SortIndicator column={String(column.key)} />}
                  </span>
                  
                  {/* Resize handle */}
                  {(resizable || column.resizable) && (
                    <div
                      className={cn(
                        'absolute right-0 top-0 bottom-0 w-1 cursor-col-resize',
                        'hover:bg-primary/50 transition-colors',
                        resizingColumn === String(column.key) && 'bg-primary'
                      )}
                      onMouseDown={(e) => {
                        const th = e.currentTarget.parentElement
                        const width = th?.offsetWidth ?? 100
                        handleResizeStart(e, String(column.key), columnWidths[String(column.key)] ?? width)
                      }}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="h-24 text-center text-muted-foreground">
                  {emptyContent || 'No data'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const rowKey = getRowKey(row, (currentPage - 1) * pageSize + index)
                return (
                  <TableRow 
                    key={rowKey}
                    className={cn(selectedKeys.has(rowKey) && 'bg-primary/5')}
                  >
                    {selectable && (
                      <TableCell className="w-10">
                        <input
                          type="checkbox"
                          checked={selectedKeys.has(rowKey)}
                          onChange={() => handleSelectRow(rowKey)}
                          className="h-4 w-4 rounded border-border"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)} className={column.className}>
                        {column.render 
                          ? column.render(row, index) 
                          : String((row as Record<string, unknown>)[column.key as string] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} rows
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md px-3 py-1.5 text-sm border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-sm',
                      currentPage === pageNum 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md px-3 py-1.5 text-sm border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
