import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { scroller } from 'react-scroll'
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { label: 'Home', to: 'hero' },
  { label: 'About', to: 'about' },
  { label: 'Projects', to: 'project' },
  { label: 'Contact', to: 'contact' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { light, toggle } = useTheme()

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = navLinks.map((l) => l.to)
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o && o.disconnect())
  }, [])

  function scrollTo(id) {
    setActiveSection(id)
    scroller.scrollTo(id, { smooth: true, duration: 500, offset: -56 })
  }

  return (
    <>
    <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur border-b transition-all duration-700 ${light ? 'bg-gray-50/95 border-gray-200' : 'bg-site-bg border-site-border'} ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <RouterLink to="/" className={`font-mono font-black text-lg tracking-tight ${light ? 'text-gray-900' : 'text-white'}`}>
          NestStack_Tech
        </RouterLink>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => {
            const isActive = activeSection === to
            return (
              <button
                key={label}
                onClick={() => scrollTo(to)}
                className={`relative font-mono text-xs tracking-widest uppercase transition-colors pb-1 ${
                  isActive ? (light ? 'text-neon-light' : 'text-neon') : (light ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300')
                }`}
              >
                {label}
                {isActive && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${light ? 'bg-neon-light' : 'bg-neon'}`} />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            title={light ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className={`hidden md:flex p-2 transition-colors ${light ? 'text-gray-500 hover:text-neon-light' : 'text-gray-400 hover:text-neon'}`}
          >
            {light ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <RouterLink to="/dashboard" className={`hidden md:flex p-2 transition-colors ${light ? 'text-gray-500 hover:text-neon-light' : 'text-gray-400 hover:text-neon'}`}>
            <Terminal size={16} />
          </RouterLink>
          <button
            onClick={() => scrollTo('contact')}
            className={`hidden md:block font-mono text-xs px-4 py-2 font-bold tracking-widest uppercase transition-colors ${
              light ? 'bg-neon-light text-white hover:bg-neon-light/90' : 'bg-neon text-black hover:bg-neon-dim'
            }`}
          >
            Hire Me
          </button>
        </div>

        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className={`md:hidden border-t px-6 py-4 flex flex-col gap-4 transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
          {navLinks.map(({ label, to }) => {
            const isActive = activeSection === to
            return (
              <button
                key={label}
                onClick={() => { scrollTo(to); setOpen(false) }}
                className={`font-mono text-xs uppercase tracking-widest text-left transition-colors ${
                  isActive ? (light ? 'text-neon-light' : 'text-neon') : (light ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white')
                }`}
              >
                {label}
              </button>
            )
          })}
          <RouterLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-left transition-colors ${
              light ? 'text-gray-500 hover:text-neon-light' : 'text-gray-400 hover:text-neon'
            }`}
          >
            <Terminal size={14} /> Login
          </RouterLink>
          <button
            onClick={() => { scrollTo('contact'); setOpen(false) }}
            className={`font-mono text-xs px-4 py-2 font-bold tracking-widest uppercase text-center transition-colors ${
              light ? 'bg-neon-light text-white hover:bg-neon-light/90' : 'bg-neon text-black hover:bg-neon-dim'
            }`}
          >
            Hire Me
          </button>
          <button
            onClick={toggle}
            className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-left transition-colors ${
              light ? 'text-gray-500 hover:text-neon-light' : 'text-gray-400 hover:text-neon'
            }`}
          >
            {light ? <Moon size={14} /> : <Sun size={14} />}
            {light ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      )}
    </header>
    </>
  )
}
