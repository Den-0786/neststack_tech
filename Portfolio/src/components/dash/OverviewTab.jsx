import { TrendingUp, Calendar, Globe, Plus } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useDashTheme } from '../../context/DashThemeContext'
import { useState, useEffect } from 'react'
import { getVisitorStats } from '../../utils/visitorTracking'

const streamLayers = [
  {
    name: 'Organic Traffic',
    color: 'rgba(139, 92, 246, 0.5)',
    stroke: 'rgba(139, 92, 246, 0.8)',
    data: [25, 40, 35, 55, 45, 65, 55, 75, 65, 85, 75, 95],
  },
  {
    name: 'Direct Traffic',
    color: 'rgba(59, 130, 246, 0.5)',
    stroke: 'rgba(59, 130, 246, 0.8)',
    data: [35, 50, 45, 65, 55, 75, 65, 85, 75, 95, 85, 100],
  },
  {
    name: 'Referral Traffic',
    color: 'rgba(34, 197, 94, 0.5)',
    stroke: 'rgba(34, 197, 94, 0.8)',
    data: [20, 35, 30, 50, 40, 60, 50, 70, 60, 80, 70, 85],
  },
]

function generateWavePath(data, width, height, yOffset = 0) {
  const padding = 20
  const xStep = (width - padding * 2) / (data.length - 1)
  const baseline = height - 20
  const maxVal = Math.max(...data)
  const scale = (height * 0.6) / maxVal

  let path = `M ${padding} ${baseline}`
  
  for (let i = 0; i < data.length; i++) {
    const x = padding + i * xStep
    const y = baseline - yOffset - data[i] * scale
    const nextX = padding + (i + 1) * xStep
    const nextY = baseline - yOffset - (data[i + 1] || data[i]) * scale
    
    if (i < data.length - 1) {
      const cp1x = x + xStep / 2
      const cp1y = y
      const cp2x = nextX - xStep / 2
      const cp2y = nextY
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nextX} ${nextY}`
    }
  }

  path += ` L ${width - padding} ${baseline} Z`
  return path
}

export default function OverviewTab() {
  const { data } = usePortfolio()
  const light = useDashTheme()
  const [hoveredStream, setHoveredStream] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, flip: false })
  const [visitorStats, setVisitorStats] = useState({ daily: 0, monthly: 0, annual: 0 })

  useEffect(() => {
    getVisitorStats().then(setVisitorStats)
  }, [])

  const card = light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
  const label = light ? 'text-gray-500' : 'text-site-muted'
  const heading = light ? 'text-gray-900' : 'text-white'
  const sub = light ? 'text-gray-500' : 'text-gray-400'
  const accent = light ? 'text-green-700' : 'text-neon'
  const moduleRow = light ? 'border-gray-200' : 'border-site-border'

  const stats = [
    { label: 'Daily Visits', value: data.bio.name ? visitorStats.daily : 'N/A', change: 'Unique visitors today', icon: TrendingUp },
    { label: 'Monthly Reach', value: data.bio.name ? visitorStats.monthly : 'N/A', change: 'Last 30 days', icon: Calendar },
    { label: 'Annual Traffic', value: data.bio.name ? visitorStats.annual : 'N/A', change: 'Last 365 days', icon: Globe },
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
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 600 100" 
            preserveAspectRatio="none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = (e.clientX - rect.left) / rect.width * 600
              const padding = 20
              const xStep = (600 - padding * 2) / (streamLayers[0].data.length - 1)
              const relativeX = x - padding
              const dataIndex = Math.round(relativeX / xStep)
              const clampedIndex = Math.max(0, Math.min(streamLayers[0].data.length - 1, dataIndex))
              setHoveredStream(clampedIndex)
              const screenMidpoint = window.innerWidth / 2
              const flip = e.clientX > screenMidpoint
              setTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top, flip })
            }}
            onMouseLeave={() => setHoveredStream(null)}
          >
            {streamLayers.map((layer, layerIndex) => (
              <path
                key={layer.name}
                d={generateWavePath(layer.data, 600, 100, layerIndex * 8)}
                fill={layer.color}
                stroke={layer.stroke}
                strokeWidth="1"
              />
            ))}
            {hoveredStream !== null && (
              <g>
                <line
                  x1={20 + hoveredStream * ((600 - 40) / (streamLayers[0].data.length - 1))}
                  y1={0}
                  x2={20 + hoveredStream * ((600 - 40) / (streamLayers[0].data.length - 1))}
                  y2={100}
                  stroke={light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {streamLayers.map((layer, layerIndex) => {
                  const x = 20 + hoveredStream * ((600 - 40) / (layer.data.length - 1))
                  const baseline = 80
                  const maxVal = Math.max(...layer.data)
                  const scale = 60 / maxVal
                  const y = baseline - layerIndex * 8 - layer.data[hoveredStream] * scale
                  return (
                    <circle
                      key={layerIndex}
                      cx={x}
                      cy={y}
                      r={5}
                      fill={layer.stroke}
                      stroke={light ? 'white' : 'black'}
                      strokeWidth="2"
                    />
                  )
                })}
              </g>
            )}
          </svg>
          {hoveredStream !== null && (
            <div 
              className={`absolute px-3 py-2 rounded text-xs font-mono z-10 pointer-events-none ${light ? 'bg-black text-white' : 'bg-white text-black'}`}
              style={{ 
                left: tooltipPosition.flip ? tooltipPosition.x - 10 : tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                transform: tooltipPosition.flip ? 'translate(-100%, -100%)' : 'translate(0, -100%)'
              }}
            >
              {streamLayers.map(layer => (
                <div key={layer.name}>{layer.name}: {layer.data[hoveredStream]} req</div>
              ))}
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
