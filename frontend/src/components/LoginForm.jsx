import { useState } from 'react'
import FormField, { getInputClassName } from './FormField'
import { useAuth } from '../contexts/AuthContext'

export default function LoginForm() {
  const { login, actionLoading, error, switchToRegister } = useAuth()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login({ login: loginValue.trim(), password })
    } catch {
      // errors handled in context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Email или логин" htmlFor="auth-login">
        <input
          id="auth-login"
          type="text"
          autoComplete="username"
          required
          value={loginValue}
          onChange={(event) => setLoginValue(event.target.value)}
          className={getInputClassName(false)}
          placeholder="username@example.com"
        />
      </FormField>

      <FormField label="Пароль" htmlFor="auth-password">
        <input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={getInputClassName(false)}
          placeholder="••••••••"
        />
      </FormField>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={actionLoading}
        className="w-full rounded-xl bg-caramel-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-caramel-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {actionLoading ? 'Вход…' : 'Войти'}
      </button>

      <p className="text-center text-sm text-espresso-700/70">
        Нет аккаунта?{' '}
        <button
          type="button"
          onClick={switchToRegister}
          className="font-semibold text-caramel-600 underline-offset-2 transition hover:text-caramel-500 hover:underline"
        >
          Зарегистрироваться
        </button>
      </p>
    </form>
  )
}
