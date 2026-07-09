import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

const navLinks = [
  { label: 'Terminal', to: '/' },
  { label: 'Telemetry', to: '/telemetry' },
  { label: 'Projects', to: '/projects' },
  { label: 'Archive', to: '/archive' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { data } = usePortfolio()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-sys-bg border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <button className="md:hidden text-gray-600" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link to="/" className="font-mono font-bold text-sm tracking-widest text-gray-900">
          SYSTEM_CORE
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `font-mono text-xs tracking-widest uppercase transition-colors ${
                  isActive ? 'text-neon font-semibold' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <Link to="/login" className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-neon transition-colors">
          <img src={data.bio.avatar || '/portimages/abouttemp.jpeg'} alt={data.bio.name || 'User'} className="w-full h-full object-cover" />
        </Link>
      </nav>

      {open && (
        <div className="md:hidden bg-sys-bg border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-mono text-xs tracking-widest uppercase ${
                  isActive ? 'text-neon font-semibold' : 'text-gray-500'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
