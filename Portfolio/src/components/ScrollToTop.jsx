import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { light } = useTheme()

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50 ${
        light ? 'bg-neon-light text-white hover:bg-neon-light/90' : 'bg-neon text-black hover:bg-neon-dim'
      }`}
      title="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}
