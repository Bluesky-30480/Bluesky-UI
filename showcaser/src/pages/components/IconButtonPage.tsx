import { Stack, Text, IconButton, Divider, Box } from '@bluesky-ui/ui'
import { ComponentPreview } from '../../components/docs/ComponentPreview'
import { PageHeader } from '../../components/docs/PageHeader'
import { Section } from '../../components/docs/Section'
import { PropsTable } from '../../components/docs/PropsTable'
import { Plus, Edit, Trash2, Heart, Settings, Menu, Bell, Search, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'

const iconButtonProps = [
  { name: 'icon', type: 'ReactNode', required: true, description: 'The icon to display' },
  { name: 'aria-label', type: 'string', required: true, description: 'Accessible label for the button' },
  { name: 'variant', type: "'solid' | 'outline' | 'ghost' | 'soft'", defaultValue: "'ghost'", description: 'Visual style' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", defaultValue: "'md'", description: 'Size of the button' },
  { name: 'colorScheme', type: "'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'", defaultValue: "'neutral'", description: 'Color scheme' },
  { name: 'isRounded', type: 'boolean', defaultValue: 'false', description: 'Use full border radius' },
  { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Show loading spinner' },
  { name: 'isDisabled', type: 'boolean', defaultValue: 'false', description: 'Disable the button' },
]

export function IconButtonPage() {
  return (
    <Stack spacing="xl">
      <PageHeader
        title="IconButton"
        description="A button containing only an icon, with proper accessibility support."
      />

      <Section title="Basic Usage">
        <ComponentPreview>
          <IconButton icon={<Plus className="w-5 h-5" />} aria-label="Add item" />
        </ComponentPreview>
      </Section>

      <Section title="Variants">
        <ComponentPreview>
          <Stack direction="row" spacing="md">
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" variant="solid" colorScheme="primary" />
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" variant="outline" colorScheme="primary" />
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" variant="ghost" />
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" variant="soft" colorScheme="primary" />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Color Schemes">
        <ComponentPreview>
          <Stack spacing="md">
            <Stack direction="row" spacing="sm" wrap>
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="solid" colorScheme="primary" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="solid" colorScheme="success" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="solid" colorScheme="warning" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="solid" colorScheme="error" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="solid" colorScheme="neutral" />
            </Stack>
            
            <Stack direction="row" spacing="sm" wrap>
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="soft" colorScheme="primary" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="soft" colorScheme="success" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="soft" colorScheme="warning" />
              <IconButton icon={<Heart className="w-5 h-5" />} aria-label="Like" variant="soft" colorScheme="error" />
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Sizes">
        <ComponentPreview>
          <Stack direction="row" spacing="md" align="center">
            <IconButton icon={<Bell className="w-3 h-3" />} aria-label="Notifications" size="xs" />
            <IconButton icon={<Bell className="w-4 h-4" />} aria-label="Notifications" size="sm" />
            <IconButton icon={<Bell className="w-5 h-5" />} aria-label="Notifications" size="md" />
            <IconButton icon={<Bell className="w-6 h-6" />} aria-label="Notifications" size="lg" />
            <IconButton icon={<Bell className="w-7 h-7" />} aria-label="Notifications" size="xl" />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Rounded">
        <ComponentPreview>
          <Stack direction="row" spacing="md">
            <IconButton icon={<Plus className="w-5 h-5" />} aria-label="Add" variant="solid" colorScheme="primary" />
            <IconButton icon={<Plus className="w-5 h-5" />} aria-label="Add" variant="solid" colorScheme="primary" isRounded />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Loading & Disabled">
        <ComponentPreview>
          <Stack direction="row" spacing="md">
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" isLoading />
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" isDisabled />
            <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" variant="solid" colorScheme="primary" isLoading />
          </Stack>
        </ComponentPreview>
      </Section>

      <Section title="Practical Examples">
        <ComponentPreview>
          <Stack spacing="lg">
            {/* Toolbar */}
            <Box padding="sm" background="surface" rounded="md" border>
              <Stack direction="row" spacing="xs">
                <IconButton icon={<Menu className="w-5 h-5" />} aria-label="Menu" />
                <IconButton icon={<Search className="w-5 h-5" />} aria-label="Search" />
                <IconButton icon={<Bell className="w-5 h-5" />} aria-label="Notifications" />
                <IconButton icon={<Settings className="w-5 h-5" />} aria-label="Settings" />
              </Stack>
            </Box>

            {/* Pagination */}
            <Stack direction="row" spacing="sm" align="center">
              <IconButton icon={<ChevronLeft className="w-5 h-5" />} aria-label="Previous page" variant="outline" />
              <Text>Page 1 of 10</Text>
              <IconButton icon={<ChevronRight className="w-5 h-5" />} aria-label="Next page" variant="outline" />
            </Stack>

            {/* Card actions */}
            <Stack direction="row" spacing="sm">
              <IconButton icon={<Edit className="w-4 h-4" />} aria-label="Edit" variant="soft" colorScheme="primary" />
              <IconButton icon={<Trash2 className="w-4 h-4" />} aria-label="Delete" variant="soft" colorScheme="error" />
              <IconButton icon={<MoreVertical className="w-4 h-4" />} aria-label="More options" />
            </Stack>
          </Stack>
        </ComponentPreview>
      </Section>

      <Divider spacing="xl" />

      <Section title="Props">
        <PropsTable props={iconButtonProps} />
      </Section>
    </Stack>
  )
}
