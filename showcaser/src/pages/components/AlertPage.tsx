import { useState } from 'react'
import { Alert, Stack, Text, Box, Button } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const alertProps = [
  { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Alert type/variant' },
  { name: 'title', type: 'ReactNode', description: 'Alert title' },
  { name: 'description', type: 'ReactNode', description: 'Alert description text' },
  { name: 'icon', type: 'ReactNode', description: 'Custom icon (overrides default)' },
  { name: 'hideIcon', type: 'boolean', default: 'false', description: 'Hide the icon' },
  { name: 'closable', type: 'boolean', default: 'false', description: 'Show close button' },
  { name: 'onClose', type: '() => void', description: 'Callback when close button is clicked' },
  { name: 'solid', type: 'boolean', default: 'false', description: 'Use solid background style' },
]

export function AlertPage() {
  const [showDismissable, setShowDismissable] = useState(true)

  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Alert"
        description="Alerts display important messages to users, such as success notifications, warnings, errors, or informational notes."
      />

      <Section title="Basic Usage">
        <ComponentPreview
          code={`<Alert 
  title="Information" 
  description="This is an informational alert message."
/>`}
        >
          <Alert
            title="Information"
            description="This is an informational alert message."
          />
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Alert variant="info" title="Info" description="This is an info alert." />
  <Alert variant="success" title="Success" description="Operation completed successfully." />
  <Alert variant="warning" title="Warning" description="Please review before continuing." />
  <Alert variant="error" title="Error" description="Something went wrong." />
</Stack>`}
        >
          <Stack gap={3}>
            <Alert variant="info" title="Info" description="This is an info alert - use it for neutral information." />
            <Alert variant="success" title="Success" description="Operation completed successfully!" />
            <Alert variant="warning" title="Warning" description="Please review the changes before continuing." />
            <Alert variant="error" title="Error" description="Something went wrong. Please try again." />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Solid Style">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Alert variant="info" solid title="Info" description="Solid style alert." />
  <Alert variant="success" solid title="Success" description="Solid style alert." />
  <Alert variant="warning" solid title="Warning" description="Solid style alert." />
  <Alert variant="error" solid title="Error" description="Solid style alert." />
</Stack>`}
        >
          <Stack gap={3}>
            <Alert variant="info" solid title="Info" description="Solid style provides more emphasis." />
            <Alert variant="success" solid title="Success" description="Great job! Your changes have been saved." />
            <Alert variant="warning" solid title="Warning" description="Your session will expire in 5 minutes." />
            <Alert variant="error" solid title="Error" description="Unable to connect to the server." />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Title Only">
        <ComponentPreview
          code={`<Stack gap={3}>
  <Alert variant="info" title="This is an info-only alert" />
  <Alert variant="success" title="Changes saved successfully" />
</Stack>`}
        >
          <Stack gap={3}>
            <Alert variant="info" title="This is a title-only alert" />
            <Alert variant="success" title="Changes saved successfully" />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Description Only">
        <ComponentPreview
          code={`<Alert 
  variant="warning" 
  description="You have unsaved changes that will be lost."
/>`}
        >
          <Alert
            variant="warning"
            description="You have unsaved changes that will be lost if you navigate away."
          />
        </ComponentPreview>
      </Section>

      <Section title="Without Icon">
        <ComponentPreview
          code={`<Alert 
  hideIcon
  title="No Icon"
  description="This alert has the icon hidden."
/>`}
        >
          <Alert
            hideIcon
            title="No Icon"
            description="This alert has the icon hidden for a cleaner look."
          />
        </ComponentPreview>
      </Section>

      <Section title="Closable">
        <ComponentPreview
          code={`const [show, setShow] = useState(true)

{show && (
  <Alert
    variant="info"
    title="Dismissable Alert"
    description="Click the X to dismiss this alert."
    closable
    onClose={() => setShow(false)}
  />
)}

<Button onClick={() => setShow(true)}>Show Alert</Button>`}
        >
          <Stack gap={3}>
            {showDismissable ? (
              <Alert
                variant="info"
                title="Dismissable Alert"
                description="Click the X button to dismiss this alert."
                closable
                onClose={() => setShowDismissable(false)}
              />
            ) : (
              <Box className="p-4 border border-dashed border-border rounded-lg text-center">
                <Text className="text-muted">Alert dismissed</Text>
              </Box>
            )}
            <Box>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDismissable(true)}
                disabled={showDismissable}
              >
                Reset Alert
              </Button>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="With Custom Content">
        <ComponentPreview
          code={`<Alert variant="warning" title="Subscription Expiring">
  <Text className="text-sm mt-2">
    Your subscription expires in 3 days.
  </Text>
  <Stack direction="row" gap={2} className="mt-3">
    <Button size="sm">Renew Now</Button>
    <Button size="sm" variant="ghost">Remind Later</Button>
  </Stack>
</Alert>`}
        >
          <Alert variant="warning" title="Subscription Expiring Soon">
            <Text className="text-sm mt-2">
              Your subscription will expire in 3 days. Renew now to avoid interruption.
            </Text>
            <Stack direction="row" gap={2} className="mt-3">
              <Button size="sm">Renew Now</Button>
              <Button size="sm" variant="ghost">Remind Later</Button>
            </Stack>
          </Alert>
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={alertProps} />
      </Section>
    </Box>
  )
}

export default AlertPage
