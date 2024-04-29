import { SidebarConfig } from '@/types'

export const navigationConfig: SidebarConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'post',
      slug: true,
    },
    {
      title: 'Articles',
      href: '/articles',
      icon: 'billing',
      slug: true,
    },
    {
      title: 'Chatbots',
      href: '/chatbots',
      icon: 'bot',
      slug: false,
    },
  ],
}
