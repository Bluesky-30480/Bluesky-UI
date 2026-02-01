import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const videoProps = [
  { name: 'src', type: 'string', default: '-', description: 'Video source URL' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Rounded corners' },
]

export default function VideoPlayerPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="VideoPlayer" description="HTML5 video player wrapper." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={videoProps} />
      </Section>
    </BUI.Stack>
  )
}
