import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const imageProps = [
  { name: 'src', type: 'string', default: '-', description: 'Image source URL' },
  { name: 'alt', type: 'string', default: '-', description: 'Alt text' },
  { name: 'aspect', type: "'square' | 'video' | 'wide'", default: "'square'", description: 'Aspect ratio' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Rounded corners' },
]

export default function ImagePage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Image" description="Responsive image with aspect ratio helpers." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Image src="https://picsum.photos/seed/bui/600/400" alt="Sample" aspect="video" />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={imageProps} />
      </Section>
    </BUI.Stack>
  )
}
