import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const tabsProps = [
  { name: 'value', type: 'string', default: '-', description: 'Controlled active tab value' },
  { name: 'defaultValue', type: 'string', default: '-', description: 'Default active tab value' },
  { name: 'onValueChange', type: '(value: string) => void', default: '-', description: 'Active tab change handler' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction' },
]

export default function TabsPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Tabs" description="Switch between views using a tab list." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Tabs defaultValue="overview">
            <BUI.TabsList>
              <BUI.TabsTrigger value="overview">Overview</BUI.TabsTrigger>
              <BUI.TabsTrigger value="details">Details</BUI.TabsTrigger>
              <BUI.TabsTrigger value="activity">Activity</BUI.TabsTrigger>
            </BUI.TabsList>
            <BUI.TabsContent value="overview">
              <BUI.Text size="sm" color="muted">Overview content</BUI.Text>
            </BUI.TabsContent>
            <BUI.TabsContent value="details">
              <BUI.Text size="sm" color="muted">Details content</BUI.Text>
            </BUI.TabsContent>
            <BUI.TabsContent value="activity">
              <BUI.Text size="sm" color="muted">Activity content</BUI.Text>
            </BUI.TabsContent>
          </BUI.Tabs>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={tabsProps} />
      </Section>
    </BUI.Stack>
  )
}
