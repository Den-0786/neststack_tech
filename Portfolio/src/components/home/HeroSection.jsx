import { Shield } from 'lucide-react'
import { scroller } from 'react-scroll'
import { usePortfolio } from '../../context/PortfolioContext'
import Reveal from '../ui/Reveal'
import { useTheme } from '../../context/ThemeContext'

const specializations = [
  {
    icon: '</>',
    label: 'Web Development',
    desc: 'Architecting scalable React and Node.js applications with a focus on performance and clean, modular codebases.',
    tags: ['React', 'Node.js', 'Next.js'],
  },
  {
    icon: '[]',
    label: 'Graphic Design',
    desc: 'Creating technical visual identities that communicate authenticity through intelligent grids and precision-heavy UIs.',
    tags: ['Figma', 'Photoshop', 'Illustrator'],
  },
  {
    icon: '{}',
    label: 'Cybersecurity',
    desc: 'Hardening web assets against vulnerabilities and implementing zero-trust principles to development pipelines.',
    tags: ['OWASP', 'Pen Test', 'VAPT'],
  },
]

export default function HeroSection() {
  const { data } = usePortfolio()
  const { bio } = data
  const { light } = useTheme()

  return (
    <section
      id="hero"
      className="relative pt-14 min-h-[600px] flex flex-col justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80&auto=format&fit=crop')`,
        }}
      />
      <div className={`absolute inset-0 ${light ? 'bg-gray-50/90' : 'bg-site-bg'}`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${light ? 'from-gray-50/40 via-transparent to-gray-50' : 'from-site-bg/80 via-transparent to-site-bg'}`} />

      <div className="relative max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className={`font-mono text-xs uppercase tracking-widest mb-4 ${light ? 'text-neon-light' : 'text-neon'}`}>
            [SYSTEM_READY: v4.2.0]
          </p>
          <h1 className={`text-3xl md:text-5xl font-black leading-tight mb-5 ${light ? 'text-gray-900' : 'text-white'}`}>
            Building{' '}
            <span className={light ? 'text-neon-light' : 'text-neon'}>Secure</span>
            {', '}
            <br className="hidden md:block" />
            Beautiful, and
            <br />
            Functional Web
            <br />
            Experiences
          </h1>
          <p className={`text-sm leading-relaxed max-w-md mb-8 ${light ? 'text-gray-600' : 'text-gray-400'}`}>
            {bio.intro}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scroller.scrollTo('work', { smooth: true, duration: 500, offset: -56 })}
              className={`font-mono text-xs px-6 py-3 font-bold uppercase tracking-widest transition-colors ${
                light ? 'bg-neon-light text-white hover:bg-neon-light/90' : 'bg-neon text-black hover:bg-neon-dim'
              }`}
            >
              View Projects
            </button>
            <button
              onClick={() => scroller.scrollTo('contact', { smooth: true, duration: 500, offset: -56 })}
              className={`font-mono text-xs bg-transparent px-6 py-3 uppercase tracking-widest transition-colors ${
                light
                  ? 'border border-gray-300 text-gray-700 hover:border-neon-light hover:text-neon-light'
                  : 'border border-site-border text-gray-300 hover:border-neon hover:text-neon'
              }`}
            >
              Hire Me
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className={`relative w-56 h-56 border backdrop-blur flex items-center justify-center ${light ? 'bg-gray-100/60 border-neon-light/30' : 'bg-site-bg/60 border-neon/30'}`}>
            <Shield size={80} className={`opacity-60 ${light ? 'text-neon-light' : 'text-neon'}`} />
            <div className={`absolute -top-2 -right-2 w-4 h-4 animate-pulse ${light ? 'bg-neon-light' : 'bg-neon'}`} />
            <div className={`absolute -bottom-2 -left-2 w-4 h-4 border ${light ? 'border-neon-light' : 'border-neon'}`} />
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pb-12">
        <div className={`border-b pb-4 mb-8 ${light ? 'border-gray-200' : 'border-site-border'}`}>
          <h2 className={`font-bold text-lg ${light ? 'text-gray-900' : 'text-white'}`}>Core Specializations</h2>
          <p className={`font-mono text-xs uppercase tracking-widest mt-1 ${light ? 'text-gray-500' : 'text-site-muted'}`}>
            Bridging the gap between code, aesthetics, and hardening
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {specializations.map((s, idx) => (
            <Reveal key={s.label} direction="up" delay={idx * 100}>
              <div className={`p-5 hover:border-neon/40 transition-colors border ${light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-lg font-bold ${light ? 'text-neon-light' : 'text-neon'}`}>{s.icon}</span>
                  <span className={`font-mono text-xs ${light ? 'text-gray-400' : 'text-site-muted'}`}>[0{idx + 1}]</span>
                </div>
                <h3 className={`font-bold mb-2 ${light ? 'text-gray-900' : 'text-white'}`}>{s.label}</h3>
                <p className={`text-xs leading-relaxed mb-4 ${light ? 'text-gray-500' : 'text-gray-400'}`}>{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className={`font-mono text-xs border px-2 py-0.5 ${light ? 'border-gray-200 text-gray-500' : 'border-site-border text-site-muted'}`}>
                      {t}
                    </span>
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
