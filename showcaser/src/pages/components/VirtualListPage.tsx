import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const virtualListProps = [
  { name: 'items', type: 'T[]', default: '-', description: 'Items to render' },
  { name: 'itemHeight', type: 'number', default: '-', description: 'Row height in pixels' },
  { name: 'height', type: 'number', default: '-', description: 'Container height in pixels' },
  { name: 'renderItem', type: '(item, index) => ReactNode', default: '-', description: 'Render function' },
]

const items = Array.from({ length: 20 }).map((_, index) => `Item ${index + 1}`)

export default function VirtualListPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="VirtualList" description="Scrollable list optimized for large datasets." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.VirtualList
            items={items}
            itemHeight={40}
            height={200}
            renderItem={(item) => (
              <BUI.Box className="w-full px-3 py-2 border-b border-border">
                <BUI.Text size="sm">{item}</BUI.Text>
              </BUI.Box>
            )}
          />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={virtualListProps} />
      </Section>
    </BUI.Stack>
  )
}
