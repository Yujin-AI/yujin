import { MainNav } from '@/components/main_nav'
import { DashboardNav } from '@/components/nav'
import { SiteFooter } from '@/components/site-footer'
import { UserAccountNav } from '@/components/user_account_nav'
import { navigationConfig } from '@/config/sidebar'

interface DashboardLayoutProps {
  children?: React.ReactNode
  user: any
  chatbot: any
}

export default function NavigationLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex items-center justify-between h-16 py-4">
          <MainNav items={navigationConfig.mainNav} />
          <UserAccountNav
            user={{
              name: user.name,
              email: user.email,
            }}
          />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={navigationConfig.sidebarNav} />
        </aside>
        <main className="flex flex-col flex-1 w-full overflow-hidden">{children}</main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
