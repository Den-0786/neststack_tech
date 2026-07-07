import SiteNav from '../components/SiteNav'
import HeroSection from '../components/home/HeroSection'
import AboutSection from '../components/home/AboutSection'
import WorkSection from '../components/home/WorkSection'
import CertificatesSection from '../components/home/CertificatesSection'
import ContactSection from '../components/home/ContactSection'
import SiteFooter from '../components/SiteFooter'
import Reveal from '../components/ui/Reveal'
import { useTheme } from '../context/ThemeContext'

export default function Home() {
  const { light } = useTheme()
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-700 ${light ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'}`}>
      <SiteNav />
      <main className="flex-1">
        <Reveal direction="up" delay={100}>
          <HeroSection />
        </Reveal>
        <Reveal direction="up" delay={150}>
          <AboutSection />
        </Reveal>
        <Reveal direction="up" delay={150}>
          <WorkSection />
        </Reveal>
        <Reveal direction="up" delay={150}>
          <CertificatesSection />
        </Reveal>
        <Reveal direction="up" delay={150}>
          <ContactSection />
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  )
}
