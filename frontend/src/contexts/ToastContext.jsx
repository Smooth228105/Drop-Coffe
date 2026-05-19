import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

const DEFAULT_DURATION = 3200

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current))
    }, DEFAULT_DURATION)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={[
            'fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-xl transition-all duration-300',
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-espresso-900 text-cream-50',
          ].join(' ')}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
