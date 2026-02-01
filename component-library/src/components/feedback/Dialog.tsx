import { forwardRef, type ReactNode } from 'react'
import { Modal, type ModalProps } from './Modal'
import { Button, type ButtonProps } from '../buttons'
import { Text } from '../primitives'

export interface DialogProps extends Omit<ModalProps, 'title' | 'footer'> {
  title: ReactNode
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmVariant?: ButtonProps['variant']
  confirmColorScheme?: ButtonProps['colorScheme']
  cancelVariant?: ButtonProps['variant']
  cancelColorScheme?: ButtonProps['colorScheme']
  isConfirmLoading?: boolean
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      title,
      description,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      confirmVariant = 'solid',
      confirmColorScheme = 'primary',
      cancelVariant = 'ghost',
      cancelColorScheme = 'neutral',
      isConfirmLoading = false,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const handleCancel = () => {
      onCancel?.()
      onClose()
    }

    const handleConfirm = () => {
      onConfirm?.()
      onClose()
    }

    return (
      <Modal
        ref={ref}
        title={title}
        onClose={onClose}
        footer={
          <>
            <Button variant={cancelVariant} colorScheme={cancelColorScheme} onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={confirmVariant}
              colorScheme={confirmColorScheme}
              onClick={handleConfirm}
              isLoading={isConfirmLoading}
            >
              {confirmLabel}
            </Button>
          </>
        }
        {...props}
      >
        {description && (
          <Text color="muted" className="mb-3">
            {description}
          </Text>
        )}
        {children}
      </Modal>
    )
  }
)

Dialog.displayName = 'Dialog'
