from rest_framework.routers import DefaultRouter

from .views import ActivityViewSet

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')

app_name = 'tracking'
urlpatterns = router.urls
