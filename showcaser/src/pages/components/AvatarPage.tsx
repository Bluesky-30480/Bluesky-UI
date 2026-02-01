import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const avatarProps = [
  { name: 'src', type: 'string', default: '-', description: 'Image source URL' },
  { name: 'name', type: 'string', default: '-', description: 'Name for initials fallback' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size' },
  { name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", default: '-', description: 'Status indicator' },
]

export default function AvatarPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Avatar" description="User avatar with image or initials." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.HStack spacing="md">
            <BUI.Avatar name="Nova Vega" />
            <BUI.Avatar name="Avery Quinn" status="online" />
            <BUI.Avatar name="Cameron Row" status="busy" />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <BUI.HStack spacing="md" align="center">
            <BUI.Avatar name="XS" size="xs" />
            <BUI.Avatar name="SM" size="sm" />
            <BUI.Avatar name="MD" size="md" />
            <BUI.Avatar name="LG" size="lg" />
            <BUI.Avatar name="XL" size="xl" />
          </BUI.HStack>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={avatarProps} />
      </Section>
    </BUI.Stack>
  )
}
