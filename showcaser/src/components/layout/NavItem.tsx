import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  to: string
  children: React.ReactNode
  icon?: LucideIcon
  active?: boolean
  compact?: boolean
}

export function NavItem({ to, children, icon: Icon, active, compact }: NavItemProps) {
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
