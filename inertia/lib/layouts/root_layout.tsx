import TailwindIndicator from '@/components/tailwind_indicator'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased')}>
      {children}
      <Toaster />
      <TailwindIndicator />
    </div>
  )
}
