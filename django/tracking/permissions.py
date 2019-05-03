from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Faculty, Student


class StaffPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff


class FacultyPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or isinstance(request.user, Faculty)


class StudentPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or isinstance(request.user, Student)
