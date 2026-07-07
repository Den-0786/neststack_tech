import { CheckCircle, Clock, Archive } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useTheme } from '../../context/ThemeContext'

function statusStyle(s) {
  if (s === 'VALID')       return { dot: 'bg-neon',        label: 'text-neon',        badge: 'border-neon/30 text-neon bg-neon/5' }
  if (s === 'LIFETIME')    return { dot: 'bg-blue-400',    label: 'text-blue-400',    badge: 'border-blue-400/30 text-blue-400 bg-blue-400/5' }
  if (s === 'RENEWAL_REQ') return { dot: 'bg-orange-400',  label: 'text-orange-400',  badge: 'border-orange-400/30 text-orange-400 bg-orange-400/5' }
  return                          { dot: 'bg-site-muted',  label: 'text-site-muted',  badge: 'border-site-border text-site-muted' }
}

function statusIcon(s) {
  if (s === 'VALID' || s === 'LIFETIME') return <CheckCircle size={11} />
  if (s === 'RENEWAL_REQ')               return <Clock size={11} />
  return                                        <Archive size={11} />
}

export default function CertificatesSection() {
  const { data } = usePortfolio()
  const certs = data.certificates || []
  const visible = certs.filter((c) => c.status !== 'ARCHIVED')
  const { light } = useTheme()

  if (!visible.length) return null

  return (
    <section id="certificates" className={`border-t transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className={`flex items-end justify-between border-b pb-4 mb-8 ${light ? 'border-gray-200' : 'border-site-border'}`}>
          <div>
            <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${light ? 'text-neon-light' : 'text-neon'}`}>[CREDENTIAL_REGISTRY]</p>
            <h2 className={`font-bold text-lg ${light ? 'text-gray-900' : 'text-white'}`}>Certifications &amp; Credentials</h2>
            <p className={`font-mono text-xs uppercase tracking-widest mt-1 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
              Verified professional certifications.
            </p>
          </div>
          <span className={`font-mono text-xs uppercase tracking-widest ${light ? 'text-gray-500' : 'text-site-muted'}`}>
            {visible.length} Active Record{visible.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c) => {
            const st = statusStyle(c.status)
            return (
              <div key={c.id} className={`border p-5 group hover:border-neon/30 transition-colors ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${st.dot}`} />
                  <span className={`flex items-center gap-1 font-mono text-[10px] border px-2 py-0.5 ${st.badge}`}>
                    {statusIcon(c.status)} {c.status}
                  </span>
                </div>
                <p className={`font-semibold text-sm mb-1 leading-snug ${light ? 'text-gray-900' : 'text-white'}`}>{c.name}</p>
                <p className={`font-mono text-xs ${st.label}`}>{c.issuer}</p>
                {c.date && (
                  <p className={`font-mono text-[10px] uppercase tracking-widest mt-2 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                    Issued: {c.date}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
