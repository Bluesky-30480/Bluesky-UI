import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const timelineProps = [
  { name: 'children', type: 'TimelineItem[]', default: '-', description: 'Timeline items' },
]

export default function TimelinePage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Timeline" description="Chronological event list." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Timeline>
            <BUI.TimelineItem title="Project created" description="Initial repository setup" timestamp="Today" />
            <BUI.TimelineItem title="Design review" description="Updated layouts and colors" timestamp="Yesterday" />
            <BUI.TimelineItem title="Launch" description="Version 1.0 released" timestamp="Last week" />
          </BUI.Timeline>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={timelineProps} />
      </Section>
    </BUI.Stack>
  )
}
