# Generated by Django 2.2rc1 on 2019-03-19 17:30

import django.contrib.postgres.fields
from django.db import migrations, models
import tracking.validators


class Migration(migrations.Migration):

    dependencies = [
        ('tracking', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='tags',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.SlugField(max_length=32), default=list, size=8, validators=[tracking.validators.validate_distinct_list]),
        ),
    ]
