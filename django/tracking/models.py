from django.db import models
from django.db.models import Q, F
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError

from .validators import validate_distinct_list

from authentication.models import User


class Student(User):
    pass


class Faculty(User):
    pass


class Activity(models.Model):
    name = models.CharField(max_length=128)
    start = models.DateTimeField()
    end = models.DateTimeField(null=True, blank=True)

    tags = ArrayField(
        models.SlugField(max_length=32),
        validators=[validate_distinct_list],
        default=list,
        size=8,
    )

    project = models.ForeignKey(
        'Project',
        related_name='activities',
        on_delete=models.CASCADE,
    )

    participants = models.ManyToManyField(
        'Student',
    )

    class Meta:
        ordering = ['-start']
        constraints = [
            # Check that end datetime is greater than start datetime
            models.CheckConstraint(
                name='end_gt_start',
                check=Q(end__isnull=True) | Q(end__gt=F('start')),
            ),
        ]

    def clean(self):
        if self.end is not None and self.end <= self.start:
            raise ValidationError("End should be greater than start")


class Course(models.Model):
    name = models.CharField(max_length=200)

    faculties = models.ManyToManyField(
        'Faculty',
        related_name='courses',
    )

    students = models.ManyToManyField(
        'Student',
        related_name='courses',
    )


class Project(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()

    participants = models.ManyToManyField(
        'Student',
    )

    course = models.ForeignKey(
        'Course',
        related_name='projects',
        on_delete=models.CASCADE,
    )
