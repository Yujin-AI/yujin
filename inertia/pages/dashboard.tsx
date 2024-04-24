import type DashboardController from '#controllers/dashboard_controller'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Link } from '@inertiajs/react'

export default function Dashboard(props: InferPageProps<DashboardController, 'showDashboard'>) {
  console.log(props)
  return (
    <div>
      <h1>Dashboard</h1>
      <Link
        href="/logout"
        className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'px-4')}
        method="post"
        as="button"
      >
        Logout
      </Link>
    </div>
  )
}
