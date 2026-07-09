import { useState, useEffect } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

// Fetch real weekly visitor data from backend
async function fetchWeeklyVisitorData() {
  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:10000').replace(/\/$/, '') + '/api'
  try {
    const response = await fetch(`${API_URL}/portfolio/visitors/weekly`)
    if (!response.ok) {
      throw new Error('Failed to fetch visitor data')
    }
    const data = await response.json()
    
    if (!Array.isArray(data) || data.length === 0) {
      return []
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch visitor data:', error)
    return []
  }
}

// Custom tooltip component
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  
  const weeks = payload.filter(p => p.value > 0)
  const total = weeks.reduce((sum, p) => sum + p.value, 0)
  
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl">
      <p className="font-bold text-white text-sm mb-3">{label}</p>
      <div className="space-y-2">
        {weeks.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-white/80 text-xs font-medium">
                {entry.dataKey.replace('week', 'Week ')}
              </span>
            </div>
            <span className="text-white text-xs font-bold">{entry.value}</span>
          </div>
        ))}
        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-xs font-bold">Total Monthly</span>
            <span className="text-white text-sm font-bold">{total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VisitorStreamgraph() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const realData = await fetchWeeklyVisitorData()
      setData(realData)
      setLoading(false)
    }
    
    loadData()
  }, [])
  
  // Calculate statistics
  const currentMonthIndex = Math.min(new Date().getMonth(), data.length - 1)
  const currentMonthData = data[currentMonthIndex] || {}
  const currentMonthWeeks = Object.keys(currentMonthData)
    .filter(key => key.startsWith('week'))
    .length
  
  const totalVisitorsThisYear = data.reduce((sum, month) => {
    return sum + Object.entries(month)
      .filter(([key]) => key.startsWith('week'))
      .reduce((weekSum, [, value]) => weekSum + (value || 0), 0)
  }, 0)
  
  const totalVisitorsAllMonths = totalVisitorsThisYear
  
  // Format numbers to show clean display
  const formatNumber = (num) => {
    if (num === 0) return '0'
    return num.toString()
  }
  
  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-700 rounded w-16 mb-1" />
              <div className="h-3 bg-gray-700 rounded w-24" />
            </div>
          ))}
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 h-[400px] animate-pulse" />
      </div>
    )
  }
  const colors = [
    '#8B5CF6', // Purple
    '#3B82F6', // Blue
    '#14B8A6', // Teal
    '#EC4899', // Magenta
    '#F59E0B', // Amber
  ]
  
  return (
    <div className="w-full space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Month Weeks Card */}
        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-purple-300 text-xs font-medium uppercase tracking-wider">Current Month</p>
              <p className="text-white text-2xl font-bold">{currentMonthWeeks}</p>
            </div>
          </div>
          <p className="text-purple-200/60 text-xs">Active weeks with visitors</p>
        </div>
        
        {/* Total Visitors This Year Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-teal-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-blue-300 text-xs font-medium uppercase tracking-wider">Year to Date</p>
              <p className="text-white text-2xl font-bold">{formatNumber(totalVisitorsThisYear)}</p>
            </div>
          </div>
          <p className="text-blue-200/60 text-xs">Total visitors this year</p>
        </div>
        
        {/* Total Visitors All Time Card */}
        <div className="bg-gradient-to-br from-teal-500/20 to-magenta-500/20 backdrop-blur-sm border border-teal-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-teal-300 text-xs font-medium uppercase tracking-wider">All Time</p>
              <p className="text-white text-2xl font-bold">{formatNumber(totalVisitorsAllMonths)}</p>
            </div>
          </div>
          <p className="text-teal-200/60 text-xs">Total visitors all time</p>
        </div>
      </div>
      
      {/* Streamgraph Chart */}
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-white font-bold text-lg">Visitor Traffic Stream</h3>
          <p className="text-gray-400 text-sm">Weekly visitor breakdown by month</p>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeek1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorWeek2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[1]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[1]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorWeek3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[2]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[2]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorWeek4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[3]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[3]} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorWeek5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[4]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[4]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
              tickMargin={10}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            
            <Area
              type="monotone"
              dataKey="week1"
              stackId="1"
              stroke={colors[0]}
              strokeWidth={2}
              fill="url(#colorWeek1)"
            />
            <Area
              type="monotone"
              dataKey="week2"
              stackId="1"
              stroke={colors[1]}
              strokeWidth={2}
              fill="url(#colorWeek2)"
            />
            <Area
              type="monotone"
              dataKey="week3"
              stackId="1"
              stroke={colors[2]}
              strokeWidth={2}
              fill="url(#colorWeek3)"
            />
            <Area
              type="monotone"
              dataKey="week4"
              stackId="1"
              stroke={colors[3]}
              strokeWidth={2}
              fill="url(#colorWeek4)"
            />
            <Area
              type="monotone"
              dataKey="week5"
              stackId="1"
              stroke={colors[4]}
              strokeWidth={2}
              fill="url(#colorWeek5)"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          {colors.slice(0, 5).map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-400 text-xs">Week {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
