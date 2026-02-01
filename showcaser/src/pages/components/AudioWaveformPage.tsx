import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const waveformProps = [
  { name: 'bars', type: 'number', default: '24', description: 'Number of bars to render' },
]

export default function AudioWaveformPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="AudioWaveform" description="Simple waveform visualization." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.AudioWaveform />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={waveformProps} />
      </Section>
    </BUI.Stack>
  )
}
