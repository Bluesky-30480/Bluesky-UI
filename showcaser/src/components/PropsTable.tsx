interface PropDef {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

interface PropsTableProps {
  props: PropDef[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="props-table">
        <thead className="bg-muted">
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code className="text-primary">{prop.name}</code>
                {prop.required && (
                  <span className="ml-1 text-error text-xs">*</span>
                )}
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>
                {prop.default ? (
                  <code>{prop.default}</code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
