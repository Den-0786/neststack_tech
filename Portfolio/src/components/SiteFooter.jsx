import { scroller } from 'react-scroll'
import { usePortfolio } from '../context/PortfolioContext'
import Reveal from './ui/Reveal'
import { useTheme } from '../context/ThemeContext'


export default function SiteFooter() {
  const { data } = usePortfolio()
  const { light } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className={`border-t transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Reveal direction="left" delay={0}>
        <div className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-2">
          <span className={`font-mono font-black text-sm ${light ? 'text-gray-900' : 'text-white'}`}>NestStack_Tech</span>
          <span className={`font-mono text-[10px] text-center md:text-left ${light ? 'text-gray-500' : 'text-site-muted'}`}>
            // &copy; {year} {data.bio.name?.toUpperCase() || 'NestStack_Tech'}. ALL RIGHTS RESERVED.
          </span>
        </div>
        </Reveal>

        <Reveal direction="right" delay={100}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => scroller.scrollTo('hero', { smooth: true, duration: 500 })}
            className="font-mono text-xs text-site-muted hover:text-neon cursor-pointer transition-colors uppercase tracking-widest"
          >
            Terminal
          </button>
          {[
            { label: 'Github', href: data.contact.twitter || '#' },
            { label: 'LinkedIn', href: data.contact.linkedin || '#' },
            { label: 'Instagram', href: data.contact.instagram || '#' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-site-muted hover:text-neon transition-colors uppercase tracking-widest"
            >
              {label}
            </a>
          ))}
        </div>
        </Reveal>
      </div>
    </footer>
  )
}
