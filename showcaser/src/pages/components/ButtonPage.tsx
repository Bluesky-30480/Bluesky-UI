import { Stack, Button, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'
import { Plus, ArrowRight, Download, Trash2 } from 'lucide-react'

const buttonProps = [
  { name: 'variant', type: "'solid' | 'outline' | 'ghost' | 'soft' | 'link'", defaultValue: "'solid'", description: 'Visual style of the button' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Size of the button' },
  { name: 'colorScheme', type: "'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'", defaultValue: "'primary'", description: 'Color scheme' },
  { name: 'leftIcon', type: 'ReactNode', defaultValue: 'undefined', description: 'Icon on the left side' },
  { name: 'rightIcon', type: 'ReactNode', defaultValue: 'undefined', description: 'Icon on the right side' },
  { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Show loading spinner' },
  { name: 'loadingText', type: 'string', defaultValue: 'undefined', description: 'Text to show when loading' },
  { name: 'isFullWidth', type: 'boolean', defaultValue: 'false', description: 'Button fills container width' },
  { name: 'isDisabled', type: 'boolean', defaultValue: 'false', description: 'Disable the button' },
]

export function ButtonPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Button"
        description="An interactive element for triggering actions, with multiple variants and states."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Button>Click me</Button>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview>
          <Stack direction="row" spacing="md" wrap>
            <Button variant="solid">Solid</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="link">Link</Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Color Schemes">
        <ComponentPreview>
          <Stack spacing="md">
            <Stack direction="row" spacing="sm" wrap>
              <Button colorScheme="primary">Primary</Button>
              <Button colorScheme="secondary">Secondary</Button>
              <Button colorScheme="success">Success</Button>
              <Button colorScheme="warning">Warning</Button>
              <Button colorScheme="error">Error</Button>
              <Button colorScheme="neutral">Neutral</Button>
            </Stack>
            
            <Stack direction="row" spacing="sm" wrap>
              <Button variant="outline" colorScheme="primary">Primary</Button>
              <Button variant="outline" colorScheme="success">Success</Button>
              <Button variant="outline" colorScheme="error">Error</Button>
            </Stack>
            
            <Stack direction="row" spacing="sm" wrap>
              <Button variant="soft" colorScheme="primary">Primary</Button>
              <Button variant="soft" colorScheme="success">Success</Button>
              <Button variant="soft" colorScheme="error">Error</Button>
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <Stack direction="row" spacing="md" align="center" wrap>
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="With Icons">
        <ComponentPreview>
          <Stack direction="row" spacing="md" wrap>
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Item</Button>
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Continue</Button>
            <Button leftIcon={<Download className="w-4 h-4" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Download
            </Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Loading State">
        <ComponentPreview>
          <Stack direction="row" spacing="md" wrap>
            <Button isLoading>Loading</Button>
            <Button isLoading loadingText="Saving...">Save</Button>
            <Button isLoading variant="outline">Loading</Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Disabled State">
        <ComponentPreview>
          <Stack direction="row" spacing="md" wrap>
            <Button isDisabled>Disabled</Button>
            <Button isDisabled variant="outline">Disabled</Button>
            <Button isDisabled variant="ghost">Disabled</Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Full Width">
        <ComponentPreview>
          <Stack spacing="md" className="max-w-md">
            <Button isFullWidth>Full Width Button</Button>
            <Button isFullWidth variant="outline">Full Width Outline</Button>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Practical Examples">
        <ComponentPreview>
          <Stack spacing="md">
            <Stack direction="row" spacing="sm">
              <Button variant="ghost" colorScheme="neutral">Cancel</Button>
              <Button colorScheme="primary">Save Changes</Button>
            </Stack>
            
            <Stack direction="row" spacing="sm">
              <Button variant="soft" colorScheme="error" leftIcon={<Trash2 className="w-4 h-4" />}>
                Delete
              </Button>
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={buttonProps} />
      </Section>
    </Stack>
  )
}
