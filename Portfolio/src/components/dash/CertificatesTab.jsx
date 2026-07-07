import { useState } from 'react'
import { Search, Plus, FileText, CheckCircle, Clock, Archive, Trash2 } from 'lucide-react'
import { useDashTheme } from '../../context/DashThemeContext'
import { usePortfolio } from '../../context/PortfolioContext'
import S3ImageUpload from '../ui/S3ImageUpload'

function statusStyle(s) {
  if (s === 'VALID') return 'text-neon border-neon/40 bg-neon/5'
  if (s === 'LIFETIME') return 'text-blue-400 border-blue-400/40 bg-blue-400/5'
  if (s === 'RENEWAL_REQ') return 'text-orange-400 border-orange-400/40 bg-orange-400/5'
  return 'text-site-muted border-site-border'
}

function statusIcon(s) {
  if (s === 'VALID' || s === 'LIFETIME') return <CheckCircle size={11} />
  if (s === 'RENEWAL_REQ') return <Clock size={11} />
  return <Archive size={11} />
}

export default function CertificatesTab() {
  const light = useDashTheme()
  const { data, addCertificate, deleteCertificate } = usePortfolio()
  const certs = data.certificates
  const card = light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
  const lbl = light ? 'text-gray-500' : 'text-site-muted'
  const heading = light ? 'text-gray-900' : 'text-white'
  const accent = light ? 'text-green-700' : 'text-neon'
  const input = light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', issuer: '', date: '', status: 'VALID', imgUrl: '' })
  const [activeFilter, setActiveFilter] = useState('All Assets')

  const filters = ['All Assets', 'SSL/TLS', 'Security Certs']

  const filtered = certs.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.issuer.toLowerCase().includes(query.toLowerCase())
  )

  function handleAdd(e) {
    e.preventDefault()
    if (!form.name) return
    addCertificate(form)
    setForm({ name: '', issuer: '', date: '', status: 'VALID', imgUrl: '' })
    setShowForm(false)
  }

  const active = certs.filter(c => c.status === 'VALID' || c.status === 'LIFETIME').length
  const expiring = certs.filter(c => c.status === 'RENEWAL_REQ').length
  const pending = certs.filter(c => c.status === 'ARCHIVED').length

  return (
    <div className="px-5 py-5 space-y-4">
      <div>
        <h2 className={`font-bold text-lg ${heading}`}>Certificates Registry</h2>
        <p className={`font-mono text-xs mt-0.5 ${lbl}`}>Manage secure authentication assets and compliance credentials.</p>
      </div>

      <div className={`flex items-center gap-2 border px-4 py-3 ${card}`}>
        <Search size={14} className={`shrink-0 ${lbl}`} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search assets..."
          className={`bg-transparent text-sm font-mono flex-1 focus:outline-none ${heading}`}
        />
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-neon-dim transition-colors"
      >
        <Plus size={14} /> Add Certificate
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className={`border border-neon/30 p-5 space-y-3 ${light ? 'bg-white' : 'bg-site-card'}`}>
          <p className={`font-mono text-xs uppercase tracking-widest mb-2 ${accent}`}>[NEW_CERT]</p>
          {[
            { key: 'name', label: 'Certificate Name', placeholder: 'e.g. AWS Solutions Architect' },
            { key: 'issuer', label: 'Issuer', placeholder: 'e.g. Amazon Web Services' },
            { key: 'date', label: 'Issue Date', placeholder: 'DD MON YYYY' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className={`w-full px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors border ${input}`}
              />
            </div>
          ))}
          <div>
            <label className={`font-mono text-xs uppercase tracking-widest block mb-2 ${lbl}`}>Certificate Image — Upload from Machine</label>
            <S3ImageUpload
              folder="certificates"
              label="Upload Certificate Image"
              preview={form.imgUrl}
              light={light}
              onUploaded={(url) => setForm((f) => ({ ...f, imgUrl: url }))}
            />
          </div>
          <div>
            <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className={`w-full px-3 py-2 text-sm font-mono focus:outline-none border ${input}`}
            >
              {['VALID', 'LIFETIME', 'RENEWAL_REQ', 'ARCHIVED'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest py-3 hover:bg-neon-dim transition-colors">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-site-border text-site-muted font-mono text-xs uppercase tracking-widest py-3">Cancel</button>
          </div>
        </form>
      )}

      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`font-mono text-xs px-3 py-1.5 uppercase tracking-widest transition-colors border ${
              activeFilter === f ? 'bg-neon text-black border-neon font-bold' : 'border-site-border text-site-muted hover:border-gray-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className={`border p-4 ${card}`}>
            <div className="flex items-start justify-between gap-2">
              <FileText size={16} className={`shrink-0 mt-0.5 opacity-50 ${accent}`} />
              <div className="flex-1 min-w-0">
                <p className={`font-mono text-sm font-semibold ${heading}`}>{c.name}</p>
                <p className={`font-mono text-xs mt-0.5 ${accent}`}>{c.issuer}</p>
                <p className={`font-mono text-[10px] mt-1 uppercase tracking-widest ${lbl}`}>
                  Issue Date: {c.date}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`flex items-center gap-1 font-mono text-[10px] border px-2 py-1 ${statusStyle(c.status)}`}>
                  {statusIcon(c.status)} {c.status}
                </span>
                <button onClick={() => deleteCertificate(c.id)} className="text-red-500/50 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center gap-2 border border-dashed border-site-border text-site-muted font-mono text-xs uppercase tracking-widest py-4 hover:border-neon/30 hover:text-neon transition-colors">
          <Plus size={13} /> Upload New Asset
        </button>
      </div>

      <div className="space-y-3 pt-2">
        {[
          { value: active, label: 'Active Certificates', color: 'bg-neon' },
          { value: expiring, label: 'Expiring 30 Days', color: 'bg-orange-400' },
          { value: pending, label: 'Pending Renewal', color: 'bg-site-muted' },
        ].map(({ value, label, color }) => (
          <div key={label} className="flex items-center gap-4">
            <p className={`text-4xl font-black w-16 ${heading}`}>{String(value).padStart(2, '0')}</p>
            <div>
              <p className={`font-mono text-sm ${heading}`}>{label}</p>
              <div className={`h-0.5 w-8 mt-1 ${color}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
