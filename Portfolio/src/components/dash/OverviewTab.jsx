import { TrendingUp, Calendar, Globe, Plus } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useDashTheme } from '../../context/DashThemeContext'
import { useState } from 'react'

const streamData = [
  { time: '00:00', value: 18, label: 'Node Alpha - 18 requests' },
  { time: '02:00', value: 35, label: 'Node Alpha - 35 requests' },
  { time: '04:00', value: 28, label: 'Node Alpha - 28 requests' },
  { time: '06:00', value: 55, label: 'Node Beta - 55 requests' },
  { time: '08:00', value: 42, label: 'Node Beta - 42 requests' },
  { time: '10:00', value: 70, label: 'Node Beta - 70 requests' },
  { time: '12:00', value: 58, label: 'Node Gamma - 58 requests' },
  { time: '14:00', value: 80, label: 'Node Gamma - 80 requests' },
  { time: '16:00', value: 65, label: 'Node Gamma - 65 requests' },
  { time: '18:00', value: 88, label: 'Node Delta - 88 requests' },
  { time: '20:00', value: 72, label: 'Node Delta - 72 requests' },
  { time: '22:00', value: 95, label: 'Node Delta - 95 requests' },
]

function generateStreamPath(data, width, height, color) {
  const padding = 20
  const xStep = (width - padding * 2) / (data.length - 1)
  const centerY = height / 2
  const maxVal = Math.max(...data.map(d => d.value))
  const scale = (height * 0.35) / maxVal

  let path = `M ${padding} ${centerY}`
  
  for (let i = 0; i < data.length; i++) {
    const x = padding + i * xStep
    const y = centerY - data[i].value * scale
    const nextX = padding + (i + 1) * xStep
    const nextY = centerY - (data[i + 1]?.value || data[i].value) * scale
    
    if (i < data.length - 1) {
      const cp1x = x + xStep / 3
      const cp1y = y
      const cp2x = nextX - xStep / 3
      const cp2y = nextY
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`
    }
  }

  // Mirror the path for the bottom
  for (let i = data.length - 1; i >= 0; i--) {
    const x = padding + i * xStep
    const y = centerY + data[i].value * scale
    const prevX = padding + (i - 1) * xStep
    const prevY = centerY + (data[i - 1]?.value || data[i].value) * scale
    
    if (i > 0) {
      const cp1x = x - xStep / 3
      const cp1y = y
      const cp2x = prevX + xStep / 3
      const cp2y = prevY
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${prevX} ${prevY}`
    }
  }

  path += ' Z'
  return path
}

