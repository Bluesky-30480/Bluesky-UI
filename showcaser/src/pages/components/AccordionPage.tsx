import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const accordionProps = [
  { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Allow single or multiple open items' },
  { name: 'value', type: 'string | string[]', default: '-', description: 'Controlled open item(s)' },
  { name: 'defaultValue', type: 'string | string[]', default: '-', description: 'Default open item(s)' },
  { name: 'onValueChange', type: '(value: string | string[]) => void', default: '-', description: 'Open state change handler' },
]

export default function AccordionPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Accordion" description="Expandable sections for grouped content." />

      <Section title="Single">
        <ComponentPreview>
          <BUI.Accordion type="single" defaultValue="item-1">
            <BUI.AccordionItem value="item-1">
              <BUI.AccordionTrigger>What is Bluesky UI?</BUI.AccordionTrigger>
              <BUI.AccordionContent>
                Bluesky UI is a modern component library for building consistent interfaces.
              </BUI.AccordionContent>
            </BUI.AccordionItem>
            <BUI.AccordionItem value="item-2">
              <BUI.AccordionTrigger>Is it accessible?</BUI.AccordionTrigger>
              <BUI.AccordionContent>
                Components include ARIA attributes and keyboard-friendly patterns.
              </BUI.AccordionContent>
            </BUI.AccordionItem>
          </BUI.Accordion>
        </ComponentPreview>
      </Section>

      <Section title="Multiple">
        <ComponentPreview>
          <BUI.Accordion type="multiple" defaultValue={['a', 'c']}>
            <BUI.AccordionItem value="a">
              <BUI.AccordionTrigger>First item</BUI.AccordionTrigger>
              <BUI.AccordionContent>Content for the first item.</BUI.AccordionContent>
            </BUI.AccordionItem>
            <BUI.AccordionItem value="b">
              <BUI.AccordionTrigger>Second item</BUI.AccordionTrigger>
              <BUI.AccordionContent>Content for the second item.</BUI.AccordionContent>
            </BUI.AccordionItem>
            <BUI.AccordionItem value="c">
              <BUI.AccordionTrigger>Third item</BUI.AccordionTrigger>
              <BUI.AccordionContent>Content for the third item.</BUI.AccordionContent>
            </BUI.AccordionItem>
          </BUI.Accordion>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={accordionProps} />
      </Section>
    </BUI.Stack>
  )
}
