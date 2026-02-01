import { Spinner, Stack, Text, Box } from 'component-library'
import { PageHeader, Section, ComponentPreview, PropsTable } from '../../components/docs'

const spinnerProps = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the spinner' },
  { name: 'variant', type: "'default' | 'primary' | 'secondary' | 'white'", default: "'default'", description: 'Color variant' },
  { name: 'label', type: 'string', description: 'Accessible label for screen readers' },
  { name: 'showLabel', type: 'boolean', default: 'false', description: 'Show the label visually' },
]

export function SpinnerPage() {
  return (
    <Box className="max-w-4xl">
      <PageHeader
        title="Spinner"
        description="A loading spinner component to indicate that content is being loaded or an action is being processed."
      />

      <Section title="Basic Usage">
        <ComponentPreview code={`<Spinner />`}>
          <Spinner />
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview
          code={`<Stack direction="row" gap={4} align="center">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
  <Spinner size="xl" />
</Stack>`}
        >
          <Stack direction="row" gap={4} align="center">
            <Box className="text-center">
              <Spinner size="xs" />
              <Text className="text-xs text-muted mt-2">xs</Text>
            </Box>
            <Box className="text-center">
              <Spinner size="sm" />
              <Text className="text-xs text-muted mt-2">sm</Text>
            </Box>
            <Box className="text-center">
              <Spinner size="md" />
              <Text className="text-xs text-muted mt-2">md</Text>
            </Box>
            <Box className="text-center">
              <Spinner size="lg" />
              <Text className="text-xs text-muted mt-2">lg</Text>
            </Box>
            <Box className="text-center">
              <Spinner size="xl" />
              <Text className="text-xs text-muted mt-2">xl</Text>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview
          code={`<Stack direction="row" gap={4} align="center">
  <Spinner variant="default" />
  <Spinner variant="primary" />
  <Spinner variant="secondary" />
</Stack>`}
        >
          <Stack direction="row" gap={6} align="center">
            <Box className="text-center">
              <Spinner variant="default" size="lg" />
              <Text className="text-xs text-muted mt-2">default</Text>
            </Box>
            <Box className="text-center">
              <Spinner variant="primary" size="lg" />
              <Text className="text-xs text-muted mt-2">primary</Text>
            </Box>
            <Box className="text-center">
              <Spinner variant="secondary" size="lg" />
              <Text className="text-xs text-muted mt-2">secondary</Text>
            </Box>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="With Text">
        <ComponentPreview
          code={`<Stack direction="row" gap={3} align="center">
  <Spinner size="sm" />
  <Text>Loading...</Text>
</Stack>`}
        >
          <Stack direction="row" gap={3} align="center">
            <Spinner size="sm" />
            <Text>Loading...</Text>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Accessibility">
        <ComponentPreview
          code={`<Spinner label="Loading data, please wait" />`}
        >
          <Stack gap={3}>
            <Spinner label="Loading data, please wait" />
            <Text className="text-sm text-muted">
              The spinner has an accessible label for screen readers
            </Text>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Props">
        <PropsTable props={spinnerProps} />
      </Section>
    </Box>
  )
}

export default SpinnerPage
