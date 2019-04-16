from django.core.management.base import BaseCommand

from tracking.models import Student, Faculty, Course, Project


class Command(BaseCommand):
    help = "Fills database with testing objects"

    def handle(self, *args, **kwargs):
        first_student = Student.objects.create_user(
            email='an.volkov@innopolis.ru',
            password='qwerty123',
            first_name='Andrey',
            second_name='Volkov',
        )

        second_student = Student.objects.create_user(
            email='i.komarov@innopolis.ru',
            password='qwerty123',
            first_name='Ivan',
            second_name='Komarov',
        )

        faculty = Faculty.objects.create_user(
            email='g.succi@innopolis.ru',
            password='qwerty123',
            first_name='Giancarlo',
            second_name='Succi',
        )

        course = Course.objects.create(name='Networks')
        course.faculties.set([faculty])
        course.students.set([first_student, second_student])

        project = Project.objects.create(
            name='Torrent Tracker',
            description='Application for tracking torrent files',
            course=course,
        )
        project.participants.set([first_student, second_student])
