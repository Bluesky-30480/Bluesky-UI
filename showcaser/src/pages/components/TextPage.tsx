import { Stack, Text, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const textProps = [
  { name: 'as', type: "'p' | 'span' | 'label' | 'small' | 'strong' | 'em' | 'code' | 'pre' | 'mark' | 'del' | 'ins' | 'sub' | 'sup'", defaultValue: "'p'", description: 'The HTML element to render' },
  { name: 'size', type: "'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'", defaultValue: "'base'", description: 'Text size' },
  { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold'", defaultValue: "'normal'", description: 'Font weight' },
  { name: 'color', type: "'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error'", defaultValue: "'default'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right' | 'justify'", defaultValue: 'undefined', description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', defaultValue: 'false', description: 'Whether to truncate text with ellipsis' },
  { name: 'lineClamp', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: 'undefined', description: 'Limit text to a number of lines' },
]

export function TextPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Text"
        description="A component for rendering text with consistent typography styles."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Text>This is a paragraph of text using the Text component.</Text>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <Stack spacing="sm">
            {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const).map((size) => (
              <Text key={size} size={size}>
                Text size: {size}
              </Text>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Weights">
        <ComponentPreview>
          <Stack spacing="sm">
            {(['normal', 'medium', 'semibold', 'bold'] as const).map((weight) => (
              <Text key={weight} weight={weight}>
                Font weight: {weight}
              </Text>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Colors">
        <ComponentPreview>
          <Stack spacing="sm">
            {(['default', 'muted', 'primary', 'success', 'warning', 'error'] as const).map((color) => (
              <Text key={color} color={color}>
                Text color: {color}
              </Text>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Alignment">
        <ComponentPreview>
          <Stack spacing="md" className="w-full">
            {(['left', 'center', 'right', 'justify'] as const).map((align) => (
              <div key={align} className="bg-muted/30 rounded-md p-2">
                <Text align={align}>
                  Text alignment: {align}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Text>
              </div>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Truncation">
        <ComponentPreview>
          <Stack spacing="md" className="max-w-md">
            <Text truncate>
              This is a long text that will be truncated with an ellipsis when it overflows its container.
            </Text>
            <Text lineClamp={2}>
              This text is clamped to 2 lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Semantic Elements">
        <ComponentPreview>
          <Stack spacing="md">
            <Text as="span">Rendered as span</Text>
            <Text as="strong">Rendered as strong</Text>
            <Text as="em">Rendered as em (italic)</Text>
            <Text as="code" className="bg-muted px-1 rounded">Rendered as code</Text>
            <Text as="small">Rendered as small</Text>
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={textProps} />
      </Section>
    </Stack>
  )
}
