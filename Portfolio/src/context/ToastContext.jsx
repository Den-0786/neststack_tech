import { createContext, useContext, useState } from 'react'
import Toast from '../components/ui/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function addToast(toast) {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  function success(title, description, duration) {
    return addToast({ type: 'success', title, description, duration })
  }

  function error(title, description, duration) {
    return addToast({ type: 'error', title, description, duration })
  }

  function warning(title, description, duration) {
    return addToast({ type: 'warning', title, description, duration })
  }

  function info(title, description, duration) {
    return addToast({ type: 'info', title, description, duration })
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
