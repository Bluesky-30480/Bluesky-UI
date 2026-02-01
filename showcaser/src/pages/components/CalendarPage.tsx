import { useState } from 'react'
import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const calendarProps = [
  { name: 'month', type: 'Date', default: 'new Date()', description: 'Month to display' },
  { name: 'selected', type: 'Date', default: '-', description: 'Selected date' },
  { name: 'onSelect', type: '(date: Date) => void', default: '-', description: 'Selection handler' },
]

export default function CalendarPage() {
  const [selected, setSelected] = useState<Date | undefined>(new Date())

  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Calendar" description="Simple month calendar with selectable days." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Calendar selected={selected} onSelect={setSelected} />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={calendarProps} />
      </Section>
    </BUI.Stack>
  )
}
