from .constants import ROLE_ADMIN, ROLE_CLIENT, ROLE_MANAGER
from .models import UserProfile


def get_user_role(user) -> str:
    if user is None or not getattr(user, 'is_authenticated', False):
        return 'guest'
    if user.is_superuser:
        return ROLE_ADMIN
    profile = UserProfile.objects.filter(user=user).first()
    if profile is None:
        return ROLE_CLIENT
    return profile.role


def ensure_user_profile(user, role: str | None = None) -> UserProfile:
    profile, created = UserProfile.objects.get_or_create(
        user=user,
        defaults={'role': role or ROLE_CLIENT},
    )
    if not created and role and profile.role != role:
        profile.role = role
        profile.save(update_fields=['role'])
    if user.is_superuser and profile.role != ROLE_ADMIN:
        profile.role = ROLE_ADMIN
        profile.save(update_fields=['role'])
    return profile
