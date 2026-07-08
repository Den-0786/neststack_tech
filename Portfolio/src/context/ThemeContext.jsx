import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ light: false, toggle: () => {} })

function isDaytime() {
  const h = new Date().getHours()
  return h >= 6 && h < 18
}

export function ThemeProvider({ children }) {
  const [light, setLight] = useState(!isDaytime)

  useEffect(() => {
    const msUntilNextHour = () => {
      const now = new Date()
      return (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000
    }

    let timeout
    function schedule() {
      timeout = setTimeout(() => {
        setLight(isDaytime())
        schedule()
      }, msUntilNextHour())
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (light) {
      document.documentElement.classList.add('theme-light')
      document.documentElement.classList.remove('theme-dark')
    } else {
      document.documentElement.classList.add('theme-dark')
      document.documentElement.classList.remove('theme-light')
    }
  }, [light])

  return (
    <ThemeContext.Provider value={{ light, toggle: () => setLight((l) => !l) }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}
