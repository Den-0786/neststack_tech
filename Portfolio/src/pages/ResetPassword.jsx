import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ShieldCheck } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import Reveal from '../components/ui/Reveal'
import { useTheme } from '../context/ThemeContext'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { light } = useTheme()
  const toast = useToast()

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) {
      toast.error('Validation Error', 'Please enter your email address.')
      return
    }
    toast.success('Reset Link Sent', 'Check your email for password reset instructions.')
    setSent(true)
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 transition-colors duration-700 ${light ? 'bg-gray-50' : 'bg-site-bg'}`}>
      <Link to="/" className={`font-mono font-black text-xl tracking-tight mb-10 ${light ? 'text-gray-900' : 'text-white'}`}>
        NestStack_Tech
      </Link>

      <Reveal direction="up" delay={100}>
      <div className={`w-full max-w-sm border p-8 ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={15} className={light ? 'text-neon-light' : 'text-neon'} />
          <h1 className={`font-mono text-xs tracking-widest uppercase font-semibold ${light ? 'text-gray-900' : 'text-white'}`}>
            Reset Access Key
          </h1>
        </div>
        <p className={`font-mono text-xs mb-6 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
          [RECOVERY_PROTOCOL] — Enter your registered email to receive reset instructions.
        </p>

        {sent ? (
          <div className={`border px-4 py-5 text-center ${light ? 'border-neon-light/30 bg-neon-light/5' : 'border-neon/30 bg-neon/5'}`}>
            <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${light ? 'text-neon-light' : 'text-neon'}`}>
              Signal Transmitted.
            </p>
            <p className={`font-mono text-xs mt-1 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
              Check your inbox for reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                Source_Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-neon text-black font-mono font-bold text-xs tracking-widest uppercase py-4 flex items-center justify-center gap-2 hover:bg-neon-dim transition-colors mt-2"
            >
              <Mail size={13} /> Send Reset Link
            </button>
          </form>
        )}

        <div className={`mt-6 pt-4 border-t flex justify-between ${light ? 'border-gray-200' : 'border-site-border'}`}>
          <Link to="/login" className={`font-mono text-xs uppercase tracking-widest transition-colors ${light ? 'text-gray-400 hover:text-neon-light' : 'text-site-muted hover:text-neon'}`}>
            Back to Login
          </Link>
          <Link to="/" className={`font-mono text-xs uppercase tracking-widest transition-colors ${light ? 'text-gray-400 hover:text-gray-900' : 'text-site-muted hover:text-white'}`}>
            Home
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
