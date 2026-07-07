import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const AUTH_KEY = 'neststack_auth'
const HARDCODED_USER = 'Kekeli@26'
const HARDCODED_PASS = 'NestStack26'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY)) || { isAuthenticated: false }
    } catch {
      return { isAuthenticated: false }
    }
  })

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  }, [auth])

  function login(username, password) {
    if (username === HARDCODED_USER && password === HARDCODED_PASS) {
      setAuth({ isAuthenticated: true, username })
      return true
    }
    return false
  }

  function logout() {
    setAuth({ isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
