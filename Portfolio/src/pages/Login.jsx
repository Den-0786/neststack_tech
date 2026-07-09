import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Terminal, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Reveal from '../components/ui/Reveal'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const { light } = useTheme()
  const toast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!form.username || !form.password) {
      toast.error('Validation Error', 'All fields are required.')
      return
    }
    
    setLoading(true)
    const success = await login(form.username, form.password)
    setLoading(false)
    
    if (success) {
      toast.success('Login Successful', 'Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 1000)
    } else {
      toast.error('Login Failed', 'Invalid credentials. Please try again.')
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-700 ${light ? 'bg-gray-50' : 'bg-site-bg'}`}>
      <Link to="/" className={`font-mono font-black text-xl tracking-tight mb-10 ${light ? 'text-gray-900' : 'text-white'}`}>
        NestStack_Tech
      </Link>

      <Reveal direction="up" delay={100}>
      <div className={`w-full max-w-sm border p-8 ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Lock size={15} className={light ? 'text-neon-light' : 'text-neon'} />
          <h1 className={`font-mono text-xs tracking-widest uppercase font-semibold ${light ? 'text-gray-900' : 'text-white'}`}>
            System Access
          </h1>
        </div>
        <p className={`font-mono text-xs mb-6 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
          [SECURE_CHANNEL] — Authenticate to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Kekeli@26"
              className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
            />
          </div>
          <div>
            <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
              Auth_Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full border pl-4 pr-10 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${light ? 'text-gray-400 hover:text-neon-light' : 'text-site-muted hover:text-neon'}`}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-black font-mono font-bold text-xs tracking-widest uppercase py-4 flex items-center justify-center gap-2 hover:bg-neon-dim transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                <Terminal size={13} /> Authenticate
              </>
            )}
          </button>
        </form>

        <div className={`mt-6 pt-4 border-t flex justify-between ${light ? 'border-gray-200' : 'border-site-border'}`}>
          <Link to="/reset-password" className={`font-mono text-xs uppercase tracking-widest transition-colors ${light ? 'text-gray-400 hover:text-neon-light' : 'text-site-muted hover:text-neon'}`}>
            Reset Password
          </Link>
          <Link to="/" className={`font-mono text-xs uppercase tracking-widest transition-colors ${light ? 'text-gray-400 hover:text-gray-900' : 'text-site-muted hover:text-white'}`}>
            Back to Home
          </Link>
        </div>
      </div>
      </Reveal>

      <p className={`mt-8 font-mono text-xs tracking-widest uppercase ${light ? 'text-gray-400' : 'text-site-muted'}`}>
        NestStack_Tech :: v4.2.0-stable
      </p>
    </div>
  )
}
