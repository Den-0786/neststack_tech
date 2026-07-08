import { TrendingUp, Calendar, Globe, Plus } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useDashTheme } from '../../context/DashThemeContext'
import { useState } from 'react'

const streamLayers = [
  {
    name: 'Organic Traffic',
    color: 'rgba(139, 92, 246, 0.6)',
    stroke: 'rgba(139, 92, 246, 0.8)',
    data: [15, 25, 20, 35, 30, 45, 40, 50, 45, 55, 50, 60],
  },
  {
    name: 'Direct Traffic',
    color: 'rgba(59, 130, 246, 0.6)',
    stroke: 'rgba(59, 130, 246, 0.8)',
    data: [20, 30, 25, 40, 35, 50, 45, 55, 50, 60, 55, 65],
  },
  {
    name: 'Referral Traffic',
    color: 'rgba(34, 197, 94, 0.6)',
    stroke: 'rgba(34, 197, 94, 0.8)',
    data: [10, 20, 15, 25, 20, 35, 30, 40, 35, 45, 40, 50],
  },
  {
    name: 'Social Traffic',
    color: 'rgba(251, 146, 60, 0.6)',
    stroke: 'rgba(251, 146, 60, 0.8)',
    data: [5, 15, 10, 20, 15, 25, 20, 30, 25, 35, 30, 40],
  },
]

function generateStreamPath(data, width, height, offset = 0) {
  const padding = 20
  const xStep = (width - padding * 2) / (data.length - 1)
  const centerY = height / 2
  const maxVal = Math.max(...data)
  const scale = (height * 0.15) / maxVal

  let path = `M ${padding} ${centerY - offset}`
  
  for (let i = 0; i < data.length; i++) {
    const x = padding + i * xStep
    const y = centerY - offset - data[i] * scale
    const nextX = padding + (i + 1) * xStep
    const nextY = centerY - offset - (data[i + 1] || data[i]) * scale
    
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
    const y = centerY + offset + data[i] * scale
    const prevX = padding + (i - 1) * xStep
    const prevY = centerY + offset + (data[i - 1] || data[i]) * scale
    
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
            {streamLayers.map((layer, layerIndex) => (
              <path
                key={layer.name}
                d={generateStreamPath(layer.data, 600, 100, layerIndex * 5)}
                fill={layer.color}
                stroke={layer.stroke}
                strokeWidth="0.5"
                style={{ mixBlendMode: 'multiply' }}
              />
            ))}
            {streamLayers.map((layer, layerIndex) => (
              <g key={layer.name}>
                {layer.data.map((value, i) => {
                  const padding = 20
                  const xStep = (600 - padding * 2) / (layer.data.length - 1)
                  const x = padding + i * xStep
                  const centerY = 50
                  const offset = layerIndex * 5
                  const maxVal = Math.max(...layer.data)
                  const scale = (100 * 0.15) / maxVal
                  const y = centerY - offset - value * scale
                  
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={hoveredStream === `${layerIndex}-${i}` ? 4 : 2}
                      fill={layer.stroke}
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredStream(`${layerIndex}-${i}`)}
                      onMouseLeave={() => setHoveredStream(null)}
                    />
                  )
                })}
              </g>
            ))}
          </svg>
          {hoveredStream !== null && (() => {
            const [layerIndex, dataIndex] = hoveredStream.split('-').map(Number)
            const layer = streamLayers[layerIndex]
            const value = layer.data[dataIndex]
            return (
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded text-xs font-mono whitespace-nowrap z-10 ${light ? 'bg-black text-white' : 'bg-white text-black'}`}>
                {layer.name}: {value} requests
              </div>
            )
          })()}
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
