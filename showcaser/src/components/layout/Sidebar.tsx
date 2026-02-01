import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Palette } from 'lucide-react'
import { VStack, Text, Divider } from '@bluesky-ui/ui'

// Main navigation items
const mainNavigation = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/docs', label: 'Documentation', icon: BookOpen },
  { path: '/theming', label: 'Theming', icon: Palette },
]

// Component categories
const componentCategories = [
  {
    title: 'Primitives',
    items: [
      { path: '/components/box', label: 'Box' },
      { path: '/components/stack', label: 'Stack' },
      { path: '/components/center', label: 'Center' },
      { path: '/components/text', label: 'Text' },
      { path: '/components/heading', label: 'Heading' },
      { path: '/components/divider', label: 'Divider' },
      { path: '/components/grid', label: 'Grid' },
      { path: '/components/scroll-area', label: 'ScrollArea' },
      { path: '/components/focus-trap', label: 'FocusTrap' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { path: '/components/tabs', label: 'Tabs' },
      { path: '/components/accordion', label: 'Accordion' },
      { path: '/components/breadcrumb', label: 'Breadcrumb' },
      { path: '/components/pagination', label: 'Pagination' },
      { path: '/components/stepper', label: 'Stepper' },
      { path: '/components/nav-menu', label: 'NavMenu' },
      { path: '/components/sidebar', label: 'Sidebar' },
      { path: '/components/command-palette', label: 'CommandPalette' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { path: '/components/card', label: 'Card' },
      { path: '/components/avatar', label: 'Avatar' },
      { path: '/components/avatar-group', label: 'AvatarGroup' },
      { path: '/components/table', label: 'Table' },
      { path: '/components/data-grid', label: 'DataGrid' },
      { path: '/components/virtual-list', label: 'VirtualList' },
      { path: '/components/tree', label: 'Tree' },
      { path: '/components/timeline', label: 'Timeline' },
      { path: '/components/calendar', label: 'Calendar' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { path: '/components/charts', label: 'Charts' },
      { path: '/components/chat', label: 'Chat' },
      { path: '/components/agent-system', label: 'AgentSystem' },
      { path: '/components/task-manager', label: 'TaskManager' },
    ],
  },
  {
    title: 'Media',
    items: [
      { path: '/components/image', label: 'Image' },
      { path: '/components/image-gallery', label: 'ImageGallery' },
      { path: '/components/video-player', label: 'VideoPlayer' },
      { path: '/components/audio-player', label: 'AudioPlayer' },
      { path: '/components/audio-waveform', label: 'AudioWaveform' },
      { path: '/components/file-upload', label: 'FileUpload' },
      { path: '/components/file-preview', label: 'FilePreview' },
      { path: '/components/music-player', label: 'MusicPlayer' },
      { path: '/components/reading-module', label: 'ReadingModule' },
      { path: '/components/media-helper', label: 'MediaHelper' },
    ],
  },
  {
    title: 'Developer',
    items: [
      { path: '/components/dev-tools', label: 'DevTools' },
      { path: '/components/experimental', label: 'Experimental' },
    ],
  },
  {
    title: 'Buttons',
    items: [
      { path: '/components/button', label: 'Button' },
      { path: '/components/icon-button', label: 'IconButton' },
      { path: '/components/hold-to-proceed', label: 'HoldToProceed' },
      { path: '/components/button-group', label: 'ButtonGroup' },
      { path: '/components/toggle-button', label: 'ToggleButton' },
      { path: '/components/link', label: 'Link' },
    ],
  },
  {
    title: 'Inputs',
    items: [
      { path: '/components/input', label: 'Input' },
      { path: '/components/textarea', label: 'Textarea' },
      { path: '/components/checkbox', label: 'Checkbox' },
      { path: '/components/switch', label: 'Switch' },
      { path: '/components/radio', label: 'Radio' },
      { path: '/components/select', label: 'Select' },
      { path: '/components/slider', label: 'Slider' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { path: '/components/spinner', label: 'Spinner' },
      { path: '/components/badge', label: 'Badge' },
      { path: '/components/progress', label: 'Progress' },
      { path: '/components/alert', label: 'Alert' },
      { path: '/components/skeleton', label: 'Skeleton' },
      { path: '/components/tooltip', label: 'Tooltip' },
      { path: '/components/toast', label: 'Toast' },
      { path: '/components/modal', label: 'Modal' },
      { path: '/components/drawer', label: 'Drawer' },
      { path: '/components/popover', label: 'Popover' },
      { path: '/components/dialog', label: 'Dialog' },
      { path: '/components/context-menu', label: 'ContextMenu' },
    ],
  },
]

interface NavItemProps {
  to: string
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  active?: boolean
  compact?: boolean
}

function NavItem({ to, children, icon: Icon, active, compact }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 rounded-md
        transition-all duration-200 ease-out
        ${compact ? 'px-3 py-1.5 text-sm' : 'px-3 py-2'}
        ${active
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground hover:bg-muted active:bg-muted-hover'
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
    </Link>
  )
}

interface NavSectionProps {
  title: string
  children: React.ReactNode
}

function NavSection({ title, children }: NavSectionProps) {
  return (
    <VStack spacing="xs">
      <Text 
        size="xs" 
        weight="semibold" 
        color="muted"
        className="uppercase tracking-wider px-3"
      >
        {title}
      </Text>
      <nav className="space-y-0.5">
        {children}
      </nav>
    </VStack>
  )
}

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="showcaser-sidebar bg-surface">
      <VStack spacing="none" className="p-4 h-full">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {mainNavigation.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              active={location.pathname === item.path}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>

        <Divider className="my-4" />

        {/* Component Categories */}
        <VStack spacing="lg" className="flex-1">
          {componentCategories.map((category) => (
            <NavSection key={category.title} title={category.title}>
              {category.items.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  active={location.pathname === item.path}
                  compact
                >
                  {item.label}
                </NavItem>
              ))}
            </NavSection>
          ))}
        </VStack>
      </VStack>
    </aside>
  )
}
