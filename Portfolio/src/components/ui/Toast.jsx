import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    description: 'text-green-700'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    description: 'text-red-700'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    description: 'text-yellow-700'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    description: 'text-blue-700'
  }
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

export default function Toast({ toast, onClose }) {
  const { type = 'info', title, description, duration = 3000 } = toast
  const style = toastStyles[type] || toastStyles.info
  const Icon = icons[type] || icons.info

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 min-w-[320px] max-w-md relative overflow-hidden`}>
        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
          .progress-bar-${toast.id} {
            animation: shrink ${duration}ms linear forwards;
          }
        `}</style>
        <div className="flex items-start gap-3">
          <Icon className={`${style.icon} shrink-0 mt-0.5`} size={20} />
          <div className="flex-1 min-w-0">
            {title && (
              <p className={`font-semibold text-sm ${style.title}`}>{title}</p>
            )}
            {description && (
              <p className={`text-sm mt-1 ${style.description}`}>{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`${style.icon} shrink-0 hover:opacity-70 transition-opacity`}
          >
            <X size={18} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-1.5 bg-gray-200">
          <div 
            className={`h-full opacity-80 progress-bar-${toast.id}`}
            style={{
              width: '100%',
              backgroundColor: type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : type === 'warning' ? '#ca8a04' : '#2563eb',
            }}
          />
        </div>
      </div>
    </div>
  )
}
