import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loader from './Loader'
import { getRole } from '../utils/roles'

export default function RoleBasedRoute({ children, allowedRoles, redirectTo = '/' }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  const role = getRole(user)
  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
