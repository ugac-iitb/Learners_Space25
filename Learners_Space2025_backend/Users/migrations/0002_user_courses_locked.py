# Generated manually for course lock-in support.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='courses_locked',
            field=models.BooleanField(default=False),
        ),
    ]
