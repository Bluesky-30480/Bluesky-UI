import { Box, Text } from '@bluesky-ui/ui'

interface Prop {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

interface PropsTableProps {
  props: Prop[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <Box className="rounded-lg border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Prop
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Default
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {props.map((prop) => (
            <tr key={prop.name} className="hover:bg-muted/30 transition-colors duration-150">
              <td className="px-4 py-3">
                <code className="text-sm font-mono text-primary">
                  {prop.name}
                  {prop.required && <span className="text-error">*</span>}
                </code>
              </td>
              <td className="px-4 py-3">
                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="px-4 py-3">
                {prop.default ? (
                  <code className="text-xs font-mono text-muted-foreground">
                    {prop.default}
                  </code>
                ) : (
                  <Text size="xs" color="muted">—</Text>
                )}
              </td>
              <td className="px-4 py-3">
                <Text size="sm" color="muted">{prop.description}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export type { Prop }
