const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:10000').replace(/\/$/, '') + '/api'

export function getVisitorId() {
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

export async function trackVisitor() {
  try {
    const visitorId = getVisitorId()
    const response = await fetch(`${API_URL}/portfolio/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ visitor_id: visitorId }),
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to track visitor:', error)
    return { success: false }
  }
}

export async function getVisitorStats() {
  try {
    const response = await fetch(`${API_URL}/portfolio/visitors/stats`)
    return await response.json()
  } catch (error) {
    console.error('Failed to get visitor stats:', error)
    return { daily: 0, monthly: 0, annual: 0 }
  }
}
