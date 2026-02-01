import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const paginationProps = [
  { name: 'children', type: 'ReactNode', default: '-', description: 'Pagination items' },
]

export default function PaginationPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Pagination" description="Navigate between pages of content." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Pagination>
            <BUI.PaginationContent>
              <BUI.PaginationItem>
                <BUI.PaginationPrevious href="#" />
              </BUI.PaginationItem>
              <BUI.PaginationItem>
                <BUI.PaginationLink href="#" isActive>
                  1
                </BUI.PaginationLink>
              </BUI.PaginationItem>
              <BUI.PaginationItem>
                <BUI.PaginationLink href="#">2</BUI.PaginationLink>
              </BUI.PaginationItem>
              <BUI.PaginationItem>
                <BUI.PaginationLink href="#">3</BUI.PaginationLink>
              </BUI.PaginationItem>
              <BUI.PaginationItem>
                <BUI.PaginationEllipsis />
              </BUI.PaginationItem>
              <BUI.PaginationItem>
                <BUI.PaginationNext href="#" />
              </BUI.PaginationItem>
            </BUI.PaginationContent>
          </BUI.Pagination>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={paginationProps} />
      </Section>
    </BUI.Stack>
  )
}
