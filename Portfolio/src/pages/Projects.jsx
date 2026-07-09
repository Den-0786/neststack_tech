
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Reveal from '../components/ui/Reveal'
import { usePortfolio } from '../context/PortfolioContext'

function statusStyle(s) {
  if (s === 'LIVE') return 'text-green-600 border-green-200 bg-green-50'
  if (s === 'ACTIVE') return 'text-accent border-yellow-200 bg-yellow-50'
  return 'text-gray-400 border-gray-200 bg-gray-50'
}

export default function Projects() {
  const { data } = usePortfolio()
  const projects = data.projects || []

  console.log('Projects page projects:', projects)

  return (
    <div className="min-h-screen bg-sys-bg flex flex-col">
      <Navbar />

      <main className="flex-1 pt-14">
        <section className="max-w-7xl mx-auto px-6 py-16">
          <Reveal direction="up" delay={100}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs tracking-widest uppercase text-gray-400 mb-2">— Portfolio Showroom</p>
                <h1 className="text-4xl font-black uppercase text-gray-900">Interactive Showroom</h1>
                <p className="text-gray-500 text-sm mt-2 max-w-lg">
                  A high-density technical exhibition featuring real-world projects, architectural prototypes, and performance benchmarks.
                </p>
              </div>
              <div className="hidden md:flex gap-3 mt-2">
                <button className="flex items-center gap-2 bg-gray-900 text-white font-mono text-xs tracking-widest uppercase px-5 py-3 hover:bg-gray-700 transition-colors">
                  Export Report
                </button>
                <button className="flex items-center gap-2 border border-gray-900 text-gray-900 font-mono text-xs tracking-widest uppercase px-5 py-3 hover:bg-gray-100 transition-colors">
                  Deploy New Node
                </button>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {projects.map((p, idx) => (
              <Reveal key={p.id} direction="up" delay={idx * 80}>
                <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{p.title}</h3>
                      <span className={`font-mono text-[10px] border px-2 py-0.5 shrink-0 ${statusStyle(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{p.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(Array.isArray(p.tags) ? p.tags : []).map((t) => (
                        <span key={t} className="font-mono text-xs text-gray-500 border border-gray-200 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      {p.live_url && p.live_url !== '#' && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 text-white font-mono text-xs uppercase tracking-widest px-4 py-2.5 hover:bg-gray-700 transition-colors"
                        >
                          Launch Live App →
                        </a>
                      )}
                      {p.github_url && p.github_url !== '#' && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-900 text-gray-900 font-mono text-xs uppercase tracking-widest px-4 py-2.5 hover:bg-gray-100 transition-colors"
                        >
                          <Github size={12} /> View Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal direction="up" delay={100}>
        <section className="bg-dark-panel py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">Node Distribution</p>
              <div className="border border-gray-700 p-5 text-center">
                <p className="text-5xl font-black text-white">1,204</p>
                <p className="font-mono text-xs text-gray-400 mt-1 uppercase tracking-widest">Active Instances</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['US_EAST_01', 'EU_WEST_04', 'AP_SOUTH_02', 'SVD_NODE_01'].map((n) => (
                  <span key={n} className="font-mono text-xs border border-gray-700 text-gray-400 px-2 py-0.5">{n}</span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-700 overflow-hidden">
                <img src="/portimages/brand_logo.webp" alt="Lab Complex" className="w-full h-36 object-cover opacity-60" />
                <div className="p-4">
                  <p className="font-mono text-xs text-gray-400 flex items-center gap-1 mb-1">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Headquarters
                  </p>
                  <h3 className="font-semibold text-white text-sm">Geneva Lab Complex</h3>
                  <p className="text-xs text-gray-400 mt-1">Primary R&amp;D facility for core hardware synchronization.</p>
                  <a href="#" className="font-mono text-xs text-accent mt-3 flex items-center gap-1 hover:underline uppercase tracking-widest">
                    View Facility Protocols <ArrowRight size={11} />
                  </a>
                </div>
              </div>

              <div className="border border-gray-700 p-4">
                <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-3">Diagnostic Panel</p>
                {[
                  { name: 'CORE_ENGINE', status: 'OPTIMIZED', color: 'text-green-400', bar: 82 },
                  { name: 'STORAGE_CLUSTER', status: 'IDLE', color: 'text-gray-400', bar: 40 },
                  { name: 'NETWORK_GATEWAY', status: 'CONNECTED', color: 'text-accent', bar: 96 },
                ].map(({ name, status, color, bar }) => (
                  <div key={name} className="border border-gray-700 p-3 mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-xs text-gray-300">{name}</span>
                      <span className={`font-mono text-xs ${color}`}>{status}</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded">
                      <div className="h-1 bg-accent rounded" style={{ width: `${bar}%` }} />
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 border border-gray-600 text-gray-300 font-mono text-xs uppercase tracking-widest py-2 hover:bg-gray-700 transition-colors">
                  Run All Tests
                </button>
              </div>
            </div>
          </div>
        </section>
        </Reveal>
      </main>

      <Footer />
    </div>
  )
}
