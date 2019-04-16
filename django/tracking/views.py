from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Activity, Faculty, Student, Course, Project
from .serializers import (
    ActivitySerializer,
    FacultySerializer,
    StudentSerializer,
    CourseSerializer,
    ProjectSerializer,
)


class ActivityViewSet(ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if isinstance(self.request.user, Student):
            return Activity.objects.filter(
                project__participants=self.request.user)
        elif isinstance(self.request.user, Faculty):
            return Activity.objects.filter(
                project__course__faculties=self.request.user)
        return Activity.objects.none()


class FacultyEndpoint(ModelViewSet):
    serializer_class = FacultySerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        if isinstance(self.request.user, Student):
            return Faculty.objects.filter(
                courses__students=self.request.user)
        elif isinstance(self.request.user, Faculty):
            return Faculty.objects.filter(
                courses__faculties=self.request.user)
        return Faculty.objects.none()


class StudentEndpoint(ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        if isinstance(self.request.user, Student):
            return Student.objects.filter(
                courses__students=self.request.user)
        elif isinstance(self.request.user, Faculty):
            return Student.objects.filter(
                courses__faculties=self.request.user)
        return Student.objects.none()


class CourseEndpoint(ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        if isinstance(self.request.user, Student):
            return Course.objects.filter(students=self.request.user)
        elif isinstance(self.request.user, Faculty):
            return Course.objects.filter(faculties=self.request.user)
        return Course.objects.none()


class ProjectEndpoint(ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        if isinstance(self.request.user, Student):
            return Project.objects.filter(participants=self.request.user)
        elif isinstance(self.request.user, Faculty):
            return Project.objects.filter(course__faculties=self.request.user)
        return Project.objects.none()
