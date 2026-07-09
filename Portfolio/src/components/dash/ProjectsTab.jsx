import { useState } from 'react'
import { Search, Plus, Rocket, Cloud, Zap, Trash2, Edit } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'
import { useDashTheme } from '../../context/DashThemeContext'
import S3ImageUpload from '../ui/S3ImageUpload'

const statusStyle = (s) => {
  if (!s) return 'text-site-muted border-site-border'
  if (s === 'LIVE') return 'text-neon border-neon/40 bg-neon/5'
  if (s === 'ACTIVE') return 'text-yellow-400 border-yellow-400/40 bg-yellow-400/5'
  return 'text-site-muted border-site-border'
}

export default function ProjectsTab() {
  const { data, addProject, deleteProject, updateProject } = usePortfolio()
  const light = useDashTheme()
  const card = light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'
  const lbl = light ? 'text-gray-500' : 'text-site-muted'
  const heading = light ? 'text-gray-900' : 'text-white'
  const accent = light ? 'text-green-700' : 'text-neon'
  const input = light ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-site-bg border-site-border text-white placeholder-site-muted'
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', desc: '', tags: '', github: '', img: '', status: 'ACTIVE' })
  const [message, setMessage] = useState({ type: '', text: '' })

  const filtered = data.projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.join(' ').toLowerCase().includes(query.toLowerCase())
  )

  function handleAdd(e) {
    e.preventDefault()
    if (!form.title) return
    addProject({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) })
    resetForm()
  }

  async function handleEdit(e) {
    e.preventDefault()
    if (!form.title) return
    const success = await updateProject(editingId, { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) })
    if (success) {
      setMessage({ type: 'success', text: 'Project updated successfully' })
      resetForm()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } else {
      setMessage({ type: 'error', text: 'Failed to update project' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  function resetForm() {
    setForm({ title: '', desc: '', tags: '', github: '', img: '', status: 'ACTIVE' })
    setShowForm(false)
    setEditingId(null)
  }

  function startEdit(project) {
    setForm({
      title: project.title,
      desc: project.description,
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
      github: project.github_url,
      img: project.image,
      status: project.status || 'ACTIVE'
    })
    setEditingId(project.id)
    setShowForm(true)
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(id)
    }
  }

  return (
    <div className="px-5 py-5 space-y-4">
      {message.text && (
        <div className={`border px-4 py-2 font-mono text-xs ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}
      <div className={`flex items-center gap-2 border px-4 py-3 ${card}`}>
        <Search size={14} className={`shrink-0 ${lbl}`} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects by title or stack..."
          className={`bg-transparent text-sm font-mono flex-1 focus:outline-none ${heading} placeholder:${lbl}`}
        />
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-neon-dim transition-colors"
      >
        <Plus size={14} /> Add New Project
      </button>

      {showForm && (
        <form onSubmit={editingId ? handleEdit : handleAdd} className={`border border-neon/30 p-5 space-y-3 ${light ? 'bg-white' : 'bg-site-card'}`}>
          <p className={`font-mono text-xs uppercase tracking-widest mb-3 ${accent}`}>[{editingId ? 'EDIT_PROJECT' : 'NEW_PROJECT'}]</p>
          <div>
              <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Project title"
                className={`w-full px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors border ${input}`}
              />
            </div>
            <div>
              <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>Description</label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                placeholder="Short description"
                rows={4}
                className={`w-full px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors border ${input} resize-y`}
              />
            </div>
            <div>
              <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>Tech Stack (comma separated)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="React, Node.js, AWS"
                className={`w-full px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors border ${input}`}
              />
            </div>
            <div>
              <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>GitHub / Live URL</label>
              <input
                value={form.github}
                onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                placeholder="https://github.com/..."
                className={`w-full px-3 py-2 text-sm font-mono focus:outline-none focus:border-neon/50 transition-colors border ${input}`}
              />
            </div>
          <div>
            <label className={`font-mono text-xs uppercase tracking-widest block mb-2 ${lbl}`}>Project Image — Upload from Machine</label>
            <S3ImageUpload
              folder="projects"
              label="Upload Project Screenshot"
              preview={form.img}
              light={light}
              onUploaded={(url) => setForm((f) => ({ ...f, img: url }))}
            />
          </div>
          <div>
            <label className={`font-mono text-xs uppercase tracking-widest block mb-1 ${lbl}`}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className={`w-full px-3 py-2 text-sm font-mono focus:outline-none border ${input}`}
            >
              <option value="LIVE">LIVE</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 bg-neon text-black font-mono font-bold text-xs uppercase tracking-widest py-3 hover:bg-neon-dim transition-colors">
              {editingId ? 'Update Project' : 'Save Project'}
            </button>
            <button type="button" onClick={resetForm} className="flex-1 border border-site-border text-site-muted font-mono text-xs uppercase tracking-widest py-3 hover:border-gray-500 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Projects', value: data.projects.filter(p => p.status === 'LIVE' || p.status === 'ACTIVE').length, icon: Rocket },
          { label: 'Total Deployment', value: data.projects.length, icon: Cloud },
          { label: 'Success Rate', value: '98.2%', icon: Zap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className={`border p-3 ${card}`}>
            <p className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${lbl}`}>{label}</p>
            <p className={`text-xl font-black ${heading}`}>{value}</p>
            <Icon size={14} className={`mt-1 opacity-30 ${accent}`} />
          </div>
        ))}
      </div>

      <div className={`border ${card}`}>
        <div className={`grid grid-cols-[60px_1fr_120px_100px] px-4 py-2 border-b ${light ? 'border-gray-200' : 'border-site-border'}`}>
          {['Thumbnail', 'Title', 'Status', 'Actions'].map((h) => (
            <p key={h} className={`font-mono text-[10px] uppercase tracking-widest ${lbl}`}>{h}</p>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="font-mono text-xs text-site-muted p-4 text-center">No projects found.</p>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className={`grid grid-cols-[60px_1fr_120px_100px] px-4 py-3 border-b items-center gap-2 ${light ? 'border-gray-100' : 'border-site-border/50'}`}>
              <div className={`w-12 h-10 border overflow-hidden shrink-0 ${light ? 'bg-gray-100 border-gray-200' : 'bg-site-bg border-site-border'}`}>
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-[8px] text-site-muted">N/A</span>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className={`font-mono text-xs font-semibold ${heading} truncate`}>{p.title}</p>
                <p className={`font-mono text-[10px] mt-0.5 line-clamp-1 ${lbl}`}>{p.description}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className={`font-mono text-[9px] border px-1.5 py-0.5 ${light ? 'border-gray-200 text-green-700' : 'border-site-border text-neon'}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className={`inline-block font-mono text-[9px] border px-1.5 py-0.5 ${statusStyle(p.status)}`}>
                  {p.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="text-blue-400/50 hover:text-blue-400 transition-colors" title="Edit">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500/50 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
        {filtered.length > 0 && (
          <p className={`font-mono text-[10px] px-4 py-2 ${lbl}`}>
            Showing 1-{filtered.length} of {data.projects.length} projects
          </p>
        )}
      </div>
    </div>
  )
}
