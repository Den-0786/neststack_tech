import { createContext, useContext, useState } from 'react'

const MessagesContext = createContext(null)

export function useMessages() {
  return useContext(MessagesContext)
}

const seed = [
  {
    id: 'sys-001',
    from: 'SOC_Alert_042',
    email: 'soc@core-os.net',
    subject: 'Critical: Port 22 Scan Detected',
    body: `Port 22 (SSH): The frequency of requests suggests a dictionary-based brute force attempt. Source IP 192.168.1.184 has been temporarily blacklisted for 3600 seconds.\n\n$ grep "Failed password" /var/log/auth.log\nMay 12 12:05:04 core-os sshd[1234]: Failed password for root from 192.168.1.184 port 48282\nMay 12 12:05:41 core-os sshd[1240]: Failed password for root from 192.168.1.184 port 49118\n\nRecommended Action: Review SSH configurations and implement fail2ban with stricter jail requirements.`,
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'alert',
    status: 'unread',
    attachments: [],
  },
  {
    id: 'sys-002',
    from: 'TryHackMe Bot',
    email: 'noreply@tryhackme.com',
    subject: 'New streak — 42 days',
    body: 'You maintained your hacking streak for 42 days. Keep it up! Log in to claim your badge.',
    time: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    type: 'normal',
    status: 'read',
    attachments: [],
  },
]

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(seed)

  function addMessage({ from, email, subject, body, attachments = [] }) {
    const msg = {
      id: `msg-${Date.now()}`,
      from,
      email,
      subject,
      body,
      time: new Date().toISOString(),
      type: attachments.length > 0 ? 'document' : 'normal',
      status: 'unread',
      attachments,
    }
    setMessages((prev) => [msg, ...prev])
  }

  function markRead(id) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id && m.status === 'unread' ? { ...m, status: 'read' } : m))
    )
  }

  function markAttended(id) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'attended' } : m))
    )
  }

  function markAllRead() {
    setMessages((prev) =>
      prev.map((m) => (m.status === 'unread' ? { ...m, status: 'read' } : m))
    )
  }

  function deleteMessage(id) {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length
  const readCount = messages.filter((m) => m.status === 'read').length
  const attendedCount = messages.filter((m) => m.status === 'attended').length

  return (
    <MessagesContext.Provider
      value={{ messages, addMessage, markRead, markAttended, markAllRead, deleteMessage, unreadCount, readCount, attendedCount }}
    >
      {children}
    </MessagesContext.Provider>
  )
}
