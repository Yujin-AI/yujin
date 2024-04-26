import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import usePageProps from '@/hooks/use_page_props'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * This function is used to check if a feature is enabled for a given page.
 * @param featureKey
 * @returns
 */
export function isFeatureEnabled(featureKey: string): boolean {
  const pageProps = usePageProps<{ features: Record<string, boolean> }>()
  return !!pageProps.features[featureKey]
}

export function generateRandomPassword(): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?'
  const length = 10
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    password += characters.charAt(randomIndex)
  }
  return password
}

export function getInitials(value: string): string {
  const splittedFullName: string[] = value.split(' ')

  return (
    splittedFullName[0].charAt(0).toUpperCase() +
    (splittedFullName.length > 1 ? splittedFullName[1].charAt(0).toUpperCase() : '')
  )
}

export const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '')
export const removeQueryParams = (value: string) => value.replace(/\?.*$/, '')
