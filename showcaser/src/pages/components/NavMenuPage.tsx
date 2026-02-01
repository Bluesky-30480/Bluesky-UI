import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const navMenuProps = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Layout direction' },
]

export default function NavMenuPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="NavMenu" description="A simple navigation list for app sections." />

      <Section title="Vertical">
        <ComponentPreview>
          <BUI.NavMenu>
            <BUI.NavMenuItem href="#" active>Dashboard</BUI.NavMenuItem>
            <BUI.NavMenuItem href="#">Projects</BUI.NavMenuItem>
            <BUI.NavMenuItem href="#">Settings</BUI.NavMenuItem>
          </BUI.NavMenu>
        </ComponentPreview>
      </Section>

      <Section title="Horizontal">
        <ComponentPreview>
          <BUI.NavMenu orientation="horizontal">
            <BUI.NavMenuItem href="#" active>Overview</BUI.NavMenuItem>
            <BUI.NavMenuItem href="#">Team</BUI.NavMenuItem>
            <BUI.NavMenuItem href="#">Billing</BUI.NavMenuItem>
          </BUI.NavMenu>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={navMenuProps} />
      </Section>
    </BUI.Stack>
  )
}
