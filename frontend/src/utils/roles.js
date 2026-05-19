export const ROLES = {
  GUEST: 'guest',
  CLIENT: 'client',
  MANAGER: 'manager',
  ADMIN: 'admin',
}

export const ORDER_STATUSES = {
  processing: { label: 'Обработка заказа', color: 'bg-amber-100 text-amber-800' },
  picking: { label: 'Сборка на складе', color: 'bg-blue-100 text-blue-800' },
  in_delivery: { label: 'Доставлен по адресу', color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Заказ доставлен', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Заказ отменен', color: 'bg-red-100 text-red-800' },
}

export function getRole(user) {
  if (!user) {
    return ROLES.GUEST
  }
  return user.role || ROLES.CLIENT
}

export function isGuest(user) {
  return getRole(user) === ROLES.GUEST
}

export function isClient(user) {
  return getRole(user) === ROLES.CLIENT
}

export function isManager(user) {
  return getRole(user) === ROLES.MANAGER
}

export function isAdmin(user) {
  return getRole(user) === ROLES.ADMIN
}

export function canUseCart(user) {
  const role = getRole(user)
  return role === ROLES.CLIENT || role === ROLES.MANAGER || role === ROLES.ADMIN
}

export function canManageOrders(user) {
  return isManager(user) || isAdmin(user)
}

export function canManageProducts(user) {
  return isAdmin(user)
}

export function hasRole(user, allowedRoles) {
  return allowedRoles.includes(getRole(user))
}
