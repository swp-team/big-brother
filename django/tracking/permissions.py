from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Faculty, Student, Course, Activity


class StaffPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user.is_staff


class FacultyPermissions(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        print(1)
        return request.user.is_staff or isinstance(request.user, Faculty)

    def has_object_permission(self, request, view, obj):
        print(2)
        if request.user.is_staff:
            return True
        return self.obj.filter(course__faculties=request.user).exists()



class StudentPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if request.user.is_staff:
            return True
        return obj.filter(course__faculties=self.request.user).exists()
