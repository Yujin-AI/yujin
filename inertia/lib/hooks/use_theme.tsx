import { useEffect, useState } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    let savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      localStorage.setItem('theme', 'system')
      savedTheme = 'system'
    }

    return savedTheme as 'dark' | 'light' | 'system'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.body.classList.remove('light', 'dark', 'system')
    if (theme === 'system') {
      document.body.classList.add(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    } else {
      document.body.classList.add(theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
