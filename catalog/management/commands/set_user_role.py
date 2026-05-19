from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from catalog.constants import ROLE_ADMIN, ROLE_CLIENT, ROLE_MANAGER
from catalog.models import UserProfile


class Command(BaseCommand):
    help = 'Назначить роль пользователю (client, manager, admin)'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str)
        parser.add_argument(
            'role',
            type=str,
            choices=[ROLE_CLIENT, ROLE_MANAGER, ROLE_ADMIN],
        )

    def handle(self, *args, **options):
        try:
            user = User.objects.get(username=options['username'])
        except User.DoesNotExist:
            self.stderr.write(self.style.ERROR('Пользователь не найден'))
            return

        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={'role': options['role']})
        profile.role = options['role']
        profile.save(update_fields=['role'])
        self.stdout.write(
            self.style.SUCCESS(
                f'Роль {options["role"]} назначена пользователю {user.username}',
            ),
        )
