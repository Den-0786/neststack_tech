import { createContext, useContext, useState, useEffect } from 'react'

const defaultData = {
  bio: {
    name: 'Dennis Opoku Amponsah',
    tagline: 'Engineering The Next Ecosystem.',
    taglineAccent: 'The Next',
    intro:
      'A precision-engineered portfolio for high-performance web development, cybersecurity, and graphic design. Prioritizing clarity, security, and architectural excellence.',
    about:
      'I combine innovation, security, and creativity to deliver exceptional digital experiences. As a frontend developer striving to become a full-stack developer, cybersecurity enthusiast, and graphic designer, I build secure, scalable, and visually engaging web solutions.',
    roles: ['Frontend Developer', 'Cybersecurity Enthusiast', 'Graphic Designer'],
    avatar: '/portimages/abouttemp.jpeg',
    location: 'Kumasi, Ghana',
    version: 'v4.2.0-STABLE',
    cvUrl: '#',
    githubUrl: 'https://github.com/',
  },
  contact: {
    email: 'dennisopokamponsah86@gmail.com',
    phone1: '+233 245 660 786',
    phone2: '+233 201 041 717',
    whatsapp: 'https://wa.me/233245660786',
    twitter: 'https://x.com/DennisOpok35210',
    linkedin: 'https://www.linkedin.com/in/dennis-opoku-amponsah-3911aa31b',
    facebook: 'https://www.facebook.com/profile.php?id=100085692115198',
    instagram: 'https://www.instagram.com/opoku2102/',
    availability: 'Currently accepting complex technical challenges for Q3/Q4 2025.',
  },
  projects: [
    {
      id: 'p1',
      title: 'Local Service Finder',
      desc: 'Full-stack booking platform connecting users to local service providers with reviews and payments.',
      img: '/portimages/agency.png',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      github: '#',
      status: 'LIVE',
    },
    {
      id: 'p2',
      title: 'E-Commerce Boutique',
      desc: 'Online fashion store with product listings, cart, checkout, and an admin dashboard.',
      img: '/portimages/bite.png',
      tags: ['HTML', 'CSS', 'JavaScript'],
      github: '#',
      status: 'LIVE',
    },
    {
      id: 'p3',
      title: 'Hotel Reservation App',
      desc: 'Room and table booking system with real-time availability tracking.',
      img: '/portimages/hotel.png',
      tags: ['React', 'Express', 'MySQL'],
      github: '#',
      status: 'ACTIVE',
    },
    {
      id: 'p4',
      title: 'TinDog',
      desc: 'A fun dog-matching web application inspired by Tinder, built with Bootstrap.',
      img: '/portimages/tindog.png',
      tags: ['Bootstrap', 'JavaScript'],
      github: '#',
      status: 'ARCHIVED',
    },
  ],
  certificates: [
    { id: 'c1', name: 'Cloud Architecture', issuer: 'Amazon Web Services', date: '12 OCT 2023', status: 'VALID' },
    { id: 'c2', name: 'Zero Trust Security Expert', issuer: 'Global InfoSec Council', date: '04 JAN 2024', status: 'LIFETIME' },
    { id: 'c3', name: 'Advanced Cryptography', issuer: 'Stanford Center for Prof.', date: '22 JUN 2023', status: 'RENEWAL_REQ' },
    { id: 'c4', name: 'HIPAA Compliance Audit', issuer: 'Internal Audit Division', date: '15 MAR 2023', status: 'ARCHIVED' },
  ],
  skills: [
    {
      id: 's1',
      category: 'CORE ARCHITECTURE',
      items: ['React', 'Node.js', 'Express', 'Django', 'PostgreSQL', 'MySQL'],
    },
    {
      id: 's2',
      category: 'UI ENTRANCE CRAFT',
      items: ['Tailwind CSS', 'HTML / CSS', 'Bootstrap', 'Figma', 'Adobe Photoshop'],
    },
    {
      id: 's3',
      category: 'SYSTEM SECURITY',
      items: ['Penetration Testing', 'Secure Coding', 'OWASP Top 10', 'Network Security', 'Cryptography'],
    },
  ],
}

const STORAGE_KEY = 'portfolio_data'
const STORAGE_VERSION = '4'

function loadData() {
  try {
    const version = localStorage.getItem('portfolio_data_version')
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.setItem('portfolio_data_version', STORAGE_VERSION)
      return defaultData
    }
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultData
    const parsed = JSON.parse(stored)
    return {
      bio: { ...defaultData.bio, ...parsed.bio },
      contact: { ...defaultData.contact, ...parsed.contact },
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
      skills: Array.isArray(parsed.skills) ? parsed.skills : defaultData.skills,
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : defaultData.certificates,
    }
  } catch {
    return defaultData
  }
}

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  function updateBio(fields) {
    setData((prev) => ({ ...prev, bio: { ...prev.bio, ...fields } }))
  }

  function updateContact(fields) {
    setData((prev) => ({ ...prev, contact: { ...prev.contact, ...fields } }))
  }

  function addProject(project) {
    const newProject = { ...project, id: `p${Date.now()}` }
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }))
  }

  function updateProject(id, fields) {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...fields } : p)),
    }))
  }

  function deleteProject(id) {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }))
  }

  function addSkillGroup(group) {
    const newGroup = { ...group, id: `s${Date.now()}` }
    setData((prev) => ({ ...prev, skills: [...prev.skills, newGroup] }))
  }

  function updateSkillGroup(id, fields) {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...fields } : s)),
    }))
  }

  function deleteSkillGroup(id) {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }))
  }

  function addCertificate(cert) {
    const newCert = { ...cert, id: `c${Date.now()}` }
    setData((prev) => ({ ...prev, certificates: [...prev.certificates, newCert] }))
  }

  function updateCertificate(id, fields) {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c) => (c.id === id ? { ...c, ...fields } : c)),
    }))
  }

  function deleteCertificate(id) {
    setData((prev) => ({ ...prev, certificates: prev.certificates.filter((c) => c.id !== id) }))
  }

  function resetToDefaults() {
    setData(defaultData)
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateBio,
        updateContact,
        addProject,
        updateProject,
        deleteProject,
        addSkillGroup,
        updateSkillGroup,
        deleteSkillGroup,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return ctx
}
