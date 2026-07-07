import { TrendingUp, Calendar, Globe, Plus } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useDashTheme } from '../../context/DashThemeContext'

const stats = [
  { label: 'Daily Visits', value: '12,842', change: '+14.2% vs yesterday', icon: TrendingUp },
  { label: 'Monthly Reach', value: '384.2K', change: '+5.8% vs last month', icon: Calendar },
  { label: 'Annual Traffic', value: '4.21M', change: '+21.4% vs prev year', icon: Globe },
]

const chartBars = [18, 35, 28, 55, 42, 70, 58, 80, 65, 88, 72, 95]

const modules = [
  { name: 'Edge Runtime', icon: '❖' },
  { name: 'Vector DB', icon: '⬡' },
  { name: 'Auth_Secure', icon: '⬢' },
]

export default function OverviewTab() {
  const { data } = usePortfolio()
  const light = useDashTheme()
  const card = light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
  const label = light ? 'text-gray-500' : 'text-site-muted'
  const heading = light ? 'text-gray-900' : 'text-white'
  const sub = light ? 'text-gray-500' : 'text-gray-400'
  const accent = light ? 'text-green-700' : 'text-neon'
  const moduleRow = light ? 'border-gray-200' : 'border-site-border'

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

        <div className="h-24 flex items-end gap-0.5 mt-4">
          {chartBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i >= chartBars.length - 4
                  ? 'rgba(57,255,20,0.7)'
                  : light ? 'rgba(0,100,0,0.15)' : 'rgba(57,255,20,0.15)',
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['00:00:00', 'Node_Alpha_X-R', '23:59:59'].map((t) => (
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
