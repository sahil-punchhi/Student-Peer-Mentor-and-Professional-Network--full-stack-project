# Generated by Django 3.0.8 on 2020-08-03 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0015_person_resume'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='id',
            field=models.PositiveIntegerField(primary_key=True, serialize=False),
        ),
    ]
