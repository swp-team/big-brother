from django.test import TestCase
from django.db import IntegrityError
from django.utils import timezone

from authentication.models import User

from .models import Tag, Activity, TaggedActivity


class ActivityModelTestCase(TestCase):
    def setUp(self):
        self.first_user = User.objects.create_user(
            email='daniel@example.com',
            first_name="Daniel",
            second_name="Craig",
            password='qwerty123',
        )
        self.second_user = User.objects.create_user(
            email='andrew@example.com',
            first_name="Andrew",
            second_name="Scott",
            password='qwerty123',
        )
        self.first_user_tag = Tag.objects.create(
            name='daniel_tag',
            user=self.first_user,
        )
        self.second_user_tag = Tag.objects.create(
            name='andrew_tag',
            user=self.second_user,
        )

    def test_start_and_end_constraint(self):
        pass

    def test_tags_contraint(self):
        activity = Activity.objects.create(
            name='Just Simple Activity',
            start=timezone.now(),
            user=self.first_user,
        )
        with self.assertRaises(IntegrityError):
            TaggedActivity.objects.create(
                activity=activity,
                tag=self.second_user_tag,
            )
