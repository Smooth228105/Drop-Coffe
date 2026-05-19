from rest_framework.permissions import BasePermission

from .constants import ROLE_ADMIN, ROLE_CLIENT, ROLE_MANAGER
from .role_utils import get_user_role


class IsAuthenticatedClient(BasePermission):
    """Клиент, менеджер или администратор."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return get_user_role(request.user) in (ROLE_CLIENT, ROLE_MANAGER, ROLE_ADMIN)


class IsManager(BasePermission):
    """Менеджер или администратор."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return get_user_role(request.user) in (ROLE_MANAGER, ROLE_ADMIN)


class IsAdmin(BasePermission):
    """Только администратор."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return get_user_role(request.user) == ROLE_ADMIN
