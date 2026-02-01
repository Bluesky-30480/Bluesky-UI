import { forwardRef, useCallback, useState } from 'react'
import { Button, type ButtonProps } from './Button'
import { cn } from '../../utils/cn'

export interface ToggleButtonProps extends ButtonProps {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      pressed: pressedProp,
      defaultPressed = false,
      onPressedChange,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = pressedProp !== undefined
    const [internalPressed, setInternalPressed] = useState(!!defaultPressed)
    const pressed = isControlled ? !!pressedProp : internalPressed

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const next = !pressed
        if (!isControlled) {
          setInternalPressed(next)
        }
        onPressedChange?.(next)
        onClick?.(event)
      },
      [isControlled, onClick, onPressedChange, pressed]
    )

    return (
      <Button
        ref={ref}
        aria-pressed={pressed}
        data-pressed={pressed}
        onClick={handleClick}
        className={cn(
          pressed && 'ring-2 ring-primary/30',
          className
        )}
        {...props}
      />
    )
  }
)

ToggleButton.displayName = 'ToggleButton'
