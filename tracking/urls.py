from rest_framework.routers import DefaultRouter

from .views import TagViewSet, ActivityViewSet

router = DefaultRouter()
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'activities', ActivityViewSet, basename='activity')

app_name = 'tracking'
urlpatterns = router.urls
