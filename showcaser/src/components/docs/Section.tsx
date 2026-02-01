import { VStack, Heading, Box } from '@bluesky-ui/ui'

interface SectionProps {
  title: string
  children: React.ReactNode
  id?: string
}

export function Section({ title, children, id }: SectionProps) {
  return (
    <Box as="section" id={id} className="scroll-mt-20">
      <VStack spacing="md" align="stretch">
        <Heading as="h2" size="xl">
          {title}
        </Heading>
        {children}
      </VStack>
    </Box>
  )
}
