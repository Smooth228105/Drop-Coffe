import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthModal from './components/AuthModal'
import RoleBasedRoute from './components/RoleBasedRoute'
import CatalogPage from './pages/CatalogPage'
import ManagerOrdersPage from './pages/ManagerOrdersPage'
import MyOrdersPage from './pages/MyOrdersPage'
import { ROLES } from './utils/roles'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route
          path="/orders"
          element={
            <RoleBasedRoute allowedRoles={[ROLES.CLIENT, ROLES.MANAGER, ROLES.ADMIN]}>
              <MyOrdersPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="/manage-orders"
          element={
            <RoleBasedRoute allowedRoles={[ROLES.MANAGER, ROLES.ADMIN]}>
              <ManagerOrdersPage />
            </RoleBasedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal />
    </BrowserRouter>
  )
}
