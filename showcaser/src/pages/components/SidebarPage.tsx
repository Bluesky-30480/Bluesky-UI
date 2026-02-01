import BUI from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'

const sidebarProps = [
  { name: 'children', type: 'ReactNode', default: '-', description: 'Sidebar content' },
]

export default function SidebarPage() {
  return (
    <BUI.Stack spacing="xl">
      <PageHeader title="Sidebar" description="A vertical layout container for navigation and tools." />

      <Section title="Basic Usage">
        <ComponentPreview>
          <BUI.Box className="w-full max-w-sm">
            <BUI.Sidebar>
              <BUI.SidebarHeader>
                <BUI.Text weight="semibold">Workspace</BUI.Text>
                <BUI.Badge variant="soft">Pro</BUI.Badge>
              </BUI.SidebarHeader>
              <BUI.SidebarSection title="Main">
                <BUI.SidebarItem href="#" active>Dashboard</BUI.SidebarItem>
                <BUI.SidebarItem href="#">Analytics</BUI.SidebarItem>
                <BUI.SidebarItem href="#">Reports</BUI.SidebarItem>
              </BUI.SidebarSection>
              <BUI.SidebarSection title="Settings">
                <BUI.SidebarItem href="#">Team</BUI.SidebarItem>
                <BUI.SidebarItem href="#">Billing</BUI.SidebarItem>
              </BUI.SidebarSection>
              <BUI.SidebarFooter>
                <BUI.Text size="sm" color="muted">v1.0.0</BUI.Text>
              </BUI.SidebarFooter>
            </BUI.Sidebar>
          </BUI.Box>
        </ComponentPreview>
      </Section>

      <BUI.Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={sidebarProps} />
      </Section>
    </BUI.Stack>
  )
}
