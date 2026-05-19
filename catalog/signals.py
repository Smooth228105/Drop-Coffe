from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .constants import ROLE_ADMIN, ROLE_CLIENT
from .models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        role = ROLE_ADMIN if instance.is_superuser else ROLE_CLIENT
        UserProfile.objects.create(user=instance, role=role)
        return

    profile = UserProfile.objects.filter(user=instance).first()
    if profile is None:
        role = ROLE_ADMIN if instance.is_superuser else ROLE_CLIENT
        UserProfile.objects.create(user=instance, role=role)
    elif instance.is_superuser and profile.role != ROLE_ADMIN:
        profile.role = ROLE_ADMIN
        profile.save(update_fields=['role'])
