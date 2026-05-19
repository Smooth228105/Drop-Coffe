from django.db import migrations


def create_profiles(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    UserProfile = apps.get_model('catalog', 'UserProfile')

    for user in User.objects.all():
        if UserProfile.objects.filter(user=user).exists():
            continue
        role = 'admin' if user.is_superuser else 'client'
        UserProfile.objects.create(user=user, role=role)


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0003_order_userprofile_orderitem'),
    ]

    operations = [
        migrations.RunPython(create_profiles, migrations.RunPython.noop),
    ]
