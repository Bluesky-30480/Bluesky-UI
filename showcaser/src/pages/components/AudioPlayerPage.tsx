import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const audioProps = [
  { name: 'src', type: 'string', default: '-', description: 'Audio source URL' },
  { name: 'rounded', type: 'boolean', default: 'true', description: 'Rounded corners' },
]

export default function AudioPlayerPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="AudioPlayer" description="HTML5 audio player wrapper." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.AudioPlayer src="https://www.w3schools.com/html/horse.mp3" />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={audioProps} />
      </Section>
    </BUI.Stack>
  )
}
