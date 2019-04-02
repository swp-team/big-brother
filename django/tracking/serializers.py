from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Activity, Faculty, Student, Course, Project


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ('id', 'name', 'start', 'end', 'tags')
        read_only_fields = ('id',)

    def validate(self, data):
        if 'end' in data and data['end'] is not None:
            start = None
            if 'start' in data:
                start = data['start']
            elif self.instance is not None:
                start = self.instance.start
            # If start exists and it is greater or equal to end then fail
            if start is not None and data['end'] <= start:
                raise ValidationError({
                    'end': "End should be greater than start"
                })
        return data


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ('id', 'email', 'first_name', 'second_name')
        read_only_fields = ('id', )


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'email', 'first_name', 'second_name')
        read_only_fields = ('id', )


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'number_of_students', 'faculties', 'students')
        read_only_fields = ('id', )


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'number_of_students', 'description', 'participants', 'course')
        read_only_fields = ('id', )
