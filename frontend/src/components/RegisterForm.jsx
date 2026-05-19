import { useState } from 'react'
import FormField, { getInputClassName } from './FormField'
import { useAuth } from '../contexts/AuthContext'

const MIN_PASSWORD_LENGTH = 8

export default function RegisterForm() {
  const { register, actionLoading, error, fieldErrors, switchToLogin, clearFieldErrors } =
    useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [localErrors, setLocalErrors] = useState({})

  const validateLocally = () => {
    const errors = {}

    if (!username.trim()) {
      errors.username = 'Укажите имя пользователя.'
    }
    if (!email.trim()) {
      errors.email = 'Укажите email.'
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Минимум ${MIN_PASSWORD_LENGTH} символов.`
    }
    if (password !== passwordConfirm) {
      errors.password_confirm = 'Пароли не совпадают.'
    }

    setLocalErrors(errors)
    return Object.keys(errors).length === 0
  }

  const getFieldError = (field) => localErrors[field] || fieldErrors[field]

  const handleSubmit = async (event) => {
    event.preventDefault()
    clearFieldErrors()
    setLocalErrors({})

    if (!validateLocally()) {
      return
    }

    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
      })
    } catch {
      // errors handled in context
    }
  }

  const handleFieldChange = (setter) => (event) => {
    setter(event.target.value)
    clearFieldErrors()
    setLocalErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Имя пользователя" htmlFor="auth-username" error={getFieldError('username')}>
        <input
          id="auth-username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={handleFieldChange(setUsername)}
          className={getInputClassName(Boolean(getFieldError('username')))}
          placeholder="ivan_petrov"
        />
      </FormField>

      <FormField label="Email" htmlFor="auth-email" error={getFieldError('email')}>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={handleFieldChange(setEmail)}
          className={getInputClassName(Boolean(getFieldError('email')))}
          placeholder="you@example.com"
        />
      </FormField>

      <FormField label="Пароль" htmlFor="auth-register-password" error={getFieldError('password')}>
        <input
          id="auth-register-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={handleFieldChange(setPassword)}
          className={getInputClassName(Boolean(getFieldError('password')))}
          placeholder="••••••••"
        />
      </FormField>

      <FormField
        label="Подтверждение пароля"
        htmlFor="auth-password-confirm"
        error={getFieldError('password_confirm')}
      >
        <input
          id="auth-password-confirm"
          type="password"
          autoComplete="new-password"
          required
          value={passwordConfirm}
          onChange={handleFieldChange(setPasswordConfirm)}
          className={getInputClassName(Boolean(getFieldError('password_confirm')))}
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
        {actionLoading ? 'Создание…' : 'Создать аккаунт'}
      </button>

      <p className="text-center text-sm text-espresso-700/70">
        Уже есть аккаунт?{' '}
        <button
          type="button"
          onClick={switchToLogin}
          className="font-semibold text-caramel-600 underline-offset-2 transition hover:text-caramel-500 hover:underline"
        >
          Войти
        </button>
      </p>
    </form>
  )
}
