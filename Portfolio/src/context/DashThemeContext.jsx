import { createContext, useContext } from 'react'

export const DashThemeContext = createContext(false)

export function useDashTheme() {
  return useContext(DashThemeContext)
}

export function t(light, darkClass, lightClass) {
  return light ? lightClass : darkClass
}
