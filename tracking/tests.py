from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.test import APITestCase

from authentication.models import User

from .models import Tag, Activity, ActivityTagBinding


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
        with self.assertRaises(IntegrityError):
            Activity.objects.create(
                name='SWP sprint',
                start=timezone.now(),
                end=timezone.now() - timedelta(days=1),
            )

    def test_tags_contraint(self):
        activity = Activity.objects.create(
            name='Just Simple Activity',
            start=timezone.now(),
            user=self.first_user,
        )
        with self.assertRaises(ValidationError):
            ActivityTagBinding.objects.create(
                activity=activity,
                tag=self.second_user_tag,
            )


class ActivityAPITestCase(APITestCase):
    def get_response(self, url, user=None, kwargs=None):
        if kwargs is None:
            kwargs = {}
        url = reverse(url, kwargs=kwargs)
        if user is not None:
            self.client.force_authenticate(user=user)
        return self.client.get(url)

    def post_response(self, url, user=None,
                      kwargs=None, data=None, format='json'):
        if kwargs is None:
            kwargs = {}
        if data is None:
            data = {}
        url = reverse(url, kwargs=kwargs)
        if user is not None:
            self.client.force_authenticate(user=user)
        return self.client.post(url, data, format=format)

    def setUp(self):
        self.user = User.objects.create_user(
            email='ivan@example.com',
            first_name="Ivan",
            second_name="Pavlov",
            password='qwerty123',
        )

    def test_empty_activities_list(self):
        response = self.get_response(
            'tracking:activity-list',
            user=self.user,
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(0, len(response.data))