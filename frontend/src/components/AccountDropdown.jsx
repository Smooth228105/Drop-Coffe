import { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  )
}

export default function AccountDropdown() {
  const {
    user,
    isAuthenticated,
    accountOpen,
    toggleAccount,
    openLogin,
    logout,
    setAccountOpen,
  } = useAuth()
  const accountRef = useRef(null)

  useEffect(() => {
    if (!accountOpen) {
      return undefined
    }

    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [accountOpen, setAccountOpen])

  const handleAccountClick = () => {
    if (isAuthenticated) {
      toggleAccount()
      return
    }
    openLogin()
  }

  return (
    <div className="relative" ref={accountRef}>
      <button
        type="button"
        onClick={handleAccountClick}
        className="flex items-center gap-2 rounded-xl border border-cream-200 bg-white px-3 py-2.5 text-sm font-semibold text-espresso-900 shadow-sm transition-all hover:border-caramel-500/30 hover:shadow-md"
      >
        <UserIcon />
        <span className="hidden sm:inline">
          {isAuthenticated ? user?.username || 'Аккаунт' : 'Аккаунт'}
        </span>
      </button>

      {isAuthenticated && accountOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-xl">
          <div className="border-b border-cream-200 px-4 py-4">
            <p className="font-semibold text-espresso-900">{user?.username}</p>
            <p className="mt-1 truncate text-sm text-espresso-700/70">{user?.email || '—'}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full px-4 py-3 text-left text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  )
}
