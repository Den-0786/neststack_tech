import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
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
  const [expandedDesc, setExpandedDesc] = useState({})

  function truncateText(text, wordLimit = 30) {
    const words = text.split(' ')
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ') + '...'
  }

  function toggleDesc(id) {
    setExpandedDesc(prev => ({ ...prev, [id]: !prev[id] }))
  }

  console.log('WorkSection projects:', projects)

  if (!projects.length) return null

  const [featured, ...rest] = projects

  return (
    <section id="project" className={`border-t transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
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
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`font-mono text-xs border px-2 py-0.5 ${statusStyle(featured.status)}`}>
                  {featured.status}
                </span>
                <span className="font-mono text-xs text-site-muted">DASHBOARD_REV.01</span>
              </div>
              <div className={`font-mono text-xs uppercase tracking-widest mb-2 ${light ? 'text-neon-light' : 'text-neon'}`}>Website</div>
              <h3 className={`font-bold text-2xl mb-3 ${light ? 'text-gray-900' : 'text-white'}`}>{featured.title}</h3>
              <p className={`text-sm mb-4 leading-relaxed ${light ? 'text-gray-600' : 'text-gray-400'}`}>
                {expandedDesc[featured.id] ? featured.description : truncateText(featured.description)}
              </p>
              {featured.description.split(' ').length > 30 && (
                <button
                  onClick={() => toggleDesc(featured.id)}
                  className={`flex items-center gap-1 font-mono text-xs uppercase tracking-widest mb-4 ${light ? 'text-neon-light hover:text-neon' : 'text-neon hover:text-neon-light'}`}
                >
                  {expandedDesc[featured.id] ? (
                    <><ChevronUp size={12} /> Read Less</>
                  ) : (
                    <><ChevronDown size={12} /> Read More</>
                  )}
                </button>
              )}
              <div className="flex gap-3">
                {featured.live_url && featured.live_url !== '#' && (
                  <a
                    href={featured.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 font-mono text-sm flex items-center justify-center gap-2 uppercase tracking-widest px-5 py-3 rounded-lg transition-all hover:shadow-lg ${light ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-neon text-black hover:bg-neon-dim'}`}
                  >
                    Launch Live App →
                  </a>
                )}
                {featured.github_url && featured.github_url !== '#' && (
                  <a
                    href={featured.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 font-mono text-sm flex items-center justify-center gap-2 uppercase tracking-widest px-5 py-3 rounded-lg border transition-all hover:shadow-lg ${light ? 'border-gray-900 text-gray-900 hover:bg-gray-100' : 'border-neon text-neon hover:bg-neon/10'}`}
                  >
                    View Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((p, idx) => (
              <Reveal key={p.id} direction="left" delay={idx * 100}>
              <div
                className={`border p-5 group hover:border-neon/40 transition-colors flex gap-4 items-start ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-xs border px-1.5 py-0.5 ${statusStyle(p.status)}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className={`font-mono text-[10px] uppercase tracking-widest mb-0.5 ${light ? 'text-neon-light' : 'text-neon'}`}>Website</div>
                  <h4 className={`font-bold text-sm truncate ${light ? 'text-gray-900' : 'text-white'}`}>{p.title}</h4>
                  <p className={`text-xs mt-0.5 leading-relaxed ${light ? 'text-gray-500' : 'text-gray-400'}`}>
                    {expandedDesc[p.id] ? p.description : truncateText(p.description)}
                  </p>
                  {p.description.split(' ').length > 30 && (
                    <button
                      onClick={() => toggleDesc(p.id)}
                      className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest mt-1 ${light ? 'text-neon-light hover:text-neon' : 'text-neon hover:text-neon-light'}`}
                    >
                      {expandedDesc[p.id] ? (
                        <><ChevronUp size={10} /> Read Less</>
                      ) : (
                        <><ChevronDown size={10} /> Read More</>
                      )}
                    </button>
                  )}
                  <div className="flex gap-2 mt-2">
                    {p.live_url && p.live_url !== '#' && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-mono text-[10px] flex items-center justify-center gap-1 uppercase tracking-widest px-2 py-1 ${light ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-neon text-black hover:bg-neon-dim'}`}
                      >
                        Launch →
                      </a>
                    )}
                    {p.github_url && p.github_url !== '#' && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-mono text-[10px] flex items-center justify-center gap-1 uppercase tracking-widest px-2 py-1 border ${light ? 'border-gray-900 text-gray-900 hover:bg-gray-100' : 'border-neon text-neon hover:bg-neon/10'}`}
                      >
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal direction="up" delay={100}>
        <div className={`mt-10 border p-8 text-center ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
          <h3 className={`text-3xl font-black mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>Ready to fortify your project?</h3>
          <p className={`text-sm mb-6 max-w-md mx-auto ${light ? 'text-gray-500' : 'text-gray-400'}`}>
            Have an urgent project or want to collaborate? Grab a spot on my calendar.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className={`border p-4 ${light ? 'border-gray-200 bg-gray-50' : 'border-site-border bg-site-bg'}`}>
              <div className={`font-mono font-black text-2xl mb-2 ${light ? 'text-neon-light' : 'text-neon'}`}>01</div>
              <p className={`font-mono text-xs font-bold ${light ? 'text-gray-900' : 'text-white'}`}>Click the "Book a Call" button below</p>
            </div>
            <div className={`border p-4 ${light ? 'border-gray-200 bg-gray-50' : 'border-site-border bg-site-bg'}`}>
              <div className={`font-mono font-black text-2xl mb-2 ${light ? 'text-neon-light' : 'text-neon'}`}>02</div>
              <p className={`font-mono text-xs font-bold ${light ? 'text-gray-900' : 'text-white'}`}>Pick a date and time slot from the blue colored circles</p>
            </div>
            <div className={`border p-4 ${light ? 'border-gray-200 bg-gray-50' : 'border-site-border bg-site-bg'}`}>
              <div className={`font-mono font-black text-2xl mb-2 ${light ? 'text-neon-light' : 'text-neon'}`}>03</div>
              <p className={`font-mono text-xs font-bold ${light ? 'text-gray-900' : 'text-white'}`}>Fill in your contact details to instantly secure your spot</p>
            </div>
          </div>
          
          <a
            href="https://calendly.com/dennisopokuamponsah86/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm font-bold bg-neon text-black px-8 py-3 uppercase tracking-widest hover:bg-neon-dim transition-colors"
          >
            Book a Call
          </a>
        </div>
        </Reveal>
      </div>
    </section>
  )
}
