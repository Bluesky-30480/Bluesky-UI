import React, { createContext, useContext } from 'react'
import { cn } from '../../utils/cn'

export type StepperOrientation = 'horizontal' | 'vertical'

interface StepperContextValue {
  activeStep: number
  orientation: StepperOrientation
}

const StepperContext = createContext<StepperContextValue | null>(null)

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number
  orientation?: StepperOrientation
}

export function Stepper({
  activeStep = 0,
  orientation = 'horizontal',
  className,
  children,
  ...props
}: StepperProps) {
  return (
    <StepperContext.Provider value={{ activeStep, orientation }}>
      <div
        className={cn(
          orientation === 'horizontal' ? 'flex items-center gap-4' : 'flex flex-col gap-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  )
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number
  title: string
  description?: string
}

export function Step({ index, title, description, className, ...props }: StepProps) {
  const context = useStepperContext('Step')
  const isComplete = index < context.activeStep
  const isActive = index === context.activeStep

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        context.orientation === 'horizontal' && 'flex-1',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
          isComplete && 'bg-primary text-primary-foreground border-primary',
          isActive && 'border-primary text-primary',
          !isComplete && !isActive && 'border-border text-muted-foreground'
        )}
      >
        {index + 1}
      </div>
      <div>
        <div className={cn('text-sm font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
          {title}
        </div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
    </div>
  )
}

const useStepperContext = (component: string) => {
  const context = useContext(StepperContext)
  if (!context) {
    throw new Error(`${component} must be used within Stepper`)
  }
  return context
}
