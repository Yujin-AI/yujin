import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { SidebarNavItem } from '@/types'
import { Link } from '@inertiajs/react'

interface DashboardNavProps {
  items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  // const path = usePathname()
  const path = new URL(window.location.href).pathname

  const chatbotSlug = path.split('/')[1]

  if (!items?.length) {
    return null
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        // @ts-ignore
        const Icon = Icons[item.icon || 'arrowRight']
        const href = item.slug ? `/${chatbotSlug}${item.href}` : item.href!

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              path === href ? 'bg-accent' : 'transparent',
              item.disabled && 'cursor-not-allowed opacity-80'
            )}
            disabled={item.disabled}
          >
            <Icon className="w-4 h-4 mr-2" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
