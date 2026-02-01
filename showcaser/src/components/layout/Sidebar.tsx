import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Palette } from 'lucide-react'
import { VStack, Text, Divider } from '@bluesky-ui/ui'

// Main navigation items
const mainNavigation = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/home/docs', label: 'Documentation', icon: BookOpen },
  { path: '/home/theming', label: 'Theming', icon: Palette },
]

// Component categories
const componentCategories = [
  {
    title: 'Primitives',
    items: [
      { path: '/home/components/box', label: 'Box' },
      { path: '/home/components/stack', label: 'Stack' },
      { path: '/home/components/center', label: 'Center' },
      { path: '/home/components/text', label: 'Text' },
      { path: '/home/components/heading', label: 'Heading' },
      { path: '/home/components/divider', label: 'Divider' },
      { path: '/home/components/grid', label: 'Grid' },
      { path: '/home/components/scroll-area', label: 'ScrollArea' },
      { path: '/home/components/focus-trap', label: 'FocusTrap' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { path: '/home/components/tabs', label: 'Tabs' },
      { path: '/home/components/accordion', label: 'Accordion' },
      { path: '/home/components/breadcrumb', label: 'Breadcrumb' },
      { path: '/home/components/pagination', label: 'Pagination' },
      { path: '/home/components/stepper', label: 'Stepper' },
      { path: '/home/components/nav-menu', label: 'NavMenu' },
      { path: '/home/components/sidebar', label: 'Sidebar' },
      { path: '/home/components/command-palette', label: 'CommandPalette' },
    ],
  },
  {
    title: 'Data Display',
    items: [
      { path: '/home/components/card', label: 'Card' },
      { path: '/home/components/avatar', label: 'Avatar' },
      { path: '/home/components/avatar-group', label: 'AvatarGroup' },
      { path: '/home/components/table', label: 'Table' },
      { path: '/home/components/data-grid', label: 'DataGrid' },
      { path: '/home/components/virtual-list', label: 'VirtualList' },
      { path: '/home/components/tree', label: 'Tree' },
      { path: '/home/components/timeline', label: 'Timeline' },
      { path: '/home/components/calendar', label: 'Calendar' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { path: '/home/components/charts', label: 'Charts' },
      { path: '/home/components/chat', label: 'Chat' },
      { path: '/home/components/agent-system', label: 'AgentSystem' },
      { path: '/home/components/task-manager', label: 'TaskManager' },
    ],
  },
  {
    title: 'Media',
    items: [
      { path: '/home/components/image', label: 'Image' },
      { path: '/home/components/image-gallery', label: 'ImageGallery' },
      { path: '/home/components/video-player', label: 'VideoPlayer' },
      { path: '/home/components/audio-player', label: 'AudioPlayer' },
      { path: '/home/components/audio-waveform', label: 'AudioWaveform' },
      { path: '/home/components/file-upload', label: 'FileUpload' },
      { path: '/home/components/file-preview', label: 'FilePreview' },
      { path: '/home/components/music-player', label: 'MusicPlayer' },
      { path: '/home/components/reading-module', label: 'ReadingModule' },
      { path: '/home/components/media-helper', label: 'MediaHelper' },
    ],
  },
  {
    title: 'Developer',
    items: [
      { path: '/home/components/dev-tools', label: 'DevTools' },
      { path: '/home/components/experimental', label: 'Experimental' },
    ],
  },
  {
    title: 'Buttons',
    items: [
      { path: '/home/components/button', label: 'Button' },
      { path: '/home/components/icon-button', label: 'IconButton' },
      { path: '/home/components/hold-to-proceed', label: 'HoldToProceed' },
      { path: '/home/components/button-group', label: 'ButtonGroup' },
      { path: '/home/components/toggle-button', label: 'ToggleButton' },
      { path: '/home/components/link', label: 'Link' },
    ],
  },
  {
    title: 'Inputs',
    items: [
      { path: '/home/components/input', label: 'Input' },
      { path: '/home/components/textarea', label: 'Textarea' },
      { path: '/home/components/checkbox', label: 'Checkbox' },
      { path: '/home/components/switch', label: 'Switch' },
      { path: '/home/components/radio', label: 'Radio' },
      { path: '/home/components/select', label: 'Select' },
      { path: '/home/components/slider', label: 'Slider' },
    ],
  },
  {
    title: 'Feedback',
    items: [
      { path: '/home/components/spinner', label: 'Spinner' },
      { path: '/home/components/badge', label: 'Badge' },
      { path: '/home/components/progress', label: 'Progress' },
      { path: '/home/components/alert', label: 'Alert' },
      { path: '/home/components/skeleton', label: 'Skeleton' },
      { path: '/home/components/tooltip', label: 'Tooltip' },
      { path: '/home/components/toast', label: 'Toast' },
      { path: '/home/components/modal', label: 'Modal' },
      { path: '/home/components/drawer', label: 'Drawer' },
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
