import { useState, useEffect } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

// Fetch real traffic analytics data from backend
async function fetchTrafficAnalyticsData() {
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:10000').replace(/\/$/, '') + '/api'
  try {
    const response = await fetch(`${API_URL}/portfolio/traffic/analytics`)
    if (!response.ok) {
      throw new Error('Failed to fetch traffic data')
    }
    const data = await response.json()
    
    if (!Array.isArray(data) || data.length === 0) {
      return []
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch traffic data:', error)
    return []
  }
}

// Fallback to mock data if no real data available
function generateMockTrafficData() {
  const hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', 
                '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  
  const data = []
  
  for (let i = 0; i < 24; i++) {
    const hourData = {
      hour: hours[i],
    }
    
    // Generate realistic traffic patterns with peaks during business hours
    const baseTraffic = 20 + Math.sin((i - 6) * 0.3) * 30 + Math.random() * 10
    hourData['organic'] = Math.max(5, Math.round(baseTraffic * 0.4))
    hourData['direct'] = Math.max(5, Math.round(baseTraffic * 0.35))
    hourData['referral'] = Math.max(5, Math.round(baseTraffic * 0.25))
    
    data.push(hourData)
  }
  
  return data
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  
  const total = payload.reduce((sum, p) => sum + p.value, 0)
  
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl">
      <p className="font-bold text-white text-sm mb-3">{label}</p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/80 text-xs font-medium capitalize">
                {entry.dataKey}
              </span>
            </div>
            <span className="text-white text-xs font-bold">{entry.value}</span>
          </div>
        ))}
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-xs font-bold">Total Traffic</span>
            <span className="text-white text-sm font-bold">{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrafficStreamgraph() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const realData = await fetchTrafficAnalyticsData()
      
      if (realData.length === 0) {
        const mockData = generateMockTrafficData()
        setData(mockData)
      } else {
        setData(realData)
      }
      setLoading(false)
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="h-[250px] bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 animate-pulse" />
    )
  }

  // Color palette for the streams (different from visitor streamgraph)
  const colors = [
    '#F97316', // Orange - Organic
    '#10B981', // Emerald - Direct
    '#06B6D4', // Cyan - Referral
  ]
  
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[1]} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[2]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colors[2]} stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="hour" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
            tickMargin={10}
            interval={3}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
          />
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          
          <Area
            type="monotone"
            dataKey="organic"
            stackId="1"
            stroke={colors[0]}
            strokeWidth={2}
            fill="url(#colorOrganic)"
          />
          <Area
            type="monotone"
            dataKey="direct"
            stackId="1"
            stroke={colors[1]}
            strokeWidth={2}
            fill="url(#colorDirect)"
          />
          <Area
            type="monotone"
            dataKey="referral"
            stackId="1"
            stroke={colors[2]}
            strokeWidth={2}
            fill="url(#colorReferral)"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[0] }} />
          <span className="text-gray-400 text-xs">Organic Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[1] }} />
          <span className="text-gray-400 text-xs">Direct Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[2] }} />
          <span className="text-gray-400 text-xs">Referral Traffic</span>
        </div>
      </div>
    </div>
  )
}