export default function OverviewTab() {
  const { data } = usePortfolio()
  const light = useDashTheme()
  const [hoveredStream, setHoveredStream] = useState(null)
  const card = light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
  const label = light ? 'text-gray-500' : 'text-site-muted'
  const heading = light ? 'text-gray-900' : 'text-white'
  const sub = light ? 'text-gray-500' : 'text-gray-400'
  const accent = light ? 'text-green-700' : 'text-neon'
  const moduleRow = light ? 'border-gray-200' : 'border-site-border'

  const stats = [
    { label: 'Daily Visits', value: data.bio.name ? '0' : 'N/A', change: 'Awaiting data', icon: TrendingUp },
    { label: 'Monthly Reach', value: data.bio.name ? '0' : 'N/A', change: 'Awaiting data', icon: Calendar },
    { label: 'Annual Traffic', value: data.bio.name ? '0' : 'N/A', change: 'Awaiting data', icon: Globe },
  ]

  const modules = data.skills.length > 0
    ? data.skills.slice(0, 3).map((skill, i) => ({ name: skill.category, icon: ['❖', '⬡', '⬢'][i % 3] }))
    : [{ name: 'No modules', icon: '○' }]

  return (
    <div className="px-5 py-5 space-y-4">
      <div className={`flex items-center justify-between border px-4 py-2.5 ${card}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          <span className={`font-mono text-xs uppercase tracking-widest ${heading}`}>System_Status:</span>
          <span className={`font-mono text-xs font-bold uppercase ${accent}`}>Optimal</span>
        </div>
      </div>

      {stats.map(({ label: lbl, value, change, icon: Icon }) => (
        <div key={lbl} className={`border p-5 ${card}`}>
          <div className="flex items-start justify-between mb-3">
            <p className={`font-mono text-xs uppercase tracking-widest ${label}`}>{lbl}</p>
            <Icon size={16} className={`${accent} opacity-30`} />
          </div>
          <p className={`text-4xl font-black mb-1 ${heading}`}>{value}</p>
          <p className={`font-mono text-xs ${accent}`}>{change}</p>
        </div>
      ))}

      <div className={`border p-5 ${card}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={`font-bold text-lg leading-tight ${heading}`}>Traffic<br />Stream<br />Analytics</h3>
            <p className={`text-xs mt-1 max-w-[120px] ${sub}`}>
              Visualizing organic vs. direct traffic distributions across edge nodes.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button className={`font-mono text-xs border border-neon/40 px-3 py-1.5 uppercase tracking-widest hover:bg-neon/10 transition-colors ${accent}`}>
              Real-time
            </button>
            <button className="font-mono text-xs bg-neon text-black px-3 py-1.5 uppercase tracking-widest font-bold hover:bg-neon-dim transition-colors">
              Export Logs
            </button>
          </div>
        </div>

        <div className="h-24 mt-4 relative">
          <svg width="100%" height="100%" viewBox="0 0 600 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={light ? 'rgba(0,100,0,0.3)' : 'rgba(57,255,20,0.3)'} />
                <stop offset="50%" stopColor={light ? 'rgba(0,150,0,0.5)' : 'rgba(57,255,20,0.5)'} />
                <stop offset="100%" stopColor={light ? 'rgba(0,100,0,0.3)' : 'rgba(57,255,20,0.3)'} />
              </linearGradient>
            </defs>
            <path
              d={generateStreamPath(streamData, 600, 100)}
              fill="url(#streamGradient)"
              stroke={light ? 'rgba(0,100,0,0.6)' : 'rgba(57,255,20,0.6)'}
              strokeWidth="1"
            />
            {streamData.map((stream, i) => {
              const padding = 20
              const xStep = (600 - padding * 2) / (streamData.length - 1)
              const x = padding + i * xStep
              const centerY = 50
              const maxVal = Math.max(...streamData.map(d => d.value))
              const scale = (100 * 0.35) / maxVal
              const y = centerY - stream.value * scale
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hoveredStream === i ? 6 : 3}
                  fill={light ? '#006400' : '#39ff14'}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredStream(i)}
                  onMouseLeave={() => setHoveredStream(null)}
                />
              )
            })}
          </svg>
          {hoveredStream !== null && (
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs font-mono whitespace-nowrap z-10 ${light ? 'bg-black text-white' : 'bg-white text-black'}`}>
              {streamData[hoveredStream].label}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2">
          {['00:00', '06:00', '12:00', '18:00', '23:59'].map((t) => (
            <span key={t} className={`font-mono text-xs ${label}`}>{t}</span>
          ))}
        </div>
      </div>

      <div className={`border p-5 ${card}`}>
        <p className={`font-mono text-xs uppercase tracking-widest mb-4 ${label}`}>
          Active Tech Stack / Modules
        </p>
        <div className="space-y-2">
          {modules.map((m) => (
            <div key={m.name} className={`flex items-center gap-3 border px-4 py-3 ${moduleRow}`}>
              <span className={`text-sm ${accent}`}>{m.icon}</span>
              <span className={`font-mono text-sm ${heading}`}>{m.name}</span>
            </div>
          ))}
          <button className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity ${accent}`}>
            <Plus size={13} /> Connect Module
          </button>
        </div>
      </div>
    </div>
  )
}
