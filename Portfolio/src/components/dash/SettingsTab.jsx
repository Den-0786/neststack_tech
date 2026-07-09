import { useState } from 'react'
import { Shield, Mail, AlertTriangle, Eye, EyeOff, User, Plus, Trash2, BookOpen, Bell, Globe, Lock, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useDashTheme } from '../../context/DashThemeContext'
import S3ImageUpload from '../ui/S3ImageUpload'

function ToggleItem({ label, defaultOn, light, panel, heading }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className={`flex items-center justify-between border px-4 py-3 ${panel}`}>
      <span className={`font-mono text-xs ${heading}`}>{label}</span>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={`w-9 h-5 rounded-full transition-colors relative ${on ? (light ? 'bg-green-700' : 'bg-neon') : (light ? 'bg-gray-300' : 'bg-site-border')}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${on ? 'left-4' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

const TABS = [
  { id: 'about',       label: 'About Me',         icon: User },
  { id: 'skills',      label: 'Skills',            icon: BookOpen },
  { id: 'contact',     label: 'Contact & Social',  icon: Mail },
  { id: 'credentials', label: 'Credentials',       icon: Shield },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
  { id: 'website',     label: 'About the Website', icon: Globe },
  { id: 'privacy',     label: 'Privacy',           icon: Lock },
]

export default function SettingsTab({ onClose }) {
  const { data, updateBio, updateContact, addSkillGroup, deleteSkillGroup, resetToDefaults } = usePortfolio()
  const light = useDashTheme()

  const bg      = light ? 'bg-gray-50'             : 'bg-site-bg'
  const panel   = light ? 'bg-white border-gray-200'   : 'bg-site-card border-site-border'
  const sidebar = light ? 'bg-gray-100 border-gray-200' : 'bg-site-card border-site-border'
  const lbl     = light ? 'text-gray-500'              : 'text-site-muted'
  const heading = light ? 'text-gray-900'              : 'text-white'
  const accent  = light ? 'text-green-700'             : 'text-neon'
  const accentBg = light ? 'bg-green-700/10 text-green-700 border-green-700/20' : 'bg-neon/10 text-neon border-neon/20'
  const divider = light ? 'border-gray-200'            : 'border-site-border'
  const inp     = light
    ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    : 'bg-site-bg border-site-border text-white placeholder-site-muted'

  const [activeTab, setActiveTab] = useState('about')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [danger, setDanger] = useState(false)
  const [showPin, setShowPin] = useState(false)

  function flash() { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  
  function handleDeleteSkill(id) {
    if (window.confirm('Are you sure you want to delete this skill group? This action cannot be undone.')) {
      deleteSkillGroup(id)
    }
  }
  const inp_cls = `w-full px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors border ${inp}`
  const small_label = `font-mono text-[10px] uppercase tracking-widest block mb-1.5 ${lbl}`

  /* ── About / Bio ── */
  const [about, setAbout] = useState({
    name: data.bio.name,
    location: data.bio.location,
    about: data.bio.about,
    avatar: data.bio.avatar,
    cvUrl: data.bio.cvUrl || '#',
    githubUrl: data.bio.githubUrl || '#',
    roles: (data.bio.roles || []).join(', '),
  })
  function saveAbout(e) {
    e.preventDefault()
    updateBio({
      name: about.name,
      location: about.location,
      about: about.about,
      avatar: about.avatar,
      cvUrl: about.cvUrl,
      githubUrl: about.githubUrl,
      roles: about.roles.split(',').map((r) => r.trim()).filter(Boolean),
    })
    flash()
  }

  /* ── Skills ── */
  const [newSkill, setNewSkill] = useState({ category: '', items: '' })
  function saveSkill(e) {
    e.preventDefault()
    if (!newSkill.category) return
    addSkillGroup({ category: newSkill.category, items: newSkill.items.split(',').map((i) => i.trim()).filter(Boolean) })
    setNewSkill({ category: '', items: '' })
    flash()
  }

  /* ── Contact ── */
  const [contact, setContact] = useState({
    name: data.bio.name,
    phone: data.contact.phone1,
    email: data.contact.email,
    address: data.bio.location,
  })
  function saveContact(e) {
    e.preventDefault()
    updateBio({ name: contact.name, location: contact.address })
    updateContact({ phone1: contact.phone, email: contact.email })
    flash()
  }

  /* ── Socials ── */
  const [social, setSocial] = useState({
    linkedin: data.contact.linkedin || '',
    github: data.contact.twitter || '',
    instagram: data.contact.instagram || '',
    facebook: data.contact.facebook || '',
  })
  function saveSocial(e) {
    e.preventDefault()
    updateContact({ linkedin: social.linkedin, twitter: social.github, instagram: social.instagram, facebook: social.facebook })
    flash()
  }

  /* ── Admin credentials ── */
  const [profile, setProfile] = useState({ username: data.bio.name, pin: '', oldPassword: '', password: '' })
  const [credError, setCredError] = useState('')
  async function saveProfile(e) {
    e.preventDefault()
    if (profile.password || profile.oldPassword) {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      try {
        const response = await fetch(`${API_BASE}/api/auth/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: profile.username,
            oldPassword: profile.oldPassword,
            newPassword: profile.password,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          setCredError(data.error || 'Failed to change password')
          return
        }
      } catch (error) {
        setCredError('Failed to change password')
        return
      }
    }
    setCredError('')
    updateBio({ name: profile.username })
    setProfile((p) => ({ ...p, oldPassword: '', password: '' }))
    flash()
  }

  const activeTabMeta = TABS.find((t) => t.id === activeTab)

  /* ── Panel content ── */
  function renderContent() {
    if (activeTab === 'about') return (
      <form onSubmit={saveAbout} className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className={small_label}>Full Name</label>
            <input value={about.name} onChange={(e) => setAbout((a) => ({ ...a, name: e.target.value }))} placeholder="Dennis Opoku Amponsah" className={inp_cls} />
          </div>
          <div>
            <label className={small_label}>About Me</label>
            <textarea value={about.about} onChange={(e) => setAbout((a) => ({ ...a, about: e.target.value }))} rows={3} placeholder="Write something about yourself..." className={`w-full px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors resize-none border ${inp}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={small_label}>Location</label>
              <input value={about.location} onChange={(e) => setAbout((a) => ({ ...a, location: e.target.value }))} placeholder="Kumasi, Ghana" className={inp_cls} />
            </div>
            <div>
              <label className={small_label}>Roles (comma sep)</label>
              <textarea value={about.roles} onChange={(e) => setAbout((a) => ({ ...a, roles: e.target.value }))} placeholder="Frontend Dev, Cybersecurity..." rows={2} className={`w-full px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors resize-y border ${inp}`} />
            </div>
            <div>
              <label className={small_label}>CV URL</label>
              <input value={about.cvUrl} onChange={(e) => setAbout((a) => ({ ...a, cvUrl: e.target.value }))} placeholder="/files/cv.pdf or https://..." className={inp_cls} />
            </div>
            <div>
              <label className={small_label}>GitHub URL</label>
              <input value={about.githubUrl} onChange={(e) => setAbout((a) => ({ ...a, githubUrl: e.target.value }))} placeholder="https://github.com/you" className={inp_cls} />
            </div>
          </div>
          <div>
            <label className={small_label}>Profile Picture</label>
            <S3ImageUpload folder="avatars" preview={about.avatar} light={light} onUploaded={(url) => setAbout((a) => ({ ...a, avatar: url }))} />
          </div>
        </div>
        <button type="submit" className="bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-2.5 hover:bg-neon-dim transition-colors">
          Save Changes
        </button>
      </form>
    )

    if (activeTab === 'skills') return (
      <div className="space-y-4">
        <div className="space-y-2">
          {data.skills.map((g) => (
            <div key={g.id} className={`flex items-center justify-between border px-4 py-3 ${panel}`}>
              <div>
                <p className={`font-mono text-xs font-semibold ${heading}`}>{g.category}</p>
                <p className={`font-mono text-[10px] mt-0.5 ${lbl}`}>{g.items.join(', ')}</p>
              </div>
              <button onClick={() => handleDeleteSkill(g.id)} className="text-red-400/50 hover:text-red-400 shrink-0 ml-3 transition-colors"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
        <div className={`border p-4 space-y-3 ${panel}`}>
          <p className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${accent}`}>Add New Skill Group</p>
          <form onSubmit={saveSkill} className="space-y-2">
            <input value={newSkill.category} onChange={(e) => setNewSkill((s) => ({ ...s, category: e.target.value }))} placeholder="Category name (e.g. CORE ARCHITECTURE)" className={inp_cls} />
            <textarea value={newSkill.items} onChange={(e) => setNewSkill((s) => ({ ...s, items: e.target.value }))} placeholder="Skills, comma separated (e.g. React, Node.js)" rows={2} className={`w-full px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors resize-y border ${inp}`} />
            <button type="submit" className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-neon text-black px-4 py-2 hover:bg-neon-dim transition-colors">
              <Plus size={12} /> Add Group
            </button>
          </form>
        </div>
      </div>
    )

    if (activeTab === 'contact') return (
      <div className="space-y-6">
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-widest font-semibold mb-3 ${accent}`}>Contact Points</p>
          <form onSubmit={saveContact} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={small_label}>Name</label>
                <input value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} placeholder="Your Name" className={inp_cls} />
              </div>
              <div>
                <label className={small_label}>Location</label>
                <input value={contact.address} onChange={(e) => setContact((c) => ({ ...c, address: e.target.value }))} placeholder="City, Country" className={inp_cls} />
              </div>
              <div>
                <label className={small_label}>Phone</label>
                <input value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} placeholder="+233 245 660 786" className={inp_cls} />
              </div>
              <div>
                <label className={small_label}>Email</label>
                <input value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} placeholder="you@domain.com" className={inp_cls} />
              </div>
            </div>
            <button type="submit" className="bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-2.5 hover:bg-neon-dim transition-colors">
              Save Contact
            </button>
          </form>
        </div>
        <div className={`border-t ${divider}`} />
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-widest font-semibold mb-3 ${accent}`}>Social Links</p>
          <form onSubmit={saveSocial} className="space-y-2">
            {[
              { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/you' },
              { key: 'github',    label: 'GitHub',    placeholder: 'https://github.com/you' },
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/you' },
              { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/you' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className={`flex items-center gap-3 border px-3 py-2.5 ${light ? 'border-gray-200' : 'border-site-border'}`}>
                <span className={`font-mono text-[10px] w-16 shrink-0 ${accent}`}>{label}</span>
                <input value={social[key]} onChange={(e) => setSocial((s) => ({ ...s, [key]: e.target.value }))} placeholder={placeholder} className={`bg-transparent text-[11px] font-mono flex-1 focus:outline-none ${heading}`} />
              </div>
            ))}
            <button type="submit" className="bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-2.5 hover:bg-neon-dim transition-colors mt-1">
              Save Socials
            </button>
          </form>
        </div>
      </div>
    )

    if (activeTab === 'credentials') return (
      <form onSubmit={saveProfile} className="space-y-4 max-w-sm">
        <div>
          <label className={small_label}>Username</label>
          <input value={profile.username} onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))} placeholder="Your name" className={inp_cls} />
        </div>
        <div className={`border-t pt-4 ${divider}`}>
          <p className={`font-mono text-[10px] uppercase tracking-widest font-semibold mb-3 ${accent}`}>Change Password</p>
          <div className="space-y-3">
            <div>
              <label className={small_label}>Old Password</label>
              <div className="relative">
                <input type={showPin ? 'text' : 'password'} value={profile.oldPassword} onChange={(e) => setProfile((p) => ({ ...p, oldPassword: e.target.value }))} placeholder="Current password" className={inp_cls} />
                <button type="button" onClick={() => setShowPin(!showPin)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${lbl}`}>
                  {showPin ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
            <div>
              <label className={small_label}>New Password</label>
              <input type="password" value={profile.password} onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))} placeholder="Min 8 characters" className={inp_cls} />
              <p className={`font-mono text-[10px] mt-1 ${lbl}`}>Leave blank to keep current password.</p>
            </div>
          </div>
        </div>
        {credError && (
          <p className="font-mono text-[10px] text-red-400 border border-red-500/30 bg-red-500/10 px-3 py-2">{credError}</p>
        )}
        <button type="submit" className="bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-2.5 hover:bg-neon-dim transition-colors">
          Update Credentials
        </button>
        <div className={`border-t pt-4 mt-2 ${divider}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={13} className="text-red-400" />
            <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest font-semibold">Danger Zone</p>
          </div>
          <p className={`font-mono text-[10px] leading-relaxed mb-3 ${lbl}`}>Reset all portfolio data to defaults. This cannot be undone.</p>
          {!danger ? (
            <button type="button" onClick={() => setDanger(true)} className="border border-red-500/40 text-red-400 font-mono font-bold text-[10px] uppercase tracking-widest px-6 py-2.5 hover:bg-red-500/10 transition-colors">
              Reset All Data
            </button>
          ) : (
            <div className="space-y-2">
              <p className="font-mono text-[10px] text-red-400">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => { resetToDefaults(); setDanger(false); flash() }} className="bg-red-500 text-white font-mono font-bold text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-red-600 transition-colors">
                  Confirm Reset
                </button>
                <button type="button" onClick={() => setDanger(false)} className={`border font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 ${light ? 'border-gray-200 text-gray-500' : 'border-site-border text-site-muted'}`}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    )

    if (activeTab === 'notifications') return (
      <div className="space-y-3 max-w-sm">
        <p className={`font-mono text-[10px] leading-relaxed ${lbl}`}>Notification preferences — coming soon.</p>
        {[
          { label: 'New message received', defaultOn: true },
          { label: 'New document attachment', defaultOn: true },
          { label: 'System alerts', defaultOn: false },
        ].map(({ label, defaultOn }) => (
          <ToggleItem key={label} label={label} defaultOn={defaultOn} light={light} panel={panel} heading={heading} />
        ))}
      </div>
    )

    if (activeTab === 'website') return (
      <div className="space-y-3 max-w-sm">
        {[
          { label: 'Site Name',    value: 'NestStack_Tech' },
          { label: 'Version',      value: 'v4.2.0-stable' },
          { label: 'Framework',    value: 'React + Vite + Tailwind' },
          { label: 'Hosting',      value: 'Netlify / Custom VPS' },
          { label: 'Theme Engine', value: 'Time-based Auto (6pm–6am Light)' },
        ].map(({ label, value }) => (
          <div key={label} className={`flex items-center justify-between border px-4 py-3 ${panel}`}>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${lbl}`}>{label}</span>
            <span className={`font-mono text-xs font-semibold ${heading}`}>{value}</span>
          </div>
        ))}
      </div>
    )

    if (activeTab === 'privacy') return (
      <div className="space-y-3 max-w-sm">
        <p className={`font-mono text-[10px] leading-relaxed ${lbl}`}>Control who can interact with your public portfolio.</p>
        {[
          { label: 'Allow contact form submissions', defaultOn: true },
          { label: 'Allow file attachments in messages', defaultOn: true },
          { label: 'Show email publicly', defaultOn: false },
          { label: 'Show phone publicly', defaultOn: false },
        ].map(({ label, defaultOn }) => (
          <ToggleItem key={label} label={label} defaultOn={defaultOn} light={light} panel={panel} heading={heading} />
        ))}
      </div>
    )

    return null
  }

  return (
    <div className={`flex h-full overflow-hidden ${bg}`}>

      {/* ── Left Sidebar ── */}
      <aside className={`shrink-0 border-r flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-14' : 'w-52'
      } ${sidebar}`}>
        {/* Sidebar header */}
        <div className={`flex items-center justify-between px-3 py-4 border-b ${divider}`}>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <p className={`font-mono font-black text-sm ${heading}`}>Settings</p>
              <p className={`font-mono text-[10px] mt-0.5 ${lbl}`}>Manage your portfolio</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className={`shrink-0 p-1 rounded transition-colors ${lbl} hover:${heading} ${sidebarCollapsed ? 'mx-auto' : 'ml-auto'}`}
          >
            {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
        {/* Nav items */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                title={sidebarCollapsed ? label : undefined}
                className={`w-full flex items-center gap-3 py-2.5 text-left transition-colors group relative ${
                  sidebarCollapsed ? 'justify-center px-0' : 'px-4'
                } ${
                  isActive
                    ? `border-l-2 ${light ? 'border-green-700 bg-green-700/5 text-green-700' : 'border-neon bg-neon/5 text-neon'}`
                    : `border-l-2 border-transparent ${lbl}`
                }`}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 1.5} className="shrink-0" />
                {!sidebarCollapsed && <span className="font-mono text-xs">{label}</span>}
                {sidebarCollapsed && (
                  <span className={`absolute left-full ml-2 px-2 py-1 font-mono text-xs whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border ${
                    light ? 'bg-white border-gray-200 text-gray-900' : 'bg-site-card border-site-border text-white'
                  }`}>{label}</span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* ── Right Content Panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className={`px-6 py-4 border-b shrink-0 flex items-center justify-between ${divider} ${light ? 'bg-white' : 'bg-site-card'}`}>
          <div>
            <div className="flex items-center gap-2">
              {activeTabMeta && (() => { const Icon = activeTabMeta.icon; return <Icon size={15} className={accent} /> })()}
              <h2 className={`font-mono font-bold text-sm ${heading}`}>{activeTabMeta?.label}</h2>
            </div>
            <p className={`font-mono text-[10px] mt-0.5 ${lbl}`}>All changes reflect live on the public portfolio.</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded transition-colors ${light ? 'text-gray-400 hover:text-gray-900 hover:bg-gray-100' : 'text-site-muted hover:text-white hover:bg-site-bg'}`}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Save banner */}
        {saved && (
          <div className={`px-6 py-2 font-mono text-xs uppercase tracking-widest border-b ${light ? 'bg-green-700/5 border-green-700/20 text-green-700' : 'bg-neon/5 border-neon/20 text-neon'}`}>
            ✓ Changes saved — live on portfolio.
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
