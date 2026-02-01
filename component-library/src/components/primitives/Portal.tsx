import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  children: ReactNode
  container?: Element | null
  key?: string
}

export function Portal({ children, container, key }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) {
    return null
  }

  const targetContainer = container || document.body

  return createPortal(children, targetContainer, key)
}

Portal.displayName = 'Portal'
