import { usePortfolio } from '../context/PortfolioContext'

export default function Footer() {
  const { data } = usePortfolio()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-sys-bg px-6 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-mono text-xs tracking-widest uppercase text-gray-500">
          TECHNICAL ECOSYSTEM
        </span>
        <span className="font-mono text-xs text-gray-400">
          © {year} {data.bio.name?.toUpperCase() || 'NestStack_Tech'}. ALL RIGHTS RESERVED.
        </span>
        <div className="flex gap-6">
          {['Documentation', 'Privacy', 'Network Status'].map((item) => (
            <a
              key={item}
              href="#"
              className="font-mono text-xs text-gray-500 hover:text-gray-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
