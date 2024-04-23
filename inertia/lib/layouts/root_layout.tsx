import { TailwindIndicator } from '@/components/ui/tailwind_indicator'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased')}>
      {children}
      <Toaster />
      <TailwindIndicator />
    </div>
  )
}
