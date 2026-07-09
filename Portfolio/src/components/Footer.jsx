import { useState, useEffect } from 'react'
import { Linkedin, Instagram, MessageCircle, Facebook, Music } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { usePortfolio } from '../context/PortfolioContext'

// Social media icon mapping
const SOCIAL_ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  facebook: Facebook,
  tiktok: Music,
}

export default function Footer() {
  const { data } = usePortfolio()
  const { light } = useTheme()
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:10000').replace(/\/$/, '') + '/api'

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const response = await fetch(`${API_BASE}/portfolio/social-links/active`)
        if (response.ok) {
          const data = await response.json()
          setSocialLinks(data)
        }
      } catch (error) {
        console.error('Failed to fetch social links:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSocialLinks()
  }, [])

  const year = new Date().getFullYear()

  // Theme-aware styling
  const bgClass = light ? 'bg-gray-100 border-t border-gray-200' : 'bg-site-bg border-t border-site-border'
  const textClass = light ? 'text-gray-600' : 'text-site-muted'
  const headingClass = light ? 'text-gray-900' : 'text-white'
  const hoverClass = light ? 'hover:text-gray-900 hover:underline' : 'hover:text-white hover:underline'

  return (
    <footer className={`w-full py-12 md:py-16 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Left Section - Branding */}
          <div className="flex-1">
            <h3 className={`font-mono text-lg font-bold uppercase tracking-wider mb-4 ${headingClass}`}>
              NestStack_Tech
            </h3>
            <p className={`font-mono text-xs leading-relaxed ${textClass}`}>
              Building modern web solutions with cutting-edge technologies. 
              Focusing on performance, accessibility, and user experience.
            </p>
          </div>

          {/* Middle Section - Sitemap */}
          <div className="flex-shrink-0">
            <h4 className={`font-mono text-xs font-bold uppercase tracking-wider mb-4 ${headingClass}`}>
              Sitemap
            </h4>
            <div className="flex flex-col space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '#about' },
                { label: 'Projects', href: '#projects' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`font-mono text-xs ${textClass} ${hoverClass} transition-colors`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex-shrink-0">
            <h4 className={`font-mono text-xs font-bold uppercase tracking-wider mb-4 ${headingClass}`}>
              Connect
            </h4>
            <div className="flex flex-wrap gap-4">
              {loading ? (
                <p className={`font-mono text-xs ${textClass}`}>Loading...</p>
              ) : socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.platform]
                  return Icon ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        light 
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                          : 'bg-site-card hover:bg-site-border text-white'
                      }`}
                      title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                    </a>
                  ) : null
                })
              ) : (
                <p className={`font-mono text-xs ${textClass}`}>No social links available</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className={`mt-12 pt-8 border-t ${light ? 'border-gray-300' : 'border-site-border'}`}>
          <p className={`font-mono text-xs text-center ${textClass}`}>
            © {year} Dennis Opoku Amponsah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
