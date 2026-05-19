import { useEffect } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useAuth } from '../contexts/AuthContext'

export default function AuthModal() {
  const { loginOpen, closeLogin, authMode } = useAuth()

  const isRegister = authMode === 'register'

  useEffect(() => {
    if (!loginOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeLogin()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [loginOpen, closeLogin])

  if (!loginOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Закрыть"
        onClick={closeLogin}
        className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-2xl"
      >
        <div className="bg-gradient-to-br from-espresso-900 to-espresso-800 px-6 py-8 text-cream-50">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel-500">
            Drop Coffee
          </p>
          <h2 id="auth-modal-title" className="mt-2 font-display text-3xl font-bold">
            {isRegister ? 'Регистрация' : 'Вход в аккаунт'}
          </h2>
          <p className="mt-2 text-sm text-cream-100/80">
            {isRegister
              ? 'Создайте аккаунт для заказов и корзины'
              : 'Войдите, чтобы добавлять товары в корзину'}
          </p>
        </div>

        <div className="p-6 transition-opacity duration-300" key={authMode}>
          {isRegister ? <RegisterForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  )
}
