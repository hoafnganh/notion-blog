import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg border-2 border-yellow-400 dark:border-purple-500 bg-transparent"></div>
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg border-2 
                 border-yellow-400 hover:bg-yellow-100
                 dark:border-purple-500 dark:hover:bg-purple-500/10 
                 transition-all duration-300
                 flex items-center justify-center"
      aria-label="Toggle Dark Mode"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-purple-400" />
      ) : (
        <Moon className="h-5 w-5 text-yellow-600" />
      )}
    </button>
  )
}