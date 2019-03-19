from django.db import models
from django.db.models import Q, F
from django.core.exceptions import ValidationError


class Tag(models.Model):
    name = models.CharField(max_length=32)
    user = models.ForeignKey(
        'authentication.User',
        related_name='tags',
        on_delete=models.CASCADE,
    )


class Activity(models.Model):
    name = models.CharField(max_length=128)
    start = models.DateTimeField()
    end = models.DateTimeField(null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='activities',
                                  blank=True)
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


class ActivityTagBinding(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('tag', 'activity')

    def save(self, *args, **kwargs):
        if self.tag.user_id != self.activity.user_id:
            raise ValidationError(
                "Tag's user should be the same as activity's user"
            )
        return super().save(*args, **kwargs)
