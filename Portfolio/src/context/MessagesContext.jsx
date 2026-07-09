import { createContext, useContext, useState, useEffect } from 'react'

const MessagesContext = createContext(null)

export function useMessages() {
  return useContext(MessagesContext)
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    try {
      const response = await fetch(`${API_BASE}/api/messages`)
      const data = await response.json()
      if (response.ok) {
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function addMessage({ from, email, subject, body, attachments = [] }) {
    try {
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: from,
          email,
          subject,
          message: body,
          type: attachments.length > 0 ? 'document' : 'general',
          attachments,
        }),
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to add message:', error)
    }
  }

  async function markRead(id) {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }

  async function markAttended(id) {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'attended' }),
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark message as attended:', error)
    }
  }

  async function markApproved(id) {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark message as approved:', error)
    }
  }

  async function markUnapproved(id) {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark message as unapproved:', error)
    }
  }

  async function markUnattended(id) {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark message as unattended:', error)
    }
  }

  async function markAllRead() {
    try {
      const response = await fetch(`${API_BASE}/api/messages/read/all`, {
        method: 'PATCH',
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  async function deleteMessage(id) {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length
  const readCount = messages.filter((m) => m.status === 'read').length
  const attendedCount = messages.filter((m) => m.status === 'attended').length

  return (
    <MessagesContext.Provider
      value={{ messages, loading, addMessage, markRead, markAttended, markApproved, markUnapproved, markUnattended, markAllRead, deleteMessage, unreadCount, readCount, attendedCount }}
    >
      {children}
    </MessagesContext.Provider>
  )
}
