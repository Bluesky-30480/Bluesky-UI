import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const treeProps = [
  { name: 'data', type: 'TreeNode[]', default: '-', description: 'Tree data' },
]

const data = [
  {
    id: 'root',
    label: 'Workspace',
    children: [
      { id: '1', label: 'Design' },
      { id: '2', label: 'Engineering', children: [
        { id: '2-1', label: 'Frontend' },
        { id: '2-2', label: 'Backend' },
      ] },
      { id: '3', label: 'Marketing' },
    ],
  },
]

export default function TreePage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Tree" description="Hierarchical list with expandable nodes." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Tree data={data} />
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={treeProps} />
      </Section>
    </BUI.Stack>
  )
}
