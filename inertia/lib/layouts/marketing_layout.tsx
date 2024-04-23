import { Link } from '@inertiajs/react'

import { MainNav } from '@/components/main_nav'
import { SiteFooter } from '@/components/site-footer'
import { buttonVariants } from '@/components/ui/button'
import { marketingConfig } from '@/config/marketing_config'
import { cn } from '@/lib/utils'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container z-40 bg-background">
        <div className="flex items-center justify-between h-20 py-6">
          <MainNav items={marketingConfig.mainNav} />
          <nav>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
