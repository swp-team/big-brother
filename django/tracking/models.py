from django.db import models
from django.db.models import Q, F
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError

from .validators import validate_distinct_list


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

    user = models.ForeignKey(
        'authentication.User',
        related_name='activities',
        on_delete=models.CASCADE,
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
