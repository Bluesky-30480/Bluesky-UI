import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const stepperProps = [
  { name: 'activeStep', type: 'number', default: '0', description: 'Current active step index' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Stepper direction' },
]

export default function StepperPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Stepper" description="Show progress through a multi-step process." />

      <Section title="Horizontal">
        <ComponentPreview>
          <BUI.Stepper activeStep={1}>
            <BUI.Step index={0} title="Details" description="Basic info" />
            <BUI.Step index={1} title="Billing" description="Payment method" />
            <BUI.Step index={2} title="Confirm" description="Review" />
          </BUI.Stepper>
        </ComponentPreview>
      </Section>

      <Section title="Vertical">
        <ComponentPreview>
          <BUI.Stepper activeStep={2} orientation="vertical">
            <BUI.Step index={0} title="Step One" description="First action" />
            <BUI.Step index={1} title="Step Two" description="Second action" />
            <BUI.Step index={2} title="Step Three" description="Final action" />
          </BUI.Stepper>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={stepperProps} />
      </Section>
    </BUI.Stack>
  )
}
