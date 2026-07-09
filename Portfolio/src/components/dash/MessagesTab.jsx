import { useState } from 'react'
import { Mail, FileText, Trash2, CheckCheck, ChevronDown, ChevronUp, Paperclip, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { useDashTheme } from '../../context/DashThemeContext'
import { useMessages } from '../../context/MessagesContext'
import { useToast } from '../../context/ToastContext'
import ConfirmDialog from '../ui/ConfirmDialog'

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

function fileIcon(type = '') {
  if (type.includes('pdf')) return '📄'
  if (type.includes('csv') || type.includes('excel') || type.includes('sheet')) return '📊'
  return '📎'
}

function getStatusBadge(status, light) {
  if (status === 'unread')   return { label: 'NEW',      cls: light ? 'bg-neon-light text-white' : 'bg-neon text-black' }
  if (status === 'read')     return { label: 'APPROVED', cls: 'bg-yellow-400 text-black' }
  if (status === 'attended') return { label: 'ATTENDED', cls: 'bg-blue-400 text-black' }
  return { label: '', cls: '' }
}

function getStatusDot(status, light) {
  if (status === 'unread')   return light ? 'bg-neon-light' : 'bg-neon'
  if (status === 'read')     return 'bg-yellow-400'
  if (status === 'attended') return 'bg-blue-400'
  return 'bg-gray-400'
}

function cardBorder(msgType, status, light) {
  if (msgType === 'alert') return light ? 'border-red-200' : 'border-red-500/30'
  if (msgType === 'document') return light ? 'border-blue-200' : 'border-blue-500/30'
  if (status === 'attended') return light ? 'border-blue-200' : 'border-blue-500/20'
  if (status === 'read') return light ? 'border-yellow-200' : 'border-yellow-500/20'
  return light ? 'border-gray-200' : 'border-site-border'
}

const TABS = [
  { id: 'all',       label: 'All',        icon: Mail },
  { id: 'unread',    label: 'Unread',     icon: Clock },
  { id: 'read',      label: 'Approved',   icon: CheckCheck },
  { id: 'attended',  label: 'Attended',   icon: CheckCircle2 },
  { id: 'documents', label: 'Documents',  icon: FileText },
]

export default function MessagesTab() {
  const light = useDashTheme()
  const { messages, markRead, markAttended, markAllRead, deleteMessage, unreadCount, readCount, attendedCount } = useMessages()
  const toast = useToast()
  const [tab, setTab] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, messageId: null })

  const lbl    = light ? 'text-gray-500'  : 'text-site-muted'
  const heading = light ? 'text-gray-900' : 'text-white'
  const cardBase = light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
  const accent  = light ? 'text-green-700' : 'text-neon'
  const divider = light ? 'border-gray-200' : 'border-site-border'

  const docs = messages.filter((m) => m.type === 'document')

  const listMap = {
    all:       messages,
    unread:    messages.filter((m) => m.status === 'unread'),
    read:      messages.filter((m) => m.status === 'read'),
    attended:  messages.filter((m) => m.status === 'attended'),
    documents: docs,
  }
  const list = listMap[tab] ?? messages

  const tabCount = {
    all:       messages.length,
    unread:    unreadCount,
    read:      readCount,
    attended:  attendedCount,
    documents: docs.length,
  }

  function toggle(id, msg) {
    setExpanded((prev) => (prev === id ? null : id))
    if (msg.status === 'unread') {
      markRead(id)
      toast.info('Message Read', 'Message marked as read.')
    }
  }

  function handleDelete(id) {
    setDeleteConfirm({ isOpen: true, messageId: id })
  }

  function confirmDelete() {
    deleteMessage(deleteConfirm.messageId)
    toast.success('Message Deleted', 'Message has been removed successfully.')
    setExpanded(null)
    setDeleteConfirm({ isOpen: false, messageId: null })
  }

  const emptyLabels = {
    all: 'No messages yet.', unread: 'No unread messages.',
    read: 'No approved messages.', attended: 'No attended messages.',
    documents: 'No documents received yet.',
  }

  return (
    <>
    <div className="px-5 py-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold text-lg ${heading}`}>Inbox</h2>
          <p className={`font-mono text-xs mt-0.5 ${lbl}`}>Messages &amp; documents received from the portfolio</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => {
              markAllRead()
              toast.success('All Marked Read', 'All messages have been marked as read.')
            }}
            className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${light ? 'border-gray-200 text-gray-500 hover:text-gray-900' : 'border-site-border text-site-muted hover:text-white'}`}
          >
            <CheckCheck size={12} /> Mark all read
          </button>
        )}
      </div>

      {/* 5 stat cards */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'All',      value: messages.length, color: accent },
          { label: 'Unread',   value: unreadCount,     color: light ? 'text-neon-light' : 'text-neon' },
          { label: 'Approved', value: readCount,        color: 'text-yellow-400' },
          { label: 'Attended', value: attendedCount,    color: 'text-blue-400' },
          { label: 'Docs',     value: docs.length,      color: light ? 'text-purple-600' : 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`border p-3 text-center ${cardBase}`}>
            <p className={`font-mono text-[9px] uppercase tracking-widest mb-1 ${lbl}`}>{label}</p>
            <p className={`text-2xl font-black ${color}`}>{String(value).padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={`flex border-b overflow-x-auto ${divider}`}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest px-3 py-2.5 border-b-2 whitespace-nowrap transition-colors shrink-0 ${
              tab === id ? `${light ? 'border-neon-light' : 'border-neon'} ${accent}` : `border-transparent ${lbl}`
            }`}
          >
            <Icon size={12} />
            {label}
            {tabCount[id] > 0 && tab !== id && (
              <span className={`font-black text-[9px] px-1 py-0.5 rounded-sm ${id === 'unread' ? (light ? 'bg-neon-light text-white' : 'bg-neon text-black') : id === 'read' ? 'bg-yellow-400 text-black' : id === 'attended' ? 'bg-blue-400 text-black' : light ? 'bg-gray-200 text-gray-700' : 'bg-site-border text-white'}`}>
                {tabCount[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Message list */}
      {list.length === 0 ? (
        <div className={`border p-8 text-center ${cardBase}`}>
          <p className={`font-mono text-xs uppercase tracking-widest ${lbl}`}>{emptyLabels[tab]}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((m) => {
            const isOpen = expanded === m.id
            const badge = getStatusBadge(m.status, light)
            const dot   = getStatusDot(m.status, light)

            return (
              <div key={m.id} className={`border transition-all ${cardBorder(m.type, m.status, light)}`}>

                {/* Card header row — clickable to expand */}
                <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => toggle(m.id, m)}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 min-w-0 flex-wrap">
                        <span className={`font-mono text-xs font-bold truncate ${m.status === 'unread' ? heading : lbl}`}>
                          {m.from_name}
                        </span>
                        {m.type === 'alert' && <AlertTriangle size={11} className="text-red-400 shrink-0" />}
                        {m.attachments?.length > 0 && <Paperclip size={11} className="text-blue-400 shrink-0" />}
                        <span className={`font-black text-[8px] px-1.5 py-0.5 shrink-0 ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      <span className={`font-mono text-[10px] shrink-0 ${lbl}`}>{fmtTime(m.created_at)}</span>
                    </div>
                    <p className={`font-mono text-xs mt-0.5 ${m.status === 'unread' ? (light ? 'text-gray-800' : 'text-gray-200') : lbl}`}>
                      {m.subject}
                    </p>
                  </div>
                  <span className={`shrink-0 mt-0.5 ${lbl}`}>
                    {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </span>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className={`px-7 pb-4 pt-3 border-t space-y-3 ${light ? 'border-gray-100' : 'border-site-border/40'}`}>
                    <p className={`font-mono text-[11px] ${lbl}`}>
                      From: <span className={heading}>{m.email || m.from_name}</span>
                    </p>
                    <pre className={`font-mono text-xs whitespace-pre-wrap leading-relaxed ${light ? 'text-gray-700' : 'text-gray-300'}`}>
                      {m.message}
                    </pre>

                    {m.attachments?.length > 0 && (
                      <div className="space-y-1">
                        <p className={`font-mono text-[10px] uppercase tracking-widest ${lbl}`}>Attachments</p>
                        {m.attachments.map((att) => (
                          <div key={att.name} className={`flex items-center gap-3 border px-3 py-2 ${light ? 'border-gray-200 bg-gray-50' : 'border-site-border bg-site-bg'}`}>
                            <span className="text-sm">{fileIcon(att.type)}</span>
                            <span className={`font-mono text-xs flex-1 truncate ${heading}`}>{att.name}</span>
                            <span className={`font-mono text-[10px] shrink-0 ${lbl}`}>{(att.size / 1024).toFixed(1)} KB</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.status === 'unread' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markRead(m.id)
                            toast.success('Message Approved', 'Message has been marked as approved.')
                          }}
                          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                        >
                          <CheckCheck size={11} /> Approve
                        </button>
                      )}
                      {(m.status === 'unread' || m.status === 'read') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            markAttended(m.id)
                            toast.success('Attended', 'Message has been marked as attended.')
                          }}
                          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border border-blue-400/40 text-blue-400 hover:bg-blue-400/10 transition-colors"
                        >
                          <CheckCircle2 size={11} /> Attended To
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(m.id) }}
                        className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, messageId: null })}
        onConfirm={confirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
      />
    </>
  )
}
