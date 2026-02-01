import { Textarea, Stack, Text, Divider, Box, VStack } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const textareaProps = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Textarea size' },
  { name: 'variant', type: "'default' | 'filled' | 'ghost'", default: "'default'", description: 'Visual style variant' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Show error state' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Take full width of container' },
  { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", description: 'Resize behavior' },
  { name: 'minRows', type: 'number', default: '3', description: 'Minimum number of rows' },
  { name: 'maxRows', type: 'number', default: '-', description: 'Maximum number of rows' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the textarea' },
]

export default function TextareaPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Textarea"
        description="A multi-line text input component with support for resize control and validation states."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Textarea placeholder="Enter your message..." className="w-64" />
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Textarea size="sm" placeholder="Small textarea" minRows={2} />
            <Textarea size="md" placeholder="Medium textarea" minRows={2} />
            <Textarea size="lg" placeholder="Large textarea" minRows={2} />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Textarea variant="default" placeholder="Default variant" />
            <Textarea variant="filled" placeholder="Filled variant" />
            <Textarea variant="ghost" placeholder="Ghost variant" />
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="Resize Options">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Box>
              <Text size="xs" color="muted" className="mb-1">No resize</Text>
              <Textarea resize="none" placeholder="Cannot resize" minRows={2} />
            </Box>
            <Box>
              <Text size="xs" color="muted" className="mb-1">Vertical only (default)</Text>
              <Textarea resize="vertical" placeholder="Resize vertically" minRows={2} />
            </Box>
            <Box>
              <Text size="xs" color="muted" className="mb-1">Both directions</Text>
              <Textarea resize="both" placeholder="Resize any direction" minRows={2} />
            </Box>
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="States">
        <ComponentPreview>
          <VStack spacing="md" align="stretch" className="w-64">
            <Box>
              <Text size="xs" color="muted" className="mb-1">Normal</Text>
              <Textarea placeholder="Normal textarea" minRows={2} />
            </Box>
            <Box>
              <Text size="xs" color="muted" className="mb-1">Disabled</Text>
              <Textarea placeholder="Disabled textarea" disabled minRows={2} />
            </Box>
            <Box>
              <Text size="xs" color="muted" className="mb-1">Error</Text>
              <Textarea placeholder="Error textarea" error minRows={2} />
            </Box>
          </VStack>
        </ComponentPreview>
      </Section>

      <Section title="Full Width">
        <ComponentPreview>
          <Textarea fullWidth placeholder="Full width textarea..." />
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={textareaProps} />
      </Section>
    </Stack>
  )
}
