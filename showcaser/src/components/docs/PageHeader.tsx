import { VStack, Heading, Text, Divider, Box, Badge } from '@bluesky-ui/ui'

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
}

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <Box as="header" className="mb-8">
      <VStack spacing="sm" align="start">
        <Box className="flex items-center gap-3">
          <Heading as="h1" size="3xl">
            {title}
          </Heading>
          {badge && (
            <Badge variant="soft" colorScheme="primary" size="sm" rounded>
              {badge}
            </Badge>
          )}
        </Box>
        {description && (
          <Text size="lg" color="muted" className="max-w-2xl">
            {description}
          </Text>
        )}
      </VStack>
      <Divider className="mt-6" />
    </Box>
  )
}
