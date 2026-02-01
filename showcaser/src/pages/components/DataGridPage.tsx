import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const dataGridProps = [
  { name: 'columns', type: 'DataGridColumn[]', default: '-', description: 'Grid columns' },
  { name: 'data', type: 'object[]', default: '-', description: 'Row data' },
]

const rows = [
  { name: 'Nova Vega', role: 'Designer', status: 'Active' },
  { name: 'Avery Quinn', role: 'Engineer', status: 'Offline' },
  { name: 'Cameron Row', role: 'Product', status: 'Active' },
]

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
]

export default function DataGridPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="DataGrid" description="A structured grid wrapper for tabular data." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.DataGrid columns={columns} data={rows} />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={dataGridProps} />
      </Section>
    </BUI.Stack>
  )
}
