from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from django.db import IntegrityError
from django.forms.models import model_to_dict
from  django.core import serializers

from rest_framework import status
from rest_framework.test import APITestCase

import json

from authentication.models import User

from .models import Activity, Student, Faculty, Course, Project


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

    def test_start_and_end_constraint(self):
        with self.assertRaises(IntegrityError):
            Activity.objects.create(
                name='SWP sprint',
                start=timezone.now(),
                end=timezone.now() - timedelta(days=1),
            )


class PermissionTest(APITestCase):
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
        self.first_user = Student.objects.create_user(
            email='daniel@example.com',
            first_name="Daniel",
            second_name="Craig",
            password='qwerty123',
        )

        self.admin = User.objects.create_superuser(
            email='admin@example.com',
            first_name="Admin",
            second_name="Staff",
            password='qwerty123',
        )
        self.faculty = Faculty.objects.create_user(
            email='ivan@example.com',
            first_name="Ivan",
            second_name="Pavlov",
            password='qwerty123',
        )

        self.course = Course.objects.create(
            name="SWP Course",
            number_of_students=110,
        )
        self.course.faculties.set([self.faculty])
        self.course.students.set([self.first_user])

    def test_get_for_admins(self):
        response = self.get_response(
            'tracking:faculty-list',
            self.admin,
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(0, len(response.data))

    def test_get_for_non_admins(self):
        response = self.get_response(
            'tracking:faculty-list',
            self.first_user,
        )
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data))

    def test_post_for_admins(self):
        response = self.post_response(
            'tracking:faculty-list',
            self.admin,
            data={
            'email': 'andrew@example.com',
            'first_name':"Andrew",
            'second_name':"Scott",
            'password':'qwerty123',
            }
        )
        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(4, len(response.data))

    def test_post_for_non_admins(self):
        response = self.post_response(
            'tracking:faculty-list',
            self.first_user,
            data={
                'email': 'andrew@example.com',
                'first_name': "Andrew",
                'second_name': "Scott",
                'password': 'qwerty123',
            }
        )
        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)
        self.assertEqual(1, len(response.data))

    def test_get_for_faculties(self):
        response = self.get_response(
            'tracking:project-list',
            self.first_user,
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(0, len(response.data))


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

    def test_empty_faculties(self):
        response = self.get_response(
            'tracking:faculty-list',
            self.user,
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(0, len(response.data))
