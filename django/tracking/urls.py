from rest_framework.routers import DefaultRouter

from .views import (
    ActivityViewSet,
    FacultyEndpoint,
    StudentEndpoint,
    CourseEndpoint,
    ProjectEndpoint,
)

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'faculties', FacultyEndpoint, basename='faculty')
router.register(r'students', StudentEndpoint, basename='student')
router.register(r'courses', CourseEndpoint, basename='course')
router.register(r'projects', ProjectEndpoint, basename='project')

app_name = 'tracking'
urlpatterns = router.urls
