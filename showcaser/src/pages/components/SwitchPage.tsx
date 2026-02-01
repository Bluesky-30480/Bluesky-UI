import { useState } from 'react'
import { Switch, Stack, Text, Divider, Box, VStack, HStack } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const switchProps = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Switch size' },
  { name: 'label', type: 'ReactNode', default: '-', description: 'Label text' },
  { name: 'description', type: 'ReactNode', default: '-', description: 'Description text below label' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'showLabels', type: 'boolean', default: 'false', description: 'Show ON/OFF labels inside switch' },
  { name: 'checked', type: 'boolean', default: '-', description: 'Controlled checked state' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the switch' },
]

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)

  return (
    <Stack spacing="xl">
      <PageHeader
        title="Switch"
        description="A toggle switch component for binary on/off settings with smooth animations."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Switch 
            label="Enable feature" 
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <HStack spacing="xl" align="center">
            <Switch size="sm" label="Small" defaultChecked />
            <Switch size="md" label="Medium" defaultChecked />
            <Switch size="lg" label="Large" defaultChecked />
          </HStack>
        </ComponentPreview>
      </Section>

      <Section title="With Description">
        <ComponentPreview>
          <VStack spacing="lg" align="start">
            <Switch 
              label="Dark mode"
              description="Use dark theme across the application"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <Switch 
              label="Push notifications"
              description="Receive push notifications on your device"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="With Labels">
        <ComponentPreview>
          <VStack spacing="md" align="start">
            <Switch size="md" showLabels defaultChecked label="With ON/OFF labels" />
            <Switch size="lg" showLabels label="Large with labels" />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="States">
        <ComponentPreview>
          <HStack spacing="xl" align="center">
            <Switch label="Off" />
            <Switch label="On" defaultChecked />
            <Switch label="Disabled Off" disabled />
            <Switch label="Disabled On" disabled defaultChecked />
            <Switch label="Error" error />
          </HStack>
        </ComponentPreview>
      </Section>

      <Section title="Settings Example">
        <ComponentPreview>
          <Box className="w-80 p-4 rounded-lg border border-border bg-surface">
            <Text weight="semibold" className="mb-4">Notification Settings</Text>
            <VStack spacing="md" align="stretch">
              <HStack justify="between" align="center">
                <VStack spacing="xs" align="start">
                  <Text size="sm">Email notifications</Text>
                  <Text size="xs" color="muted">Receive daily digest</Text>
                </VStack>
                <Switch size="sm" defaultChecked />
              </HStack>
              <HStack justify="between" align="center">
                <VStack spacing="xs" align="start">
                  <Text size="sm">Push notifications</Text>
                  <Text size="xs" color="muted">Real-time alerts</Text>
                </VStack>
                <Switch size="sm" />
              </HStack>
              <HStack justify="between" align="center">
                <VStack spacing="xs" align="start">
                  <Text size="sm">SMS notifications</Text>
                  <Text size="xs" color="muted">Critical alerts only</Text>
                </VStack>
                <Switch size="sm" defaultChecked />
              </HStack>
            </VStack>
          </Box>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={switchProps} />
      </Section>
    </Stack>
  )
}
