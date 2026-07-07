import { Link } from 'react-router-dom'
import { LayoutDashboard, Activity, FolderOpen, Archive, Home, LogOut, ToggleLeft, ToggleRight } from 'lucide-react'
import { useState } from 'react'
import Reveal from '../components/ui/Reveal'

const navItems = [
  { label: 'Terminal', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Telemetry', icon: Activity, to: '/telemetry' },
  { label: 'Projects', icon: FolderOpen, to: '/projects' },
  { label: 'Archive', icon: Archive, to: '/archive' },
]

const logs = [
  { time: '14:22:01', type: 'INIT', msg: 'server.handshake OK' },
  { time: '14:22:05', type: 'AUTH', msg: 'user_id: 8192 verified' },
  { time: '14:22:12', type: 'PUSH', msg: 'data_stream: 14.5kbps' },
  { time: '14:22:18', type: 'WARN', msg: 'latency peak: 124ms' },
  { time: '14:22:25', type: 'INFO', msg: 'heartbeat_ack: primary_db' },
  { time: '14:22:31', type: 'SEC', msg: 'firewall_block: IP: 192.168.1.44' },
  { time: '14:22:45', type: 'DB_SYNC', msg: 'replication_slave_01 consistent' },
]

const bars = [20, 35, 50, 45, 80, 70, 60, 55, 40, 30, 45, 65]

function typeColor(t) {
  if (t === 'WARN') return 'text-yellow-400'
  if (t === 'SEC') return 'text-red-400'
  if (t === 'AUTH') return 'text-blue-400'
  return 'text-green-400'
}

export default function Telemetry() {
  const [controls, setControls] = useState({
    autoScaling: true,
    latencyShield: false,
    securityLogs: true,
  })

  const toggle = (key) => setControls((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <img src="/portimages/Dennis3.jpg" alt="Dennis" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Lead Architect</p>
              <p className="text-xs text-gray-400">System Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map(({ label, icon: Icon, to }) => {
            const active = label === 'Telemetry'
            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-3 px-5 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                  active ? 'bg-accent/10 text-gray-900 font-semibold border-l-2 border-accent' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-2 py-2 text-xs font-mono text-gray-400 hover:text-gray-900 uppercase tracking-widest">
            <Home size={15} /> Home
          </Link>
          <Link to="/login" className="flex items-center gap-3 px-2 py-2 text-xs font-mono text-red-400 hover:text-red-600 uppercase tracking-widest">
            <LogOut size={15} /> Logout
          </Link>
          <p className="font-mono text-xs text-gray-300 pt-2">v4.2.0-stable</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <Reveal direction="up" delay={100}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-mono text-xs text-green-500 uppercase tracking-widest flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              System Live
            </p>
            <h1 className="text-3xl font-black text-gray-900">Telemetric Overview</h1>
          </div>
          <div className="border border-gray-200 bg-white px-6 py-4 text-center shadow-sm">
            <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">Global Uptime</p>
            <p className="text-4xl font-black text-gray-900 mt-1">99.9%</p>
          </div>
        </div>
        </Reveal>

        <Reveal direction="up" delay={150}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-700 font-semibold">CPU Core Distribution</p>
                <span className="font-mono text-xs text-accent">Peak: 84.2%</span>
              </div>
              <div className="h-40 flex items-end gap-1.5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${i === 4 ? 'bg-accent' : 'bg-gray-200'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['00:00:00', '00:15:00', '00:30:00', '00:45:00'].map((t) => (
                  <span key={t} className="font-mono text-xs text-gray-400">{t}</span>
                ))}
              </div>
            </div>

            <div className="bg-dark-panel border border-gray-800 p-4 font-mono text-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-400 ml-2">bash — system_core — 80x24</span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {logs.map(({ time, type, msg }) => (
                  <div key={time + type} className="flex gap-3">
                    <span className="text-yellow-400 shrink-0">[{time}]</span>
                    <span className={`shrink-0 w-16 ${typeColor(type)}`}>{type}</span>
                    <span className="text-gray-300">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-5 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-700 font-semibold mb-4">Control Panel</p>
              {[
                { key: 'autoScaling', label: 'Auto-Scaling' },
                { key: 'latencyShield', label: 'Latency Shield' },
                { key: 'securityLogs', label: 'Security Logs' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between border border-gray-100 px-3 py-3 mb-2">
                  <span className="text-sm text-gray-700">{label}</span>
                  <button onClick={() => toggle(key)} className="transition-colors">
                    {controls[key]
                      ? <ToggleRight size={24} className="text-accent" />
                      : <ToggleLeft size={24} className="text-gray-300" />
                    }
                  </button>
                </div>
              ))}
              <button className="w-full mt-3 bg-gray-900 text-white font-mono text-xs tracking-widest uppercase py-3 hover:bg-gray-700 transition-colors">
                Deploy Changes
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-4 shadow-sm">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Throughput</p>
                <div className="h-16 flex items-end gap-1 mb-2">
                  {[30, 60, 45, 80, 55, 70].map((h, i) => (
                    <div key={i} className={`flex-1 rounded-t-sm ${i === 3 ? 'bg-accent' : 'bg-gray-200'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <p className="font-mono text-lg font-bold text-gray-900">12.4 <span className="text-xs font-normal text-gray-400">GB/S</span></p>
              </div>
              <div className="bg-white border border-gray-200 p-4 shadow-sm">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">Latency</p>
                <p className="font-mono text-xs text-green-500 flex items-center gap-1 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Stable
                </p>
                <p className="font-mono text-4xl font-black text-gray-900">12<span className="text-sm font-normal text-gray-400">ms</span></p>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </main>
    </div>
  )
}
