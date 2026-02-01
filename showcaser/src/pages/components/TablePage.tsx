import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const tableProps = [
  { name: 'children', type: 'ReactNode', default: '-', description: 'Table structure' },
]

export default function TablePage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Table" description="Basic table structure with head and body." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Table>
            <BUI.TableHeader>
              <BUI.TableRow>
                <BUI.TableHead>Name</BUI.TableHead>
                <BUI.TableHead>Status</BUI.TableHead>
                <BUI.TableHead>Role</BUI.TableHead>
              </BUI.TableRow>
            </BUI.TableHeader>
            <BUI.TableBody>
              <BUI.TableRow>
                <BUI.TableCell>Nova Vega</BUI.TableCell>
                <BUI.TableCell>Active</BUI.TableCell>
                <BUI.TableCell>Designer</BUI.TableCell>
              </BUI.TableRow>
              <BUI.TableRow>
                <BUI.TableCell>Avery Quinn</BUI.TableCell>
                <BUI.TableCell>Offline</BUI.TableCell>
                <BUI.TableCell>Engineer</BUI.TableCell>
              </BUI.TableRow>
            </BUI.TableBody>
          </BUI.Table>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={tableProps} />
      </Section>
    </BUI.Stack>
  )
}
