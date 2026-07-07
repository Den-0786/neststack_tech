import { Download, ExternalLink } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import Reveal from '../ui/Reveal'
import { useTheme } from '../../context/ThemeContext'

export default function AboutSection() {
  const { data } = usePortfolio()
  const { bio, skills } = data
  const { light } = useTheme()

  return (
    <section id="about" className={`border-t transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Reveal direction="up" delay={0}>
        <div className={`border border-neon/30 rounded-xl overflow-hidden p-6 md:p-8 mb-16 ${light ? 'bg-white' : 'bg-site-card'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative flex justify-center lg:justify-start">
              <div className="border border-neon/30 rounded-xl overflow-hidden aspect-[4/5] max-w-xs w-full">
                <img
                  src={bio.avatar}
                  alt={bio.name}
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute top-3 left-3 font-mono text-xs text-neon bg-site-bg/80 px-2 py-1 rounded">
                  NestStack_Tech :: REV.41
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className={`font-mono text-xs uppercase tracking-widest ${light ? 'text-neon-light' : 'text-neon'}`}>
                PROFILE_MANIFEST
              </p>
              <h2 className={`text-4xl font-black leading-tight ${light ? 'text-gray-900' : 'text-white'}`}>
                Technical Architect
                <br />
                &amp; <span className={light ? 'text-neon-light' : 'text-neon'}>Security</span>
                <br />
                Researcher.
              </h2>
              <p className={`text-sm leading-relaxed max-w-md ${light ? 'text-gray-600' : 'text-gray-400'}`}>
                {bio.about}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={bio.cvUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`font-mono text-xs bg-transparent border rounded px-5 py-3 uppercase tracking-widest transition-colors flex items-center gap-2 ${light ? 'border-gray-300 text-gray-600 hover:border-neon-light hover:text-neon-light' : 'border-site-border text-gray-300 hover:border-neon hover:text-neon'}`}
                >
                  <Download size={13} /> Download CV
                </a>
                <a
                  href={bio.githubUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`font-mono text-xs bg-transparent border rounded px-5 py-3 uppercase tracking-widest transition-colors flex items-center gap-2 ${light ? 'border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900' : 'border-site-border text-gray-300 hover:border-white hover:text-white'}`}
                >
                  <ExternalLink size={13} /> View Repositories
                </a>
              </div>
            </div>
          </div>
        </div>
        </Reveal>

        <Reveal direction="up" delay={50}>
        <div className={`border-b pb-4 mb-8 ${light ? 'border-gray-200' : 'border-site-border'}`}>
          <h3 className={`font-bold text-lg ${light ? 'text-gray-900' : 'text-white'}`}>Skill_Matrix.v2</h3>
          <p className={`font-mono text-xs uppercase tracking-widest mt-1 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
            Matrix initialized...
          </p>
        </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skills.map((group, idx) => (
            <Reveal key={group.id} direction="up" delay={idx * 100}>
              <div className={`border p-5 ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-xs ${light ? 'text-neon-light' : 'text-neon'}`}>[{String(idx + 1).padStart(2, '0')}]</span>
                  {idx === 2 && (
                    <span className="font-mono text-xs text-yellow-400 border border-yellow-400/30 px-2 py-0.5">
                      IN PROGRESS
                    </span>
                  )}
                </div>
                <h4 className={`font-bold mb-3 ${light ? 'text-gray-900' : 'text-white'}`}>{group.category}</h4>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className={`font-mono text-xs uppercase tracking-wide ${light ? 'text-gray-500' : 'text-gray-400'}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
