import { useState, type ReactNode } from 'react'
import { Copy, Check, Code, Eye } from 'lucide-react'

interface ComponentPlaygroundProps {
  title: string
  description?: string
  children: ReactNode
  code: string
}

export function ComponentPlayground({
  title,
  description,
  children,
  code,
}: ComponentPlaygroundProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
        <div>
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
              view === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-surface'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setView('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
              view === 'code'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-surface'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded hover:bg-surface transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'preview' ? (
        <div className="component-preview">{children}</div>
      ) : (
        <div className="code-block rounded-none border-0">
          <pre className="text-sm">{code}</pre>
        </div>
      )}
    </div>
  )
}
