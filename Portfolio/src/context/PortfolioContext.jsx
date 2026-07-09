import { createContext, useContext, useState, useEffect } from 'react'

const defaultData = {
  bio: {
    name: '',
    tagline: '',
    taglineAccent: '',
    intro: '',
    about: '',
    roles: [],
    avatar: '',
    location: '',
    version: '',
    cvUrl: '',
    githubUrl: '',
  },
  contact: {
    email: '',
    phone1: '',
    phone2: '',
    whatsapp: '',
    twitter: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    availability: '',
  },
  projects: [],
  certificates: [],
  skills: [],
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000'

const PortfolioContext = createContext(null)

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  async function fetchPortfolio() {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio`)
      const apiData = await response.json()
      if (response.ok) {
        setData({
          bio: apiData.bio || defaultData.bio,
          contact: apiData.contact || defaultData.contact,
          projects: apiData.projects || [],
          certificates: apiData.certificates || [],
          skills: apiData.skills || [],
        })
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateBio(fields) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/bio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          location: fields.location,
          about: fields.about,
          avatar: fields.avatar,
          cvUrl: fields.cvUrl,
          githubUrl: fields.githubUrl,
          roles: fields.roles,
        }),
      })
      if (response.ok) {
        const updated = await response.json()
        setData((prev) => ({ ...prev, bio: { ...prev.bio, ...updated } }))
      }
    } catch (error) {
      console.error('Failed to update bio:', error)
    }
  }

  async function updateContact(fields) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      if (response.ok) {
        const updated = await response.json()
        setData((prev) => ({ ...prev, contact: { ...prev.contact, ...updated } }))
      }
    } catch (error) {
      console.error('Failed to update contact:', error)
    }
  }

  async function addProject(project) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: project.desc || '',
          tags: project.tags || [],
          github_url: project.github_url || '',
          live_url: project.live_url || '',
          status: project.status || 'ACTIVE',
        }),
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to add project:', error)
    }
  }

  async function updateProject(id, fields) {
    try {
      const payload = {
        title: fields.title,
        description: fields.desc,
        tags: fields.tags,
        github_url: fields.github_url,
        live_url: fields.live_url,
        status: fields.status || 'ACTIVE',
      }
      console.log('Updating project:', id, payload)
      const response = await fetch(`${API_BASE}/api/portfolio/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      console.log('Update response:', response.status, result)
      if (response.ok) {
        await fetchPortfolio()
        return true
      }
      console.error('Update failed:', result)
      return false
    } catch (error) {
      console.error('Failed to update project:', error)
      return false
    }
  }

  async function deleteProject(id) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/projects/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  async function addSkillGroup(group) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: group.category,
          items: group.items,
        }),
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to add skill group:', error)
    }
  }

  async function updateSkillGroup(id, fields) {
    // Backend doesn't have update endpoint for skills, delete and recreate
    await deleteSkillGroup(id)
    await addSkillGroup(fields)
  }

  async function deleteSkillGroup(id) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/skills/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to delete skill group:', error)
    }
  }

  async function addCertificate(cert) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          image: cert.image,
        }),
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to add certificate:', error)
    }
  }

  async function updateCertificate(id, fields) {
    // Backend doesn't have update endpoint for certificates, delete and recreate
    await deleteCertificate(id)
    await addCertificate(fields)
  }

  async function deleteCertificate(id) {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/certificates/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to delete certificate:', error)
    }
  }

  async function resetToDefaults() {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/reset`, {
        method: 'POST',
      })
      if (response.ok) {
        await fetchPortfolio()
      }
    } catch (error) {
      console.error('Failed to reset portfolio:', error)
    }
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        loading,
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
