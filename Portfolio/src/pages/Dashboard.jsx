import { useState } from 'react'
import { Home, FolderOpen, Shield, MessageSquare, Settings, ChevronLeft, ChevronRight, LogOut, Menu, Sun, Moon, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import OverviewTab from '../components/dash/OverviewTab'
import ProjectsTab from '../components/dash/ProjectsTab'
import MessagesTab from '../components/dash/MessagesTab'
import CertificatesTab from '../components/dash/CertificatesTab'
import SettingsTab from '../components/dash/SettingsTab'
import { usePortfolio } from '../context/PortfolioContext'
import { DashThemeContext } from '../context/DashThemeContext'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: 'overview',      label: 'Overview',      icon: Home },
  { id: 'projects',      label: 'Projects',      icon: FolderOpen },
  { id: 'certificates',  label: 'Certificates',  icon: Shield },
  { id: 'messages',      label: 'Messages',      icon: MessageSquare },
  { id: 'settings',      label: 'Settings',      icon: Settings },
]

function Sidebar({ active, onNav, collapsed, onToggleCollapse, avatar, name, light, onToggleLight, onLogout, mobile = false }) {
  return (
    <aside className={`
      ${mobile ? 'flex' : 'hidden md:flex'}
      flex-col border-r h-full
      ${light ? 'bg-gray-100 border-gray-200' : 'bg-site-card border-site-border'}
      ${collapsed && !mobile ? 'w-16' : 'w-56'}
      transition-all duration-300 shrink-0
    `}>
      <div className={`flex items-center gap-3 px-4 py-5 border-b overflow-hidden ${light ? 'border-gray-200' : 'border-site-border'} ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className={`w-8 h-8 rounded-full overflow-hidden border-2 shrink-0 ${light ? 'border-neon-light/60' : 'border-neon/50'}`}>
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        {(!collapsed || mobile) && (
          <div className="overflow-hidden">
            <p className={`font-mono text-xs font-bold truncate ${light ? 'text-gray-900' : 'text-white'}`}>{name.split(' ')[0]}</p>
            <p className={`font-mono text-[10px] truncate ${light ? 'text-neon-light' : 'text-neon'}`}>Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors rounded-sm group relative ${
                isActive
                  ? light
                    ? 'bg-neon-light/10 text-neon-light border border-neon-light/30'
                    : 'bg-neon/10 text-neon border border-neon/20'
                  : light
                    ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-200 border border-transparent'
                    : 'text-site-muted hover:text-white hover:bg-site-bg/50 border border-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className="shrink-0" />
              {(!collapsed || mobile) && (
                <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
              )}
              {collapsed && !mobile && (
                <span className="absolute left-full ml-2 bg-site-card border border-site-border text-white font-mono text-xs px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  {label}
                </span>
              )}
              {isActive && (!collapsed || mobile) && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full ${light ? 'bg-neon-light' : 'bg-neon'}`} />
              )}
            </button>
          )
        })}
      </nav>

      <div className={`px-2 pb-4 space-y-1 border-t pt-3 ${light ? 'border-gray-200' : 'border-site-border'}`}>
        <button
          onClick={onToggleLight}
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors rounded-sm ${
            light ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-200' : 'text-site-muted hover:text-white hover:bg-site-bg/50'
          }`}
        >
          {light ? <Moon size={16} className="shrink-0" /> : <Sun size={16} className="shrink-0" />}
          {(!collapsed || mobile) && (
            <span className="font-mono text-xs uppercase tracking-widest">{light ? 'Dark Mode' : 'Light Mode'}</span>
          )}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors rounded-sm ${
            light ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-200' : 'text-site-muted hover:text-white hover:bg-site-bg/50'
          }`}
        >
          <LogOut size={16} className="shrink-0" />
          {(!collapsed || mobile) && (
            <span className="font-mono text-xs uppercase tracking-widest">Exit</span>
          )}
        </button>
        {!mobile && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center py-2 text-site-muted hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>
    </aside>
  )
}

export default function Dashboard() {
  const [active, setActive] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { light, toggle: toggleLight } = useTheme()
  const { data } = usePortfolio()
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const [settingsOpen, setSettingsOpen] = useState(false)

  const content = {
    overview:     <OverviewTab />,
    projects:     <ProjectsTab />,
    certificates: <CertificatesTab />,
    messages:     <MessagesTab />,
  }

  const sidebarProps = {
    active,
    onNav: (id) => {
      if (id === 'settings') { setSettingsOpen(true); setMobileOpen(false) }
      else { setActive(id); setMobileOpen(false) }
    },
    collapsed,
    onToggleCollapse: () => setCollapsed((c) => !c),
    avatar: data.bio.avatar,
    name: data.bio.name,
    light,
    onToggleLight: toggleLight,
    onLogout: handleLogout,
  }

  return (
    <div className={`h-screen flex overflow-hidden ${light ? 'bg-gray-50' : 'bg-site-bg'}`}>
      <Sidebar {...sidebarProps} />

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-56 h-full">
            <Sidebar {...sidebarProps} mobile />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ── Settings Modal ── */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSettingsOpen(false)} />
          <div className={`relative w-full max-w-4xl h-[85vh] flex flex-col rounded-sm overflow-hidden shadow-2xl border ${
            light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
          }`}>
            <DashThemeContext.Provider value={light}>
              <SettingsTab onClose={() => setSettingsOpen(false)} />
            </DashThemeContext.Provider>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className={`border-b px-5 py-3.5 flex items-center justify-between shrink-0 ${light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'}`}>
          <div className="flex items-center gap-3">
            <button className="md:hidden text-site-muted hover:text-white" onClick={() => setMobileOpen(true)}>
              <Menu size={18} />
            </button>
            <span className={`font-mono font-black text-base tracking-tight ${light ? 'text-neon-light' : 'text-neon'}`}>NestStack_Tech</span>
            <span className={light ? 'text-gray-300' : 'text-site-border'}>/</span>
            <span className={`font-mono text-xs uppercase tracking-widest ${light ? 'text-gray-700' : 'text-white'}`}>
              {navItems.find((n) => n.id === active)?.label}
            </span>
          </div>
          <span className={`flex items-center gap-1.5 font-mono text-xs ${light ? 'text-neon-light' : 'text-neon'}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${light ? 'bg-neon-light' : 'bg-neon'}`} />
            Optimal
          </span>
        </header>

        <main className={`flex-1 overflow-y-auto ${light ? 'bg-gray-50' : ''}`}>
          <DashThemeContext.Provider value={light}>
            {content[active]}
          </DashThemeContext.Provider>
        </main>
      </div>
    </div>
  )
}
