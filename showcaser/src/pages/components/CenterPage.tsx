import { Stack, Heading, Text, Center, Box, Divider } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const centerProps = [
  { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'Whether the center should be inline' },
  { name: 'centerText', type: 'boolean', defaultValue: 'false', description: 'Whether to also center text within' },
]

export function CenterPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="Center"
        description="A utility component that centers its children both horizontally and vertically."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <Center className="h-48 bg-muted/30 rounded-md">
            <Box padding="md" background="surface" rounded="md" border>
              <Text>I am centered!</Text>
            </Box>
          </Center>
        </ComponentPreview>
      </Section>

      <Section title="Inline Center">
        <ComponentPreview>
          <Stack direction="row" spacing="md">
            <Center inline className="w-24 h-24 bg-muted/30 rounded-md">
              <Text size="sm">1</Text>
            </Center>
            <Center inline className="w-24 h-24 bg-muted/30 rounded-md">
              <Text size="sm">2</Text>
            </Center>
            <Center inline className="w-24 h-24 bg-muted/30 rounded-md">
              <Text size="sm">3</Text>
            </Center>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Center Text">
        <ComponentPreview>
          <Center centerText className="h-32 bg-muted/30 rounded-md">
            <Stack spacing="xs">
              <Heading as="h4" size="lg">Centered Heading</Heading>
              <Text color="muted">This text is also centered.</Text>
            </Stack>
          </Center>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={centerProps} />
      </Section>
    </Stack>
  )
}
