# Generated by Django 2.2rc1 on 2019-04-16 07:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0005_auto_20190402_0451'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='number_of_students',
        ),
        migrations.RemoveField(
            model_name='project',
            name='number_of_students',
        ),
    ]
