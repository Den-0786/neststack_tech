import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '../../context/PortfolioContext'
import Reveal from '../ui/Reveal'
import { useTheme } from '../../context/ThemeContext'

function statusStyle(s) {
  if (s === 'LIVE') return 'text-neon border-neon/30 bg-neon/5'
  if (s === 'ACTIVE') return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5'
  return 'text-site-muted border-site-border'
}

export default function WorkSection() {
  const { data } = usePortfolio()
  const { projects } = data
  const { light } = useTheme()

  if (!projects.length) return null

  const [featured, ...rest] = projects

  return (
    <section id="work" className={`border-t transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className={`flex items-end justify-between border-b pb-4 mb-8 ${light ? 'border-gray-200' : 'border-site-border'}`}>
          <div>
            <h2 className={`font-bold text-lg ${light ? 'text-gray-900' : 'text-white'}`}>Featured Projects</h2>
            <p className={`font-mono text-xs uppercase tracking-widest mt-1 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
              Recent deployments from the laboratory.
            </p>
          </div>
          <Link
            to="/projects"
            className={`font-mono text-xs uppercase tracking-widest hover:underline flex items-center gap-1 ${light ? 'text-neon-light' : 'text-neon'}`}
          >
            View All Repository <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Reveal direction="up" delay={0}>
          <div className={`border group hover:border-neon/40 transition-colors ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
            {featured.img ? (
              <img
                src={featured.img}
                alt={featured.title}
                className="w-full h-56 object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            ) : (
              <div className={`w-full h-56 flex items-center justify-center ${light ? 'bg-gray-100' : 'bg-site-bg'}`}>
                <span className={`font-mono text-xs ${light ? 'text-gray-400' : 'text-site-muted'}`}>NO_IMAGE</span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-mono text-xs border px-2 py-0.5 ${statusStyle(featured.status)}`}>
                  {featured.status}
                </span>
                <span className="font-mono text-xs text-site-muted">DASHBOARD_REV.01</span>
              </div>
              <h3 className={`font-bold text-xl mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>{featured.title}</h3>
              <p className={`text-sm mb-4 ${light ? 'text-gray-500' : 'text-gray-400'}`}>{featured.desc}</p>
              <a
                href={featured.github}
                className={`font-mono text-xs flex items-center gap-1 hover:underline uppercase tracking-widest ${light ? 'text-neon-light' : 'text-neon'}`}
              >
                View Project <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((p, idx) => (
              <Reveal key={p.id} direction="left" delay={idx * 100}>
              <div
                className={`border p-4 group hover:border-neon/40 transition-colors flex gap-4 items-start ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}
              >
                {p.img ? (
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-24 h-16 object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <div className={`w-24 h-16 shrink-0 flex items-center justify-center border ${light ? 'bg-gray-100 border-gray-200' : 'bg-site-bg border-site-border'}`}>
                    <span className={`font-mono text-xs ${light ? 'text-gray-400' : 'text-site-muted'}`}>N/A</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-xs border px-1.5 py-0.5 ${statusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm truncate ${light ? 'text-gray-900' : 'text-white'}`}>{p.title}</h4>
                  <p className={`text-xs mt-0.5 line-clamp-2 ${light ? 'text-gray-500' : 'text-gray-400'}`}>{p.desc}</p>
                </div>
                <a href={p.github} className="text-site-muted hover:text-neon shrink-0 transition-colors mt-1">
                  <ArrowUpRight size={15} />
                </a>
              </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal direction="up" delay={100}>
        <div className={`mt-10 border p-8 text-center ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
          <h3 className={`text-3xl font-black mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>Ready to fortify your project?</h3>
          <p className={`text-sm mb-6 max-w-md mx-auto ${light ? 'text-gray-500' : 'text-gray-400'}`}>
            {data.contact.availability || 'Currently accepting complex technical challenges.'}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-mono text-sm font-bold bg-neon text-black px-8 py-3 uppercase tracking-widest hover:bg-neon-dim transition-colors"
          >
            Initiate Contact
          </Link>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
