import { Stack, Heading, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const headingProps = [
  { name: 'as', type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", defaultValue: "'h2'", description: 'The heading level to render' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'", defaultValue: 'auto (based on level)', description: 'Visual size of the heading' },
  { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'", defaultValue: "'bold'", description: 'Font weight' },
  { name: 'color', type: "'default' | 'muted' | 'primary'", defaultValue: "'default'", description: 'Text color' },
  { name: 'align', type: "'left' | 'center' | 'right'", defaultValue: 'undefined', description: 'Text alignment' },
  { name: 'truncate', type: 'boolean', defaultValue: 'false', description: 'Whether to truncate with ellipsis' },
]

export function HeadingPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Heading"
        description="A component for rendering semantic headings (h1-h6) with consistent typography."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Stack spacing="md">
            <Heading as="h1">Heading 1</Heading>
            <Heading as="h2">Heading 2</Heading>
            <Heading as="h3">Heading 3</Heading>
            <Heading as="h4">Heading 4</Heading>
            <Heading as="h5">Heading 5</Heading>
            <Heading as="h6">Heading 6</Heading>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Custom Sizes">
        <ComponentPreview>
          <Stack spacing="md">
            {(['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'] as const).map((size) => (
              <Heading key={size} as="h2" size={size}>
                Size: {size}
              </Heading>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Weights">
        <ComponentPreview>
          <Stack spacing="md">
            {(['normal', 'medium', 'semibold', 'bold', 'extrabold'] as const).map((weight) => (
              <Heading key={weight} as="h3" weight={weight}>
                Weight: {weight}
              </Heading>
            ))}
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Colors">
        <ComponentPreview>
          <Stack spacing="md">
            <Heading as="h3" color="default">Default color heading</Heading>
            <Heading as="h3" color="muted">Muted color heading</Heading>
            <Heading as="h3" color="primary">Primary color heading</Heading>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Alignment">
        <ComponentPreview>
          <Stack spacing="md" className="w-full">
            <Heading as="h3" align="left">Left aligned</Heading>
            <Heading as="h3" align="center">Center aligned</Heading>
            <Heading as="h3" align="right">Right aligned</Heading>
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={headingProps} />
      </Section>
    </Stack>
  )
}
