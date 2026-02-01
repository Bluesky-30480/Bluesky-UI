import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const avatarGroupProps = [
  { name: 'max', type: 'number', default: '4', description: 'Maximum avatars to show' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar size' },
]

export default function AvatarGroupPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="AvatarGroup" description="Stacked avatars with overflow count." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.AvatarGroup max={3}>
            <BUI.Avatar name="Nova Vega" />
            <BUI.Avatar name="Avery Quinn" />
            <BUI.Avatar name="Cameron Row" />
            <BUI.Avatar name="Jordan Kai" />
            <BUI.Avatar name="Riley Harper" />
          </BUI.AvatarGroup>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={avatarGroupProps} />
      </Section>
    </BUI.Stack>
  )
}
