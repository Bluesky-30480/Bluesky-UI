import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const linkProps = [
  { name: 'variant', type: "'primary' | 'neutral' | 'muted' | 'success' | 'warning' | 'error'", default: "'primary'", description: 'Visual color variant' },
  { name: 'underline', type: 'boolean', default: 'false', description: 'Always underline the link' },
  { name: 'isExternal', type: 'boolean', default: 'false', description: 'Open in new tab and add rel attributes' },
]

export default function LinkPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader
        title="Link"
        description="A styled anchor component with variants and external link support."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Link href="https://bsky.app" isExternal>
            Visit Bluesky
          </BUI.Link>
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="center">
            <BUI.Link href="#" variant="primary">Primary</BUI.Link>
            <BUI.Link href="#" variant="neutral">Neutral</BUI.Link>
            <BUI.Link href="#" variant="muted">Muted</BUI.Link>
            <BUI.Link href="#" variant="success">Success</BUI.Link>
            <BUI.Link href="#" variant="warning">Warning</BUI.Link>
            <BUI.Link href="#" variant="error">Error</BUI.Link>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Underline">
        <ComponentPreview>
          <BUI.HStack spacing="lg" align="center">
            <BUI.Link href="#" underline>Always Underlined</BUI.Link>
            <BUI.Link href="#">Hover Underline</BUI.Link>
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={linkProps} />
      </Section>
    </BUI.Stack>
  )
}
