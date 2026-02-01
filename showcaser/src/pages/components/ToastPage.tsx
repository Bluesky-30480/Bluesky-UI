import { ToastProvider, useToast, Button, Stack, Box, Text } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const toastProviderProps = [
  { name: 'position', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", description: 'Toast placement on screen' },
  { name: 'defaultDuration', type: 'number', default: '4000', description: 'Default auto-dismiss duration in ms' },
  { name: 'maxToasts', type: 'number', default: '5', description: 'Maximum number of visible toasts' },
]

const toastOptionsProps = [
  { name: 'title', type: 'ReactNode', description: 'Toast title' },
  { name: 'description', type: 'ReactNode', description: 'Toast description' },
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'error' | 'info'", default: "'default'", description: 'Toast variant' },
  { name: 'duration', type: 'number', description: 'Custom duration in ms (0 = persistent)' },
]

function ToastDemo() {
  const { toast, clear } = useToast()

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} wrap>
        <Button
          variant="soft"
          onClick={() =>
            toast({
              title: 'Update available',
              description: 'Restart to apply the latest changes.',
            })
          }
        >
          Default
        </Button>
        <Button
          variant="soft"
          colorScheme="success"
          onClick={() =>
            toast({
              title: 'Saved',
              description: 'Your changes have been saved.',
              variant: 'success',
            })
          }
        >
          Success
        </Button>
        <Button
          variant="soft"
          colorScheme="warning"
          onClick={() =>
            toast({
              title: 'Review required',
              description: 'Please verify the new settings.',
              variant: 'warning',
            })
          }
        >
          Warning
        </Button>
        <Button
          variant="soft"
          colorScheme="error"
          onClick={() =>
            toast({
              title: 'Upload failed',
              description: 'Try again or contact support.',
              variant: 'error',
            })
          }
        >
          Error
        </Button>
        <Button
          variant="soft"
          colorScheme="secondary"
          onClick={() =>
            toast({
              title: 'Reminder',
              description: 'Your session will expire in 5 minutes.',
              variant: 'info',
            })
          }
        >
          Info
        </Button>
      </Stack>

      <Stack direction="row" gap={2} wrap>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Persistent toast',
              description: 'This toast stays until dismissed.',
              duration: 0,
            })
          }
        >
          Persistent
        </Button>
        <Button variant="outline" colorScheme="neutral" onClick={clear}>
          Clear all
        </Button>
      </Stack>
    </Stack>
  )
}

export function ToastPage() {
  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Toast"
        description="Toasts are brief, non-blocking notifications that appear temporarily to provide feedback."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<ToastProvider>
  <ToastDemo />
</ToastProvider>`}
        >
          <ToastProvider>
            <ToastDemo />
          </ToastProvider>
        </ComponentPreview>
      </Section>

      <Section title="Position">
        <ComponentPreview
          code={`<ToastProvider position="bottom-left">
  <ToastDemo />
</ToastProvider>`}
        >
          <ToastProvider position="bottom-left">
            <Stack gap={3}>
              <Text className="text-sm text-muted">
                This demo uses the bottom-left position.
              </Text>
              <ToastDemo />
            </Stack>
          </ToastProvider>
        </ComponentPreview>
      </Section>

      <Section title="ToastProvider Props">
        <PropsTable props={toastProviderProps} />
      </Section>

      <Section title="Toast Options">
        <PropsTable props={toastOptionsProps} />
      </Section>
    </Box>
  )
}

export default ToastPage