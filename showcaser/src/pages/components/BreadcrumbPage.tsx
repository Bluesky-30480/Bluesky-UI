import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const breadcrumbProps = [
  { name: 'children', type: 'ReactNode', default: '-', description: 'Breadcrumb items and separators' },
]

export default function BreadcrumbPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Breadcrumb" description="Show the page hierarchy and navigation path." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Breadcrumb>
            <BUI.BreadcrumbList>
              <BUI.BreadcrumbItem>
                <BUI.BreadcrumbLink href="#">Home</BUI.BreadcrumbLink>
              </BUI.BreadcrumbItem>
              <BUI.BreadcrumbSeparator>/</BUI.BreadcrumbSeparator>
              <BUI.BreadcrumbItem>
                <BUI.BreadcrumbLink href="#">Library</BUI.BreadcrumbLink>
              </BUI.BreadcrumbItem>
              <BUI.BreadcrumbSeparator>/</BUI.BreadcrumbSeparator>
              <BUI.BreadcrumbItem>
                <BUI.BreadcrumbLink isCurrent>Components</BUI.BreadcrumbLink>
              </BUI.BreadcrumbItem>
            </BUI.BreadcrumbList>
          </BUI.Breadcrumb>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={breadcrumbProps} />
      </Section>
    </BUI.Stack>
  )
}
