import { Link } from 'react-router-dom'
import { Layers } from 'lucide-react'
import { HStack, Text } from '@bluesky-ui/ui'
import { ThemeSwitcher } from './ThemeSwitcher'

export function Header() {
  return (
    <header className="showcaser-header">
      <HStack justify="between" align="center" className="h-full px-6">
        {/* Logo */}
        <HStack spacing="md" align="center">
          <Link to="/" className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            <Text size="xl" weight="semibold">
              Bluesky UI
            </Text>
          </Link>
          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
            v0.0.1
          </span>
        </HStack>

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </HStack>
    </header>
  )
}
