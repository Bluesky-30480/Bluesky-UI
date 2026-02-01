import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const cardProps = [
  { name: 'children', type: 'ReactNode', default: '-', description: 'Card content' },
]

export default function CardPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Card" description="A container for grouping related content." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Card className="max-w-sm">
            <BUI.CardHeader>
              <BUI.CardTitle>Project Status</BUI.CardTitle>
            </BUI.CardHeader>
            <BUI.CardContent>
              <BUI.Text size="sm" color="muted">
                Shipping v2.1 this week with improved performance and new UI.
              </BUI.Text>
            </BUI.CardContent>
            <BUI.CardFooter>
              <BUI.Button size="sm">View details</BUI.Button>
            </BUI.CardFooter>
          </BUI.Card>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={cardProps} />
      </Section>
    </BUI.Stack>
  )
}
