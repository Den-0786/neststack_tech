import { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

const AUTH_KEY = 'neststack_auth'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000'

export function AuthProvider({ children }) {
  const toast = useToast()
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY)) || { isAuthenticated: false }
    } catch {
      return { isAuthenticated: false }
    }
  })

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    let timeout

    function resetTimer() {
      clearTimeout(timeout)
      if (auth.isAuthenticated) {
        timeout = setTimeout(() => {
          logout()
        }, 5 * 60 * 1000) // 5 minutes
      }
    }

    function handleActivity() {
      resetTimer()
    }

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => window.addEventListener(event, handleActivity))

    resetTimer()

    return () => {
      clearTimeout(timeout)
      events.forEach(event => window.removeEventListener(event, handleActivity))
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  }, [auth])

  async function login(username, password) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        setAuth({ isAuthenticated: true, username: data.username, token: data.token })
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  function logout() {
    setAuth({ isAuthenticated: false })
    toast.success('Logged Out', 'You have been successfully logged out.')
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
