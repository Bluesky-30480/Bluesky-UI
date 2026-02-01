import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import BUI from '@bluesky-ui/ui'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = 'tsx', 
  filename,
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.trim().split('\n')

  return (
    <BUI.Box className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <BUI.HStack 
        justify="between" 
        align="center" 
        className="px-4 py-2 bg-surface border-b border-border"
      >
        <BUI.Text size="xs" color="muted" className="font-mono">
          {filename || language}
        </BUI.Text>
        <BUI.IconButton
          onClick={handleCopy}
          aria-label="Copy code"
          size="sm"
          variant="ghost"
          colorScheme="neutral"
          icon={
            copied
              ? <Check className="w-4 h-4 text-success" />
              : <Copy className="w-4 h-4 text-muted-foreground" />
          }
        />
      </BUI.HStack>

      {/* Code */}
      <BUI.Box className="p-4 bg-[var(--ui-bg)] overflow-x-auto">
        <pre className="text-sm font-mono">
          {showLineNumbers ? (
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="select-none text-muted-foreground/50 w-8 text-right pr-4">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </code>
          ) : (
            <code>{code.trim()}</code>
          )}
        </pre>
      </BUI.Box>
    </BUI.Box>
  )
}
