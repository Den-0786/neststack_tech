import { useRef, useState } from 'react'
import { Send, Globe, ExternalLink, Paperclip, X, FileText } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useMessages } from '../../context/MessagesContext'
import Reveal from '../ui/Reveal'
import { useTheme } from '../../context/ThemeContext'

const ALLOWED = ['application/pdf', 'text/csv', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
const ALLOWED_EXT = ['.pdf', '.csv', '.xls', '.xlsx']

export default function ContactSection() {
  const { data } = usePortfolio()
  const { contact, bio } = data
  const { addMessage } = useMessages()
  const { light } = useTheme()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [files, setFiles] = useState([])
  const [sent, setSent] = useState(false)
  const [fileError, setFileError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  function handleFiles(e) {
    setFileError('')
    const picked = Array.from(e.target.files || [])
    const invalid = picked.filter((f) => !ALLOWED.includes(f.type) && !ALLOWED_EXT.some((ext) => f.name.endsWith(ext)))
    if (invalid.length) {
      setFileError('Only PDF, CSV, XLS, XLSX files are allowed.')
      return
    }
    setFiles((prev) => [...prev, ...picked].slice(0, 5))
    e.target.value = ''
  }

  function removeFile(name) {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    addMessage({
      from: form.name,
      email: form.email,
      subject: form.subject || `Message from ${form.name}`,
      body: form.message,
      attachments: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    })
    setSent(true)
    setTimeout(() => setSent(false), 3500)
    setForm({ name: '', email: '', subject: '', message: '' })
    setFiles([])
  }

  return (
    <section id="contact" className={`border-t transition-colors duration-700 ${light ? 'bg-gray-50 border-gray-200' : 'bg-site-bg border-site-border'}`}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Reveal direction="up" delay={0}>
        <div className="text-center mb-12">
          <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${light ? 'text-neon-light' : 'text-neon'}`}>
            [SECURE_CHANNEL_V3]
          </p>
          <h2 className={`text-5xl font-black mb-4 ${light ? 'text-gray-900' : 'text-white'}`}>Establish Link</h2>
          <p className={`text-sm max-w-md mx-auto ${light ? 'text-gray-500' : 'text-gray-400'}`}>
            Initiate an encrypted communication protocol. For technical inquiries,
            design collaborations, or security audits.
          </p>
        </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Reveal direction="right" delay={100}>
          <div>
            <p className={`font-mono text-xs uppercase tracking-widest mb-6 ${light ? 'text-neon-light' : 'text-neon'}`}>
              — Identity Manifest
            </p>
            <div className="space-y-4 mb-8">
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>Name</p>
                <p className={`font-semibold ${light ? 'text-gray-900' : 'text-white'}`}>{bio.name}</p>
              </div>
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>Location</p>
                <p className={light ? 'text-gray-900' : 'text-white'}>{bio.location}</p>
              </div>
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>Source Email</p>
                <a href={`mailto:${contact.email}`} className={`hover:underline font-mono text-sm ${light ? 'text-neon-light' : 'text-neon'}`}>
                  {contact.email}
                </a>
              </div>
              <div>
                <p className={`font-mono text-xs uppercase tracking-widest mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>Phone</p>
                <p className={`font-mono text-sm ${light ? 'text-gray-900' : 'text-white'}`}>{contact.phone1}</p>
                {contact.phone2 && (
                  <p className={`font-mono text-sm ${light ? 'text-gray-900' : 'text-white'}`}>{contact.phone2}</p>
                )}
              </div>
              {contact.whatsapp && (
                <div>
                  <p className="font-mono text-xs text-site-muted uppercase tracking-widest mb-1">WhatsApp</p>
                  <a href={contact.whatsapp} className={`hover:underline font-mono text-sm ${light ? 'text-neon-light' : 'text-neon'}`}>
                    Open Chat
                  </a>
                </div>
              )}
            </div>

            <div className={`border p-4 ${light ? 'border-gray-200' : 'border-site-border'}`}>
              <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${light ? 'text-gray-400' : 'text-site-muted'}`}>Social Nodes</p>
              <div className="flex flex-wrap gap-3">
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-neon transition-colors uppercase tracking-widest">
                    <ExternalLink size={13} /> LinkedIn
                  </a>
                )}
                {contact.twitter && (
                  <a href={contact.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-neon transition-colors uppercase tracking-widest">
                    <ExternalLink size={13} /> Github
                  </a>
                )}
                {contact.facebook && (
                  <a href={contact.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-neon transition-colors uppercase tracking-widest">
                    <Globe size={13} /> Facebook
                  </a>
                )}
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-neon transition-colors uppercase tracking-widest">
                    <Globe size={13} /> Instagram
                  </a>
                )}
                <span className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest ${light ? 'text-neon-light' : 'text-neon'}`}>
                  <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
                  System_Active
                </span>
              </div>
            </div>
          </div>
          </Reveal>

          <Reveal direction="left" delay={150}>
          <div className={`border p-6 ${light ? 'border-gray-200 bg-white' : 'border-site-border bg-site-card'}`}>
            <div className="flex items-center justify-between mb-5">
              <span className={`font-mono text-xs uppercase tracking-widest ${light ? 'text-neon-light' : 'text-neon'}`}>[CONTACT_PROTOCOL]</span>
            </div>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-neon flex items-center justify-center mb-4">
                  <Send size={16} className="text-neon" />
                </div>
                <p className={`font-mono text-sm uppercase tracking-widest ${light ? 'text-neon-light' : 'text-neon'}`}>Message Transmitted.</p>
                <p className="font-mono text-xs text-site-muted mt-2">Signal received. Standing by for response.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                      Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
                    />
                  </div>
                  <div>
                    <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                      Source_Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                    Subject_Line
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => set('subject', e.target.value)}
                    placeholder="Project inquiry / Collaboration / Audit..."
                    className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
                  />
                </div>
                <div>
                  <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                    Payload_Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    rows={4}
                    placeholder="Briefly describe your requirements..."
                    className={`w-full border px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors resize-none ${light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'}`}
                  />
                </div>

                <div>
                  <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                    Attach_Documents <span className={`text-[10px] normal-case ${light ? 'text-gray-400' : 'text-site-muted'}`}>(PDF, CSV, XLS, XLSX — max 5)</span>
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept=".pdf,.csv,.xls,.xlsx"
                    onChange={handleFiles}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 border border-site-border text-site-muted hover:text-neon hover:border-neon/50 font-mono text-xs uppercase tracking-widest px-4 py-2.5 transition-colors"
                  >
                    <Paperclip size={13} /> Attach File
                  </button>
                  {fileError && (
                    <p className="font-mono text-[10px] text-red-400 mt-1">{fileError}</p>
                  )}
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((f) => (
                        <div key={f.name} className={`flex items-center justify-between border px-3 py-2 ${light ? 'bg-gray-100 border-gray-200' : 'bg-site-bg border-site-border'}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={12} className="text-neon shrink-0" />
                            <span className={`font-mono text-[11px] truncate ${light ? 'text-gray-900' : 'text-white'}`}>{f.name}</span>
                            <span className={`font-mono text-[10px] shrink-0 ${light ? 'text-gray-400' : 'text-site-muted'}`}>
                              ({(f.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button type="button" onClick={() => removeFile(f.name)} className="text-site-muted hover:text-red-400 ml-2 shrink-0">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-neon text-black font-mono font-bold text-sm uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-neon-dim transition-colors"
                >
                  Transmit Message <Send size={14} />
                </button>
              </form>
            )}
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
