import React, { useState, useCallback, useMemo } from 'react'
import { cn } from '../../utils/cn'

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Currently displayed month */
  month?: Date
  /** Selected date (single mode) */
  selected?: Date
  /** Selected date range (range mode) */
  selectedRange?: { start: Date | null; end: Date | null }
  /** Selection mode */
  mode?: 'single' | 'range'
  /** Callback when date is selected */
  onSelect?: (date: Date) => void
  /** Callback when range is selected */
  onRangeSelect?: (range: { start: Date | null; end: Date | null }) => void
  /** Callback when month changes */
  onMonthChange?: (date: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Dates to disable */
  disabledDates?: Date[]
  /** Function to check if date is disabled */
  isDateDisabled?: (date: Date) => boolean
  /** Events/appointments to display */
  events?: Array<{ date: Date; label?: string; color?: string }>
  /** Show week numbers */
  showWeekNumbers?: boolean
  /** First day of week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1
  /** Number of months to display (1-3) */
  numberOfMonths?: 1 | 2 | 3
}

const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const getEndOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)
const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const isInRange = (date: Date, start: Date | null, end: Date | null) => {
  if (!start || !end) return false
  const time = date.getTime()
  return time >= start.getTime() && time <= end.getTime()
}
const getWeekNumber = (date: Date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function Calendar({ 
  month: controlledMonth, 
  selected, 
  selectedRange,
  mode = 'single',
  onSelect, 
  onRangeSelect,
  onMonthChange,
  minDate,
  maxDate,
  disabledDates,
  isDateDisabled,
  events,
  showWeekNumbers,
  firstDayOfWeek = 0,
  numberOfMonths = 1,
  className, 
  ...props 
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(controlledMonth || new Date())
  const month = controlledMonth || internalMonth
  
  // Range selection state
  const [rangeStart, setRangeStart] = useState<Date | null>(selectedRange?.start || null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(selectedRange?.end || null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  
  // Day labels based on first day of week
  const dayLabels = useMemo(() => {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    if (firstDayOfWeek === 1) {
      return [...labels.slice(1), labels[0]]
    }
    return labels
  }, [firstDayOfWeek])
  
  // Check if date is disabled
  const checkDisabled = useCallback((date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    if (disabledDates?.some(d => isSameDay(d, date))) return true
    if (isDateDisabled?.(date)) return true
    return false
  }, [minDate, maxDate, disabledDates, isDateDisabled])
  
  // Get events for a date
  const getDateEvents = useCallback((date: Date) => {
    return events?.filter(e => isSameDay(e.date, date)) || []
  }, [events])
  
  // Navigation handlers
  const goToPreviousMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1)
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }
  
  const goToNextMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1)
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }
  
  const goToPreviousYear = () => {
    const newMonth = new Date(month.getFullYear() - 1, month.getMonth(), 1)
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }
  
  const goToNextYear = () => {
    const newMonth = new Date(month.getFullYear() + 1, month.getMonth(), 1)
    setInternalMonth(newMonth)
    onMonthChange?.(newMonth)
  }
  
  const goToToday = () => {
    const today = new Date()
    setInternalMonth(today)
    onMonthChange?.(today)
  }
  
  // Handle date click
  const handleDateClick = (date: Date) => {
    if (checkDisabled(date)) return
    
    if (mode === 'single') {
      onSelect?.(date)
    } else {
      // Range selection logic
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date)
        setRangeEnd(null)
        onRangeSelect?.({ start: date, end: null })
      } else {
        const newEnd = date >= rangeStart ? date : rangeStart
        const newStart = date >= rangeStart ? rangeStart : date
        setRangeStart(newStart)
        setRangeEnd(newEnd)
        onRangeSelect?.({ start: newStart, end: newEnd })
      }
    }
  }
  
  // Check if date is in selection range (for hover preview)
  const isInSelectionRange = (date: Date) => {
    if (mode !== 'range') return false
    if (rangeStart && rangeEnd) return isInRange(date, rangeStart, rangeEnd)
    if (rangeStart && hoverDate) {
      const start = rangeStart <= hoverDate ? rangeStart : hoverDate
      const end = rangeStart <= hoverDate ? hoverDate : rangeStart
      return isInRange(date, start, end)
    }
    return false
  }
  
  const today = new Date()
  
  // Generate months array for multi-month view
  const months = useMemo(() => {
    return Array.from({ length: numberOfMonths }, (_, i) => 
      new Date(month.getFullYear(), month.getMonth() + i, 1)
    )
  }, [month, numberOfMonths])
  
  // Generate cells for a specific month
  const getCellsForMonth = useCallback((targetMonth: Date) => {
    const monthStart = getStartOfMonth(targetMonth)
    const monthEnd = getEndOfMonth(targetMonth)
    const monthStartDay = (monthStart.getDay() - firstDayOfWeek + 7) % 7
    const monthDaysInMonth = monthEnd.getDate()
    
    const result: Array<{ date: Date; isCurrentMonth: boolean }> = []
    
    // Previous month days
    const prevMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() - 1, 1)
    const prevMonthDays = getEndOfMonth(prevMonth).getDate()
    for (let i = monthStartDay - 1; i >= 0; i--) {
      result.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthDays - i),
        isCurrentMonth: false,
      })
    }
    
    // Current month days
    for (let day = 1; day <= monthDaysInMonth; day++) {
      result.push({
        date: new Date(targetMonth.getFullYear(), targetMonth.getMonth(), day),
        isCurrentMonth: true,
      })
    }
    
    // Next month days to fill grid
    const remainingCells = 42 - result.length
    for (let i = 1; i <= remainingCells; i++) {
      result.push({
        date: new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, i),
        isCurrentMonth: false,
      })
    }
    
    return result
  }, [firstDayOfWeek])
  
  // Get weeks for a month
  const getWeeksForMonth = useCallback((targetMonth: Date) => {
    const monthCells = getCellsForMonth(targetMonth)
    const result: Array<typeof monthCells> = []
    for (let i = 0; i < monthCells.length; i += 7) {
      result.push(monthCells.slice(i, i + 7))
    }
    return result
  }, [getCellsForMonth])
  
  // Render a single month grid
  const renderMonth = (targetMonth: Date, index: number) => {
    const monthWeeks = getWeeksForMonth(targetMonth)
    const isFirst = index === 0
    const isLast = index === numberOfMonths - 1
    
    return (
      <div key={targetMonth.toISOString()} className={cn('flex-1', numberOfMonths > 1 && 'min-w-[260px]')}>
        {/* Month header (only show navigation on first/last months) */}
        <div className="mb-3 flex items-center justify-between">
          {isFirst ? (
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousYear}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Previous year"
              >
                «
              </button>
              <button
                onClick={goToPreviousMonth}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Previous month"
              >
                ‹
              </button>
            </div>
          ) : (
            <div className="w-12" />
          )}
          
          <button
            onClick={goToToday}
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            {targetMonth.toLocaleString('default', { month: 'long' })} {targetMonth.getFullYear()}
          </button>
          
          {isLast ? (
            <div className="flex items-center gap-1">
              <button
                onClick={goToNextMonth}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Next month"
              >
                ›
              </button>
              <button
                onClick={goToNextYear}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Next year"
              >
                »
              </button>
            </div>
          ) : (
            <div className="w-12" />
          )}
        </div>
        
        {/* Day labels */}
        <div className={cn('grid gap-1 text-xs text-muted-foreground mb-1', showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7')}>
          {showWeekNumbers && <div className="text-center w-8" />}
          {dayLabels.map((label) => (
            <div key={label} className="text-center font-medium h-8 flex items-center justify-center">
              {label}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-1">
          {monthWeeks.map((week, weekIndex) => (
            <div key={weekIndex} className={cn('grid gap-1', showWeekNumbers ? 'grid-cols-8' : 'grid-cols-7')}>
              {showWeekNumbers && (
                <div className="text-xs text-muted-foreground flex items-center justify-center w-8">
                  {getWeekNumber(week[0].date)}
                </div>
              )}
              {week.map(({ date, isCurrentMonth }, dayIndex) => {
                const isSelected = mode === 'single' && isSameDay(date, selected)
                const isRangeStart = mode === 'range' && isSameDay(date, rangeStart)
                const isRangeEnd = mode === 'range' && isSameDay(date, rangeEnd)
                const inRange = isInSelectionRange(date)
                const disabled = checkDisabled(date)
                const isToday = isSameDay(date, today)
                const dateEvents = getDateEvents(date)
                
                return (
                  <button
                    key={dayIndex}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => mode === 'range' && setHoverDate(date)}
                    onMouseLeave={() => mode === 'range' && setHoverDate(null)}
                    className={cn(
                      'relative h-9 w-9 rounded-md text-sm flex items-center justify-center transition-colors',
                      !isCurrentMonth && 'text-muted-foreground/50',
                      isCurrentMonth && 'hover:bg-muted',
                      disabled && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                      isToday && !isSelected && 'ring-1 ring-primary',
                      inRange && !isSelected && !isRangeStart && !isRangeEnd && 'bg-primary/10',
                      (isSelected || isRangeStart || isRangeEnd) && 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {date.getDate()}
                    {/* Event dots */}
                    {dateEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dateEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: event.color || 'hsl(var(--primary))' }}
                            title={event.label}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', className)} {...props}>
      <div className={cn(
        'flex',
        numberOfMonths > 1 && 'gap-6'
      )}>
        {months.map((m, i) => renderMonth(m, i))}
      </div>
    </div>
  )
}
