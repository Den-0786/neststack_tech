import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const { light } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`border p-6 max-w-md w-full mx-4 ${light ? 'bg-white border-gray-200' : 'bg-site-card border-site-border'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-lg ${light ? 'text-gray-900' : 'text-white'}`}>{title}</h3>
          <button onClick={onClose} className={`hover:opacity-70 ${light ? 'text-gray-500' : 'text-gray-400'}`}>
            <X size={20} />
          </button>
        </div>
        <p className={`text-sm mb-6 ${light ? 'text-gray-600' : 'text-gray-400'}`}>{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`font-mono text-xs uppercase tracking-widest px-4 py-2 ${light ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-site-bg'}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-red-500 text-white hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
