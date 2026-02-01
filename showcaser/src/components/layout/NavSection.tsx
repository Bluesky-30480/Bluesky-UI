import { VStack, Text } from '@bluesky-ui/ui'

interface NavSectionProps {
  title: string
  children: React.ReactNode
}

export function NavSection({ title, children }: NavSectionProps) {
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
